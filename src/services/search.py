from __future__ import annotations

from abc import ABC, abstractmethod
from collections import OrderedDict
from collections.abc import Iterable
import re
from threading import Lock
import time

from ..models.schemas import ProviderInfo, SearchResponse

NEWS_PREVIEW_TITLE_STOPWORDS = {
    "a",
    "an",
    "and",
    "at",
    "box",
    "for",
    "from",
    "in",
    "is",
    "movie",
    "news",
    "no",
    "of",
    "on",
    "or",
    "review",
    "story",
    "the",
    "to",
    "with",
}

NEWS_PREVIEW_CACHE_MAX_ENTRIES = 256
NEWS_PREVIEW_CACHE_TTL_SECONDS = 15 * 60
NewsPreviewCache = OrderedDict[str, tuple[float, str | None]]


class SearchServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class SearchProvider(ABC):
    id: str = ""
    label: str = ""
    kind: str = "search"
    capabilities: tuple[str, ...] = ("search",)
    base_url: str | None = None

    @abstractmethod
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
        raise NotImplementedError

    @abstractmethod
    def autocomplete(
        self,
        query: str,
        *,
        provider: str | None = None,
        limit: int | None = None,
    ) -> list[str]:
        raise NotImplementedError

    @abstractmethod
    def healthcheck(self) -> tuple[str, str | None]:
        raise NotImplementedError

    def describe(self, *, default: bool = False) -> ProviderInfo:
        status, detail = self.healthcheck()
        return ProviderInfo(
            id=self.id,
            label=self.label,
            kind=self.kind,
            default=default,
            base_url=self.base_url,
            capabilities=list(self.capabilities),
            status=status,
            detail=detail,
        )


