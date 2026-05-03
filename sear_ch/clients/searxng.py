from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from difflib import SequenceMatcher
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from ..core.config import Settings, VALID_TIME_RANGES
from ..models.schemas import SearchFilters, SearchResponse, SearchResult
from ..services.search import SearchProvider


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    if not isinstance(value, str):
        return str(value)
    return " ".join(value.split())


def _clean_url(value: Any) -> str:
    cleaned = _clean_text(value)
    if cleaned.startswith("//"):
        return f"https:{cleaned}"
    return cleaned


def _extract_image_candidates(value: Any) -> list[str]:
    candidates: list[str] = []
    seen: set[str] = set()

    def remember(candidate: Any) -> None:
        cleaned = _clean_url(candidate)
        if not cleaned or cleaned in seen:
            return
        seen.add(cleaned)
        candidates.append(cleaned)

    if isinstance(value, dict):
        for key in ("url", "src", "image", "image_url", "thumbnail", "thumbnail_src", "content", "href"):
            remember(value.get(key))
    elif isinstance(value, list):
        for item in value:
            if len(candidates) >= 4:
                break
            if isinstance(item, (dict, list)):
                for nested in _extract_image_candidates(item):
                    remember(nested)
            else:
                remember(item)
    else:
        remember(value)

    return candidates


def _merge_image_candidates(*values: Any) -> list[str]:
    merged: list[str] = []
    seen: set[str] = set()
    for value in values:
        for candidate in _extract_image_candidates(value):
            if candidate in seen:
                continue
            seen.add(candidate)
            merged.append(candidate)
    return merged


def _normalize_people(value: Any) -> str | None:
    if value in (None, ""):
        return None

    if isinstance(value, dict):
        for key in ("name", "author", "title"):
            candidate = _clean_text(value.get(key))
            if candidate:
                return candidate
        return None

    if isinstance(value, list):
        cleaned_people: list[str] = []
        seen: set[str] = set()
        for item in value:
            candidate = _normalize_people(item)
            if not candidate or candidate in seen:
                continue
            cleaned_people.append(candidate)
            seen.add(candidate)
            if len(cleaned_people) >= 2:
                break
        return ", ".join(cleaned_people) if cleaned_people else None

    cleaned = _clean_text(value)
    return cleaned or None


def _normalize_published_date(value: Any) -> str | None:
    if value in (None, ""):
        return None

    if isinstance(value, (int, float)):
        timestamp = float(value)
        if timestamp > 1_000_000_000_000:
            timestamp /= 1000
        try:
            return datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()
        except (OverflowError, OSError, ValueError):
            return None

    if isinstance(value, str):
        cleaned = _clean_text(value)
        if not cleaned:
            return None
        if cleaned.isdigit():
            return _normalize_published_date(int(cleaned))
        return cleaned

    return _clean_text(value) or None