class SearchService:
    def __init__(
        self,
        providers: Iterable[SearchProvider],
        default_provider: str,
        *,
        preview_reader: object | None = None,
        news_preview_enrichment_limit: int = 0,
    ) -> None:
        provider_map = {provider.id: provider for provider in providers}
        if not provider_map:
            raise ValueError("At least one search provider is required.")

        self.providers = provider_map
        self.default_provider = (
            default_provider if default_provider in provider_map else next(iter(provider_map))
        )
        self.preview_reader = preview_reader
        self.news_preview_enrichment_limit = max(0, news_preview_enrichment_limit)
        self._news_preview_cache: NewsPreviewCache = OrderedDict()
        self._news_preview_query_cache: NewsPreviewCache = OrderedDict()
        self._news_preview_cache_lock = Lock()

    def get_provider(self, provider_id: str | None = None) -> SearchProvider:
        resolved_provider = provider_id or self.default_provider
        provider = self.providers.get(resolved_provider)
        if provider is None:
            available = ", ".join(sorted(self.providers))
            raise SearchServiceError(
                status_code=400,
                detail=f"Unknown search provider '{resolved_provider}'. Available providers: {available}.",
            )
        return provider

    def list_providers(self) -> list[ProviderInfo]:
        return [
            self.providers[provider_id].describe(default=provider_id == self.default_provider)
            for provider_id in sorted(self.providers)
        ]

    def search(
        self,
        query: str,
        *,
        provider_id: str | None = None,
        categories: str | None = None,
        language: str | None = None,
        page: int = 1,
        safesearch: int | None = None,
        time_range: str | None = None,
        engines: str | None = None,
        preview_images: bool = False,
        preview_image_limit: int | None = None,
    ) -> SearchResponse:
        provider = self.get_provider(provider_id)
        response = provider.search(
            query,
            categories=categories,
            language=language,
            page=page,
            safesearch=safesearch,
            time_range=time_range,
            engines=engines,
        )
        if preview_images:
            self._enrich_requested_preview_images(
                response,
                requested_category=categories,
                preview_image_limit=preview_image_limit,
            )
        self._enrich_news_preview_images(
            response,
            requested_category=categories,
            provider=provider,
        )
        return response

    def autocomplete(
        self,
        query: str,
        *,
        provider_id: str | None = None,
        autocomplete_provider: str | None = None,
        autocomplete_limit: int | None = None,
    ) -> list[str]:
        provider = self.get_provider(provider_id)
        return provider.autocomplete(
            query,
            provider=autocomplete_provider,
            limit=autocomplete_limit,
        )

    def _enrich_requested_preview_images(
        self,
        response: SearchResponse,
        *,
        requested_category: str | None = None,
        preview_image_limit: int | None = None,
    ) -> None:
        preview_fetcher = getattr(self.preview_reader, "fetch_preview_image", None)
        if not callable(preview_fetcher) or self.news_preview_enrichment_limit <= 0:
            return

        normalized_category = (requested_category or response.filters.categories or "").strip().lower()
        if normalized_category in {"images", "map", "maps"}:
            return

        limit = (
            self.news_preview_enrichment_limit
            if preview_image_limit is None
            else max(0, min(preview_image_limit, self.news_preview_enrichment_limit))
        )
        if limit <= 0:
            return

        for index in self._get_preview_candidate_indices(response, limit):
            result = response.results[index]
            cache_key = result.url or result.title
            preview_cached, preview_url = self._get_cached_preview(self._news_preview_cache, cache_key)
            if not preview_cached:
                preview_url = None
                try:
                    preview_url = preview_fetcher(result.url)
                except Exception:
                    preview_url = None
                self._set_cached_preview(self._news_preview_cache, cache_key, preview_url)

            if not preview_url:
                continue

            result.thumbnail_url = preview_url
            result.image_url = preview_url

    def _enrich_news_preview_images(
        self,
        response: SearchResponse,
        *,
        requested_category: str | None = None,
        provider: SearchProvider | None = None,
    ) -> None:
        preview_fetcher = getattr(self.preview_reader, "fetch_preview_image", None)
        can_search_images = provider is not None and "images" in getattr(provider, "capabilities", ())
        if (not callable(preview_fetcher) and not can_search_images) or self.news_preview_enrichment_limit <= 0:
            return

        normalized_category = (requested_category or response.filters.categories or "").strip().lower()
        if normalized_category != "news" and not any(
            (result.category or "").strip().lower() == "news"
            for result in response.results
        ):
            return

        for index in self._get_news_preview_candidate_indices(response):
            result = response.results[index]
            cache_key = result.url or result.title
            preview_cached, preview_url = self._get_cached_preview(self._news_preview_cache, cache_key)
            if not preview_cached:
                preview_url = None
                try:
                    if callable(preview_fetcher):
                        preview_url = preview_fetcher(result.url)
                except Exception:
                    preview_url = None

                if not preview_url and can_search_images and provider is not None:
                    preview_url = self._search_news_preview_image(
                        provider,
                        result_title=result.title,
                        result_source=result.source,
                        result_domain=result.domain,
                        language=response.filters.language,
                        safesearch=response.filters.safesearch,
                        time_range=response.filters.time_range,
                        engines=response.filters.engines,
                    )

                self._set_cached_preview(self._news_preview_cache, cache_key, preview_url)

            if not preview_url:
                continue

            if not result.thumbnail_url:
                result.thumbnail_url = preview_url
            if not result.image_url:
                result.image_url = preview_url

    def _search_news_preview_image(
        self,
        provider: SearchProvider,
        *,
        result_title: str,
        result_source: str | None,
        result_domain: str | None,
        language: str | None,
        safesearch: int | None,
        time_range: str | None,
        engines: str | None,
    ) -> str | None:
        queries = self._build_news_preview_image_queries(
            result_title=result_title,
            result_source=result_source,
            result_domain=result_domain,
        )
        if not queries:
            return None

        for query in queries:
            cached_preview_exists, cached_preview = self._get_cached_preview(self._news_preview_query_cache, query)
            if cached_preview_exists:
                if cached_preview:
                    return cached_preview
                continue

            try:
                image_response = provider.search(
                    query,
                    categories="images",
                    language=language,
                    page=1,
                    safesearch=safesearch,
                    time_range=time_range,
                    engines=engines,
                )
            except Exception:
                self._set_cached_preview(self._news_preview_query_cache, query, None)
                continue

            preview_url = self._pick_news_preview_image(
                image_response,
                result_title=result_title,
                result_source=result_source,
                result_domain=result_domain,
            )
            self._set_cached_preview(self._news_preview_query_cache, query, preview_url)
            if preview_url:
                return preview_url

        return None

    def _get_cached_preview(
        self,
        cache: NewsPreviewCache,
        key: str,
    ) -> tuple[bool, str | None]:
        now = time.monotonic()
        with self._news_preview_cache_lock:
            if key not in cache:
                return (False, None)

            cached_at, cached_value = cache.pop(key)
            if now - cached_at > NEWS_PREVIEW_CACHE_TTL_SECONDS:
                return (False, None)

            cache[key] = (cached_at, cached_value)
            return (True, cached_value)

    def _set_cached_preview(
        self,
        cache: NewsPreviewCache,
        key: str,
        value: str | None,
    ) -> None:
        with self._news_preview_cache_lock:
            if key in cache:
                cache.pop(key)
            cache[key] = (time.monotonic(), value)

            while len(cache) > NEWS_PREVIEW_CACHE_MAX_ENTRIES:
                cache.popitem(last=False)

    def _build_news_preview_image_queries(
        self,
        *,
        result_title: str,
        result_source: str | None,
        result_domain: str | None,
    ) -> list[str]:
        title = self._clean_news_preview_title(result_title)
        if not title:
            return []

        source_label = str(result_source or result_domain or "").strip()
        source_token = re.sub(r"^www\.", "", source_label, flags=re.IGNORECASE).split(".", 1)[0].strip()
        focused_title = self._get_news_preview_focus_title(title)
        queries: list[str] = []
        seen_queries: set[str] = set()

        def remember(candidate_title: str, *, suffix: str = "") -> None:
            cleaned_title = re.sub(r"\s+", " ", str(candidate_title or "")).strip()
            if not cleaned_title:
                return

            query_parts = [f'"{cleaned_title}"']
            if source_token and source_token.lower() not in cleaned_title.lower():
                query_parts.append(source_token)
            if suffix:
                query_parts.append(suffix)
            query = " ".join(query_parts).strip()
            if query and query not in seen_queries:
                seen_queries.add(query)
                queries.append(query)

        remember(title)
        if focused_title and focused_title.lower() != title.lower():
            remember(focused_title)
            remember(focused_title, suffix="image")

        return queries

    def _pick_news_preview_image(
        self,
        response: SearchResponse,
        *,
        result_title: str,
        result_source: str | None,
        result_domain: str | None,
    ) -> str | None:
        title = self._clean_news_preview_title(result_title).lower()
        compact_title = re.sub(r"[^a-z0-9]+", "", title)
        title_tokens = self._get_news_preview_title_tokens(title)
        required_matches = self._get_required_news_preview_matches(title_tokens)
        source_tokens = [
            token
            for token in re.findall(r"[a-z0-9]+", f"{result_source or ''} {result_domain or ''}".lower())
            if len(token) >= 3
        ]

        best_score = -1
        best_preview = None
        for index, image_result in enumerate(response.results):
            preview_url = image_result.thumbnail_url or image_result.image_url
            if not preview_url:
                continue

            haystack = " ".join(
                filter(
                    None,
                    [
                        image_result.title,
                        image_result.content,
                        image_result.url,
                        image_result.source,
                        image_result.domain,
                    ],
                ),
            ).lower()
            title_haystack = " ".join(filter(None, [image_result.title, image_result.content])).lower()
            compact_haystack = re.sub(r"[^a-z0-9]+", "", haystack)
            token_matches = sum(1 for token in title_tokens if token in haystack)
            title_matches = sum(1 for token in title_tokens if token in title_haystack)
            source_matches = sum(1 for token in source_tokens if token in haystack)
            phrase_match = bool(title and title in haystack)

            score = max(0, 24 - index * 2)
            if compact_title and compact_title in compact_haystack:
                score += 220
            if phrase_match:
                score += 150
            score += token_matches * 28
            score += title_matches * 46
            score += source_matches * 24
            if title_tokens and title_matches >= required_matches:
                score += 130
            elif title_tokens and token_matches >= required_matches:
                score += 90
            elif len(title_tokens) > 1 and token_matches <= 1 and not phrase_match:
                score -= 120

            if score > best_score:
                best_score = score
                best_preview = preview_url

        return best_preview if best_score >= 90 else None

    def _clean_news_preview_title(self, value: str) -> str:
        title = re.sub(r"\s+", " ", str(value or "")).strip()
        if not title:
            return ""

        title = re.sub(r"\s*(?:/|:|-|–|—|\|)\s*related news.*$", "", title, flags=re.IGNORECASE).strip()
        title = re.sub(r"\s*\((?:video|live|photos?|gallery)\)\s*$", "", title, flags=re.IGNORECASE).strip()
        return title

    def _get_news_preview_focus_title(self, title: str) -> str:
        cleaned_title = self._clean_news_preview_title(title)
        if not cleaned_title:
            return ""

        quoted_phrases = re.findall(r"[\"'“‘](.{4,90}?)[\"'”’]", cleaned_title)
        for phrase in quoted_phrases:
            normalized_phrase = re.sub(r"\s+", " ", phrase).strip()
            if len(re.findall(r"[a-z0-9]+", normalized_phrase.lower())) >= 2:
                return normalized_phrase

        for separator in (" | ", " — ", " – ", " - ", ": "):
            if separator not in cleaned_title:
                continue
            focused_title = cleaned_title.split(separator, 1)[0].strip()
            if len(re.findall(r"[a-z0-9]+", focused_title.lower())) >= 2:
                return focused_title

        words = cleaned_title.split()
        return " ".join(words[: min(len(words), 10)])

    def _get_news_preview_title_tokens(self, title: str) -> list[str]:
        return [
            token
            for token in re.findall(r"[a-z0-9]+", title.lower())
            if len(token) >= 3 and token not in NEWS_PREVIEW_TITLE_STOPWORDS
        ]

    def _get_required_news_preview_matches(self, title_tokens: list[str]) -> int:
        if not title_tokens:
            return 0
        if len(title_tokens) <= 2:
            return len(title_tokens)
        return max(2, (len(title_tokens) * 3 + 4) // 5)

    def _get_news_preview_candidate_indices(self, response: SearchResponse) -> list[int]:
        candidate_indices: list[int] = []
        seen: set[int] = set()
        limit = min(self.news_preview_enrichment_limit, len(response.results))
        prioritized_indices = [0, *range(4, len(response.results), 4)]

        for index in [*prioritized_indices, *range(len(response.results))]:
            if len(candidate_indices) >= limit or index in seen or index >= len(response.results):
                continue

            seen.add(index)
            result = response.results[index]
            if result.thumbnail_url or result.image_url or not result.url:
                continue
            candidate_indices.append(index)

        return candidate_indices

    def _get_preview_candidate_indices(self, response: SearchResponse, limit: int) -> list[int]:
        candidate_indices: list[int] = []
        for index, result in enumerate(response.results):
            if len(candidate_indices) >= limit:
                break
            if not result.url:
                continue
            candidate_indices.append(index)
        return candidate_indices