def _coerce_float(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _normalize_boundingbox(value: Any) -> list[float] | None:
    if not isinstance(value, list) or len(value) != 4:
        return None

    points: list[float] = []
    for entry in value:
        coerced = _coerce_float(entry)
        if coerced is None:
            return None
        points.append(coerced)
    return points


def _normalize_metadata_object(value: Any) -> dict[str, object] | None:
    if not isinstance(value, dict):
        return None

    normalized: dict[str, object] = {}
    for key, item in value.items():
        cleaned_key = _clean_text(key)
        if not cleaned_key:
            continue
        if item is None:
            normalized[cleaned_key] = None
        elif isinstance(item, bool):
            normalized[cleaned_key] = item
        elif isinstance(item, (int, float, str)):
            normalized[cleaned_key] = _clean_text(item)

    return normalized or None


def _pick_first_text(item: dict[str, Any], keys: tuple[str, ...]) -> str | None:
    for key in keys:
        value = _clean_text(item.get(key))
        if value:
            return value
    return None


def _pick_first_url(item: dict[str, Any], keys: tuple[str, ...]) -> str | None:
    for key in keys:
        value = _clean_url(item.get(key))
        if value:
            return value
    return None


class SearxngError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class SearxngClient(SearchProvider):
    id = "searxng"
    label = "SearXNG"
    capabilities = ("search", "autocomplete", "news", "images", "videos", "map")
    general_fallback_engines = ("google", "duckduckgo", "bing", "wikipedia")
    general_sparse_result_threshold = 3
    zero_result_retry_attempts = 3
    max_results_per_request = 20

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.base_url = settings.searxng_base_url

    def search(
        self,
        query: str,
        *,
        categories: str | None = None,
        language: str | None = None,
        page: int = 1,
        safesearch: int | None = None,
        time_range: str | None = None,
        engines: str | None = None,
    ) -> SearchResponse:
        resolved_categories = categories or self.settings.default_categories
        resolved_language = language or self.settings.default_language
        explicit_engines_requested = engines is not None and bool(_clean_text(engines))
        resolved_time_range = self._resolve_time_range(
            resolved_categories,
            time_range,
        )
        resolved_engines = self._resolve_engines(
            resolved_categories,
            engines,
        )
        params: dict[str, Any] = {
            "q": query,
            "format": "json",
            "pageno": page,
            "categories": resolved_categories,
            "language": resolved_language,
            "safesearch": (
                self.settings.default_safe_search
                if safesearch is None
                else safesearch
            ),
        }
        if resolved_time_range:
            params["time_range"] = resolved_time_range
        if resolved_engines:
            params["engines"] = resolved_engines

        payload, results = self._request_search_payload_with_zero_result_retries(
            params,
            categories=resolved_categories,
            page=page,
        )

        retry_engines = self._resolve_general_retry_engines(
            categories=resolved_categories,
            page=page,
            explicit_engines_requested=explicit_engines_requested,
            resolved_engines=resolved_engines,
            result_count=len(results),
        )
        if retry_engines:
            retry_params = dict(params)
            retry_params["engines"] = retry_engines
            retry_payload, retry_results = self._request_search_payload_with_zero_result_retries(
                retry_params,
                categories=resolved_categories,
                page=page,
            )
            if len(retry_results) > len(results):
                payload = retry_payload
                params = retry_params
                resolved_engines = retry_engines
                results = retry_results

        if (
            not results
            and page == 1
            and self._supports_infobox_fallback(resolved_categories)
        ):
            results = self._normalize_infobox_results(payload.get("infoboxes", []))
        page_result_count = len(results)
        total_results, total_results_known = self._extract_total_results(
            payload,
            page_result_count,
        )
        suggestions = self._normalize_search_suggestions(payload, query)
        return SearchResponse(
            query=query,
            provider=self.id,
            page=page,
            total_results=total_results,
            filters=SearchFilters(
                categories=resolved_categories,
                language=resolved_language,
                safesearch=params["safesearch"],
                time_range=resolved_time_range or None,
                engines=resolved_engines or None,
            ),
            results=results,
            suggestions=suggestions,
            page_result_count=page_result_count,
            total_results_known=total_results_known,
            has_more_pages=self._extract_has_more_pages(
                payload,
                page=page,
                page_result_count=page_result_count,
                total_results=total_results,
                total_results_known=total_results_known,
            ),
        )

    def _request_search_payload_with_zero_result_retries(
        self,
        params: dict[str, Any],
        *,
        categories: str,
        page: int,
    ) -> tuple[Any, list[SearchResult]]:
        payload: Any = {}
        results: list[SearchResult] = []

        for _ in range(self.zero_result_retry_attempts):
            payload = self._request_json(
                "/search",
                params,
                accept="application/json",
            )
            results = self._normalize_results(payload)
            if results or self._has_visible_fallback_results(
                payload,
                categories=categories,
                page=page,
            ):
                break

        return payload, results

    def _has_visible_fallback_results(
        self,
        payload: Any,
        *,
        categories: str,
        page: int,
    ) -> bool:
        if (
            page == 1
            and self._supports_infobox_fallback(categories)
            and isinstance(payload, dict)
        ):
            return bool(self._normalize_infobox_results(payload.get("infoboxes", [])))
        return False

    def _normalize_results(self, payload: Any) -> list[SearchResult]:
        if not isinstance(payload, dict):
            return []
        return [
            self._normalize_result(item)
            for item in payload.get("results", [])
            if isinstance(item, dict)
        ][: self.max_results_per_request]

    def autocomplete(
        self,
        query: str,
        *,
        provider: str | None = None,
        limit: int | None = None,
    ) -> list[str]:
        params: dict[str, Any] = {
            "q": query,
        }
        if provider:
            params["autocomplete"] = provider

        payload = self._request_json(
            "/autocompleter",
            params,
            accept="application/x-suggestions+json, application/json",
        )
        resolved_limit = max(1, int(limit or self.settings.autocomplete_limit))
        return self._normalize_suggestions(payload)[:resolved_limit]

    def healthcheck(self) -> tuple[str, str | None]:
        request = Request(
            self.settings.searxng_base_url,
            headers={
                "User-Agent": self.settings.user_agent,
            },
        )
        try:
            with urlopen(request, timeout=self.settings.searxng_timeout_seconds) as response:
                status = getattr(response, "status", 200)
        except (HTTPError, URLError, TimeoutError):
            return ("offline", "Unable to reach the configured SearXNG instance.")

        if status >= 400:
            return ("degraded", f"SearXNG responded with HTTP {status}.")
        return ("ok", "Connected.")

    def _normalize_result(self, item: dict[str, Any]) -> SearchResult:
        title = _clean_text(item.get("title")) or _clean_text(item.get("url")) or "Untitled result"
        content = _clean_text(item.get("content")) or _clean_text(item.get("description"))
        engine = self._normalize_engine_label(item)
        url = _clean_url(item.get("url"))
        result_id = hashlib.sha1(f"{url}|{title}".encode("utf-8")).hexdigest()[:12]
        osm = _normalize_metadata_object(item.get("osm"))
        image_candidates = _merge_image_candidates(
            item.get("img_src"),
            item.get("thumbnail_src"),
            item.get("thumbnail"),
            item.get("image"),
            item.get("image_url"),
            item.get("images"),
            item.get("media"),
        )

        return SearchResult(
            id=result_id,
            title=title,
            url=url,
            content=content,
            engine=engine or None,
            category=_clean_text(item.get("category")) or None,
            provider=self.id,
            image_url=(image_candidates[0] if image_candidates else None),
            thumbnail_url=(image_candidates[1] if len(image_candidates) > 1 else (image_candidates[0] if image_candidates else None)),
            source=_clean_text(item.get("source")) or None,
            author=(
                _normalize_people(item.get("author"))
                or _normalize_people(item.get("authors"))
                or _normalize_people(item.get("byline"))
            ),
            published_date=(
                _normalize_published_date(item.get("publishedDate"))
                or _normalize_published_date(item.get("published_date"))
                or _normalize_published_date(item.get("pubDate"))
                or _normalize_published_date(item.get("pubdate"))
                or _normalize_published_date(item.get("date"))
                or _normalize_published_date(item.get("datetime"))
            ),
            resolution=_clean_text(item.get("resolution")) or None,
            latitude=_coerce_float(item.get("latitude")),
            longitude=_coerce_float(item.get("longitude")),
            boundingbox=_normalize_boundingbox(item.get("boundingbox")),
            address=_normalize_metadata_object(item.get("address")),
            address_label=_clean_text(item.get("address_label")) or None,
            osm=osm,
            place_type=_clean_text(item.get("type")) or None,
            type_icon=_clean_text(item.get("type_icon")) or None,
            website=(
                _pick_first_url(item, ("website", "homepage", "contact:website", "url:official"))
                or _pick_first_url(osm or {}, ("website", "homepage", "contact:website", "url:official"))
            ),
            phone=(
                _pick_first_text(item, ("phone", "telephone", "contact:phone", "contact:mobile"))
                or _pick_first_text(osm or {}, ("phone", "telephone", "contact:phone", "contact:mobile"))
            ),
        )

    def _normalize_infobox_results(self, items: Any) -> list[SearchResult]:
        normalized_items = items if isinstance(items, list) else []
        results: list[SearchResult] = []

        for item in normalized_items:
            if not isinstance(item, dict):
                continue

            normalized_result = self._normalize_infobox_result(item)
            if normalized_result is None:
                continue
            results.append(normalized_result)
            if len(results) >= self.max_results_per_request:
                break

        return results

    def _normalize_infobox_result(self, item: dict[str, Any]) -> SearchResult | None:
        primary_url, primary_source = self._extract_primary_infobox_link(item.get("urls"))
        url = _clean_url(item.get("url")) or _clean_url(item.get("id")) or primary_url
        title = (
            _clean_text(item.get("title"))
            or _clean_text(item.get("infobox"))
            or primary_source
            or _clean_text(url)
        )
        if not url or not title:
            return None

        content = _clean_text(item.get("content")) or _clean_text(item.get("description"))
        image_candidates = _merge_image_candidates(
            item.get("img_src"),
            item.get("thumbnail_src"),
            item.get("thumbnail"),
            item.get("image"),
            item.get("image_url"),
            item.get("images"),
            item.get("media"),
        )
        result_id = hashlib.sha1(f"{url}|{title}".encode("utf-8")).hexdigest()[:12]

        return SearchResult(
            id=result_id,
            title=title,
            url=url,
            content=content,
            engine=self._normalize_engine_label(item) or None,
            category=_clean_text(item.get("category")) or "general",
            provider=self.id,
            image_url=(image_candidates[0] if image_candidates else None),
            thumbnail_url=(image_candidates[1] if len(image_candidates) > 1 else (image_candidates[0] if image_candidates else None)),
            source=_clean_text(item.get("source")) or primary_source or None,
        )

    def _extract_primary_infobox_link(self, value: Any) -> tuple[str, str]:
        if not isinstance(value, list):
            return ("", "")

        for entry in value:
            if not isinstance(entry, dict):
                continue

            url = _clean_url(entry.get("url"))
            if not url:
                continue
            return (url, _clean_text(entry.get("title")))

        return ("", "")

    def _normalize_engine_label(self, item: dict[str, Any]) -> str:
        engines = item.get("engines")
        if isinstance(engines, list):
            return ", ".join(str(entry) for entry in engines)
        return _clean_text(item.get("engine")) or _clean_text(engines)

    def _supports_infobox_fallback(self, categories: str | None) -> bool:
        return "general" in self._iter_category_keys(categories)

    def _resolve_general_retry_engines(
        self,
        *,
        categories: str | None,
        page: int,
        explicit_engines_requested: bool,
        resolved_engines: str,
        result_count: int,
    ) -> str:
        if explicit_engines_requested or page != 1:
            return ""
        if not self._supports_infobox_fallback(categories):
            return ""
        if not resolved_engines or result_count >= self.general_sparse_result_threshold:
            return ""

        current_engines = self._parse_engine_names(resolved_engines)
        fallback_engines = self._filter_allowed_engines(
            list(self.general_fallback_engines),
        )
        expanded_engines = list(current_engines)
        for engine in fallback_engines:
            if engine in expanded_engines:
                continue
            expanded_engines.append(engine)

        if expanded_engines == current_engines:
            return ""
        return ",".join(expanded_engines)

    def _normalize_suggestions(self, payload: Any) -> list[str]:
        if isinstance(payload, list) and len(payload) >= 2 and isinstance(payload[1], list):
            suggestions = payload[1]
        elif isinstance(payload, dict):
            suggestions = payload.get("suggestions", [])
        elif isinstance(payload, list):
            suggestions = payload
        else:
            suggestions = []

        cleaned: list[str] = []
        seen: set[str] = set()
        for item in suggestions:
            value = self._extract_suggestion_text(item)
            if not value or value in seen:
                continue
            cleaned.append(value)
            seen.add(value)
        return cleaned

    def _extract_suggestion_text(self, item: Any) -> str:
        if isinstance(item, dict):
            for key in ("suggestion", "query", "text", "value", "title"):
                value = _clean_text(item.get(key))
                if value:
                    return value
            return ""

        return _clean_text(item)

    def _normalize_search_suggestions(self, payload: Any, query: str) -> list[str]:
        suggestions: list[str] = []
        if isinstance(payload, dict):
            for key in ("suggestions", "corrections", "spellcheck", "spelling"):
                suggestions.extend(self._normalize_suggestions(payload.get(key, [])))

        suggestions = self._filter_query_suggestions(
            query,
            suggestions,
            correction_like_only=True,
        )
        if suggestions:
            return suggestions[: self.settings.autocomplete_limit]

        try:
            autocomplete_suggestions = self.autocomplete(
                query,
                provider=self.settings.default_autocomplete_provider or None,
            )
        except SearxngError:
            autocomplete_suggestions = []

        return self._filter_query_suggestions(
            query,
            autocomplete_suggestions,
            correction_like_only=True,
        )[: self.settings.autocomplete_limit]

    def _filter_query_suggestions(
        self,
        query: str,
        suggestions: list[str],
        *,
        correction_like_only: bool = False,
    ) -> list[str]:
        normalized_query = _clean_text(query).casefold()
        filtered: list[str] = []
        seen: set[str] = {normalized_query}

        for suggestion in suggestions:
            value = _clean_text(suggestion)
            normalized_value = value.casefold()
            if not value or normalized_value in seen:
                continue
            if correction_like_only and not self._looks_like_query_correction(query, value):
                continue
            filtered.append(value)
            seen.add(normalized_value)

        return filtered

    def _looks_like_query_correction(self, query: str, suggestion: str) -> bool:
        normalized_query = _clean_text(query).casefold()
        normalized_suggestion = _clean_text(suggestion).casefold()
        compact_query = self._compact_query_key(query)
        compact_suggestion = self._compact_query_key(suggestion)

        if not normalized_query or not normalized_suggestion:
            return False
        if compact_query and compact_query == compact_suggestion:
            return True
        if compact_query and compact_suggestion.startswith(compact_query):
            return False
        if compact_suggestion and compact_query.startswith(compact_suggestion):
            return False

        return SequenceMatcher(None, normalized_query, normalized_suggestion).ratio() >= 0.82

    def _compact_query_key(self, value: str) -> str:
        return "".join(character for character in _clean_text(value).casefold() if character.isalnum())

    def _normalize_time_range(self, value: str | None) -> str:
        normalized = _clean_text(value).lower()
        return normalized if normalized in VALID_TIME_RANGES else ""

    def _coerce_positive_int(self, value: Any) -> int | None:
        if isinstance(value, bool) or value in (None, ""):
            return None
        try:
            normalized = int(str(value).strip())
        except (TypeError, ValueError):
            return None
        return normalized if normalized > 0 else None

    def _extract_total_results(
        self,
        payload: Any,
        page_result_count: int,
    ) -> tuple[int, bool]:
        if not isinstance(payload, dict):
            return (page_result_count, False)

        for key in (
            "number_of_results",
            "total_results",
            "totalResults",
            "results_count",
            "resultsCount",
        ):
            total_results = self._coerce_positive_int(payload.get(key))
            if total_results is None:
                continue
            return (max(total_results, page_result_count), True)

        return (page_result_count, False)

    def _extract_has_more_pages(
        self,
        payload: Any,
        *,
        page: int,
        page_result_count: int,
        total_results: int,
        total_results_known: bool,
    ) -> bool | None:
        if page_result_count <= 0:
            return False
        if not isinstance(payload, dict):
            return None

        for key in ("has_more_pages", "has_more", "has_next_page", "has_next"):
            candidate = payload.get(key)
            if isinstance(candidate, bool):
                return candidate

        for key in ("next_page", "nextpage"):
            candidate = self._coerce_positive_int(payload.get(key))
            if candidate is not None:
                return candidate > page

        paging = payload.get("paging")
        if isinstance(paging, dict):
            for key in ("has_more_pages", "has_more", "has_next_page", "has_next"):
                candidate = paging.get(key)
                if isinstance(candidate, bool):
                    return candidate
            for key in ("next_page", "nextpage", "next"):
                candidate = self._coerce_positive_int(paging.get(key))
                if candidate is not None:
                    return candidate > page

        if total_results_known and page == 1:
            return total_results > page_result_count

        return None

    def _resolve_time_range(
        self,
        categories: str | None,
        time_range: str | None,
    ) -> str:
        if time_range is not None:
            return self._normalize_time_range(time_range)

        for category in self._iter_category_keys(categories):
            if category == "news" and self.settings.news_default_time_range:
                return self._normalize_time_range(self.settings.news_default_time_range)

        return self._normalize_time_range(self.settings.default_time_range)

    def _resolve_engines(
        self,
        categories: str | None,
        engines: str | None,
    ) -> str:
        explicit_request = engines is not None and bool(_clean_text(engines))
        engine_names = self._parse_engine_names(
            engines if explicit_request else self._default_engines_for_categories(categories),
        )
        if not engine_names:
            return ""

        filtered_names = self._filter_allowed_engines(engine_names)
        if explicit_request and not filtered_names:
            raise SearxngError(
                400,
                "None of the requested engines are allowed by this sear_ch instance.",
            )
        return ",".join(filtered_names)

    def _default_engines_for_categories(self, categories: str | None) -> str:
        for category in self._iter_category_keys(categories):
            if category == "news" and self.settings.news_default_engines:
                return self.settings.news_default_engines
            if category == "images" and self.settings.images_default_engines:
                return self.settings.images_default_engines
            if category == "map" and self.settings.map_default_engines:
                return self.settings.map_default_engines
            if category == "it" and self.settings.it_default_engines:
                return self.settings.it_default_engines
            if category == "science" and self.settings.science_default_engines:
                return self.settings.science_default_engines

        return self.settings.default_engines

    def _iter_category_keys(self, categories: str | None) -> list[str]:
        resolved = _clean_text(categories or self.settings.default_categories).lower()
        keys: list[str] = []
        seen: set[str] = set()
        for part in resolved.split(","):
            key = part.strip()
            if not key:
                continue
            if key == "maps":
                key = "map"
            if key in seen:
                continue
            seen.add(key)
            keys.append(key)
        return keys or ["general"]

    def _parse_engine_names(self, value: str | None) -> list[str]:
        cleaned_value = _clean_text(value)
        if not cleaned_value:
            return []

        engines: list[str] = []
        seen: set[str] = set()
        for raw_part in cleaned_value.split(","):
            part = raw_part.strip().lower()
            if not part or part in seen:
                continue
            seen.add(part)
            engines.append(part)
        return engines

    def _filter_allowed_engines(self, engines: list[str]) -> list[str]:
        if not self.settings.allowed_engines:
            return engines

        allowed_map = {
            engine.casefold(): engine.lower()
            for engine in self.settings.allowed_engines
        }
        filtered: list[str] = []
        seen: set[str] = set()
        for engine in engines:
            canonical = allowed_map.get(engine.casefold())
            if not canonical or canonical in seen:
                continue
            seen.add(canonical)
            filtered.append(canonical)
        return filtered

    def _request_json(
        self,
        path: str,
        params: dict[str, Any],
        *,
        accept: str,
    ) -> Any:
        try:
            request = Request(
                f"{self.settings.searxng_base_url}{path}?{urlencode(params)}",
                headers={
                    "Accept": accept,
                    "User-Agent": self.settings.user_agent,
                },
            )
            with urlopen(
                request,
                timeout=self.settings.searxng_timeout_seconds,
            ) as response:
                return json.load(response)
        except HTTPError as exc:
            raise SearxngError(
                status_code=502,
                detail=f"SearXNG returned HTTP {exc.code}.",
            ) from exc
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise SearxngError(
                status_code=502,
                detail="Unable to reach the configured SearXNG instance.",
            ) from exc
