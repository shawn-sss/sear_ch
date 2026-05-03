from __future__ import annotations

from dataclasses import dataclass
from html.parser import HTMLParser
import ipaddress
import json
import re
import socket
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

from ..core.config import Settings
from ..models.schemas import PageResponse


FETCHABLE_SCHEMES = frozenset({"http", "https"})


def _collapse_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def _clean_preview_url(value: str, base_url: str) -> str:
    cleaned = _collapse_whitespace(value)
    if not cleaned:
        return ""
    if cleaned.startswith("//"):
        cleaned = f"https:{cleaned}"
    else:
        cleaned = urljoin(base_url, cleaned)

    if not cleaned.startswith(("http://", "https://")):
        return ""
    return cleaned


def _score_preview_candidate(url: str, attrs: dict[str, str], base_score: int) -> int:
    lowered_url = url.lower()
    blocked_markers = (
        ".svg",
        ".ico",
        "sprite",
        "favicon",
        "apple-touch-icon",
        "pixel",
        "blank.",
        "placeholder",
    )
    if any(marker in lowered_url for marker in blocked_markers):
        return -1

    score = base_score
    if any(lowered_url.endswith(ext) or f"{ext}?" in lowered_url for ext in (".jpg", ".jpeg", ".png", ".webp", ".avif")):
        score += 8

    width = attrs.get("width", "").strip()
    height = attrs.get("height", "").strip()
    if width.isdigit() and int(width) >= 240:
        score += 6
    if height.isdigit() and int(height) >= 160:
        score += 6
    if width.isdigit() and height.isdigit() and int(width) < 100 and int(height) < 100:
        return -1

    context = " ".join(
        attrs.get(key, "")
        for key in (
            "class",
            "id",
            "alt",
            "title",
            "aria-label",
            "role",
            "itemprop",
            "property",
            "name",
            "data-testid",
            "data-component",
            "data-test",
            "src",
        )
    ).lower()
    if any(marker in context for marker in ("hero", "lead", "article", "story", "featured", "media", "photo", "image", "cover")):
        score += 12
    if any(marker in context for marker in ("logo", "icon", "avatar", "badge", "sprite", "placeholder")):
        score -= 14

    return score


class ArticleReaderError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


@dataclass(slots=True)
class _FetchedResource:
    payload: bytes
    content_type: str
    charset: str
    resolved_url: str
    truncated: bool = False


class _ValidatedRedirectHandler(HTTPRedirectHandler):
    def __init__(self, validator) -> None:
        super().__init__()
        self._validator = validator

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self._validator(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class _HTMLTextExtractor(HTMLParser):
    _BLOCK_TAGS = {
        "article",
        "blockquote",
        "br",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "li",
        "main",
        "p",
        "section",
        "tr",
    }

    def __init__(self) -> None:
        super().__init__()
        self._ignore_depth = 0
        self._in_title = False
        self._title_parts: list[str] = []
        self._text_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in {"script", "style", "noscript"}:
            self._ignore_depth += 1
            return
        if tag == "title":
            self._in_title = True
            return
        if tag in self._BLOCK_TAGS:
            self._text_parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._ignore_depth:
            self._ignore_depth -= 1
            return
        if tag == "title":
            self._in_title = False
            return
        if tag in self._BLOCK_TAGS:
            self._text_parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self._ignore_depth:
            return

        text = data.strip()
        if not text:
            return

        if self._in_title:
            self._title_parts.append(text)
            return

        self._text_parts.append(text)

    def extract(self) -> tuple[str, str]:
        title = _collapse_whitespace(" ".join(self._title_parts))
        content = _collapse_whitespace(" ".join(self._text_parts).replace("\n", " "))
        return title, content


class _HTMLPreviewExtractor(HTMLParser):
    _META_KEYS = {
        "og:image",
        "og:image:url",
        "og:image:secure_url",
        "twitter:image",
        "twitter:image:url",
        "twitter:image:src",
        "twitter:image:secure_url",
        "image",
        "article:image",
        "media:thumbnail",
        "thumbnail",
        "thumbnailurl",
        "sailthru.image",
        "sailthru.image.full",
        "sailthru.image.thumb",
        "parsely-image-url",
    }

    def __init__(self, base_url: str) -> None:
        super().__init__()
        self.base_url = base_url
        self.best_url = ""
        self.best_score = -1
        self._captured_script_type = ""
        self._script_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        attr_map = {
            str(key).lower(): str(value).strip()
            for key, value in attrs
            if key and value is not None
        }

        if tag == "script":
            script_type = attr_map.get("type", "").strip().lower()
            if "json" in script_type:
                self._captured_script_type = script_type
                self._script_parts = []
            return

        if tag == "meta":
            key = (
                attr_map.get("property")
                or attr_map.get("name")
                or attr_map.get("itemprop")
                or ""
            ).strip().lower()
            if key in self._META_KEYS or key.endswith(":image"):
                self._consider(attr_map.get("content", ""), attr_map, base_score=120)
            return

        if tag == "link":
            rel = attr_map.get("rel", "").lower()
            if "image_src" in rel or ("preload" in rel and attr_map.get("as", "").lower() == "image"):
                for candidate, candidate_attrs, score_bonus in self._extract_srcset_candidates(
                    attr_map.get("imagesrcset", ""),
                    attr_map,
                ):
                    self._consider(candidate, candidate_attrs, base_score=96 + score_bonus)
                self._consider(attr_map.get("href", ""), attr_map, base_score=96)
            return

        if tag == "video":
            self._consider(attr_map.get("poster", ""), attr_map, base_score=84)
            return

        if tag not in {"img", "amp-img", "source"}:
            return

        for key in (
            "src",
            "data-src",
            "data-lazy",
            "data-lazy-src",
            "data-lazy-srcset",
            "data-original",
            "data-image",
            "data-full-src",
            "data-thumb",
            "data-thumbnail",
            "data-lazy-src",
            "data-src-retina",
            "data-hi-res-src",
            "data-srcset",
        ):
            self._consider(attr_map.get(key, ""), attr_map, base_score=74)

        srcset = attr_map.get("srcset") or attr_map.get("data-srcset") or ""
        if srcset:
            for candidate, candidate_attrs, score_bonus in self._extract_srcset_candidates(srcset, attr_map):
                self._consider(candidate, candidate_attrs, base_score=70 + score_bonus)

        style = attr_map.get("style", "")
        if style:
            for candidate in self._extract_image_urls_from_text(style):
                self._consider(candidate, {"class": style[:240]}, base_score=62)

    def handle_data(self, data: str) -> None:
        if self._captured_script_type:
            self._script_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag != "script" or not self._captured_script_type:
            return

        script_content = "".join(self._script_parts).strip()
        if script_content:
            self._consider_script_content(script_content)

        self._captured_script_type = ""
        self._script_parts = []

    def _consider_script_content(self, value: str) -> None:
        try:
            payload = json.loads(value)
        except json.JSONDecodeError:
            for candidate in self._extract_image_urls_from_text(value):
                self._consider(candidate, {"class": value[:240]}, base_score=52)
            return

        for candidate in self._extract_json_image_candidates(payload):
            self._consider(candidate, {}, base_score=92)

    def _extract_json_image_candidates(self, value: object) -> list[str]:
        candidates: list[str] = []
        seen: set[str] = set()

        def remember(candidate: object) -> None:
            cleaned = str(candidate or "").strip()
            if not cleaned or cleaned in seen:
                return
            seen.add(cleaned)
            candidates.append(cleaned)

        def walk(candidate_value: object, *, image_context: bool = False) -> None:
            if isinstance(candidate_value, str):
                if image_context:
                    remember(candidate_value)
                return

            if isinstance(candidate_value, list):
                for item in candidate_value:
                    walk(item, image_context=image_context)
                return

            if not isinstance(candidate_value, dict):
                return

            raw_type = candidate_value.get("@type") or candidate_value.get("type") or ""
            normalized_type = " ".join(raw_type) if isinstance(raw_type, list) else str(raw_type or "")
            next_image_context = image_context or "image" in normalized_type.lower()

            for key, item in candidate_value.items():
                normalized_key = str(key).lower()
                key_is_image_like = (
                    "image" in normalized_key
                    or normalized_key.startswith("thumbnail")
                    or normalized_key in {"contenturl", "content_url", "src"}
                )
                walk(
                    item,
                    image_context=next_image_context or key_is_image_like,
                )

        walk(value)
        return candidates

    def _extract_srcset_candidates(
        self,
        value: str,
        attrs: dict[str, str],
    ) -> list[tuple[str, dict[str, str], int]]:
        candidates: list[tuple[str, dict[str, str], int]] = []
        for index, item in enumerate(str(value or "").split(",")):
            parts = item.strip().split()
            if not parts:
                continue

            candidate_attrs = dict(attrs)
            score_bonus = min(index, 4)
            for descriptor in parts[1:]:
                normalized_descriptor = descriptor.strip().lower()
                if normalized_descriptor.endswith("w") and normalized_descriptor[:-1].isdigit():
                    width = normalized_descriptor[:-1]
                    candidate_attrs["width"] = width
                    score_bonus += min(12, max(0, int(width) // 240))
                elif normalized_descriptor.endswith("x"):
                    try:
                        score_bonus += min(6, max(0, round(float(normalized_descriptor[:-1]) * 2)))
                    except ValueError:
                        pass

            candidates.append((parts[0], candidate_attrs, score_bonus))

        return candidates

    def _extract_image_urls_from_text(self, value: str) -> list[str]:
        matches = list(re.findall(
            r'((?:https?:)?//[^"\'>\s]+?\.(?:jpe?g|png|webp|avif)(?:\?[^"\'>\s]*)?|/[^"\'>\s]+?\.(?:jpe?g|png|webp|avif)(?:\?[^"\'>\s]*)?)',
            value,
            flags=re.IGNORECASE,
        ))
        for _, candidate in re.findall(r"url\((['\"]?)(.*?)\1\)", value, flags=re.IGNORECASE):
            cleaned = candidate.strip()
            if cleaned and not cleaned.lower().startswith("data:"):
                matches.append(cleaned)

        candidates: list[str] = []
        seen: set[str] = set()
        for match in matches:
            if match in seen:
                continue
            seen.add(match)
            candidates.append(match)

        return candidates

    def _consider(self, value: str, attrs: dict[str, str], *, base_score: int) -> None:
        candidate_url = _clean_preview_url(value, self.base_url)
        if not candidate_url:
            return

        score = _score_preview_candidate(candidate_url, attrs, base_score)
        if score <= self.best_score:
            return

        self.best_score = score
        self.best_url = candidate_url

    def extract(self) -> str:
        return self.best_url


class ArticleReader:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def fetch(self, url: str) -> PageResponse:
        parsed = urlparse(url)
        if parsed.scheme not in FETCHABLE_SCHEMES:
            raise ArticleReaderError(
                status_code=400,
                detail="Only http and https pages can be fetched.",
            )
        self._ensure_remote_fetch_allowed(url)

        try:
            resource = self._download(
                url,
                accept="text/html, text/plain;q=0.9",
                timeout=self.settings.reader_timeout_seconds,
                max_bytes=self.settings.reader_max_bytes,
            )
        except HTTPError as exc:
            raise ArticleReaderError(
                status_code=502,
                detail=f"Page fetch failed with HTTP {exc.code}.",
            ) from exc
        except (URLError, TimeoutError) as exc:
            raise ArticleReaderError(
                status_code=502,
                detail="Unable to fetch the selected page.",
            ) from exc

        truncated = resource.truncated
        decoded = resource.payload.decode(resource.charset, errors="replace")
        if resource.content_type in {"text/html", "application/xhtml+xml"}:
            title, content = self._extract_html(decoded)
        elif resource.content_type == "text/plain":
            title = url
            content = _collapse_whitespace(decoded)
        else:
            raise ArticleReaderError(
                status_code=415,
                detail=f"Unsupported page content type '{resource.content_type}'.",
            )

        if len(content) > self.settings.reader_extract_chars:
            content = content[: self.settings.reader_extract_chars].rstrip()
            truncated = True

        if not content:
            raise ArticleReaderError(
                status_code=422,
                detail="The selected page did not expose readable text content.",
            )

        return PageResponse(
            url=url,
            title=title or parsed.netloc or url,
            content=content,
            content_type=resource.content_type,
            truncated=truncated,
        )

    def fetch_preview_image(self, url: str) -> str | None:
        parsed = urlparse(url)
        if parsed.scheme not in FETCHABLE_SCHEMES:
            return None

        try:
            self._ensure_remote_fetch_allowed(url)
            resource = self._download(
                url,
                accept="text/html,application/xhtml+xml;q=0.9",
                timeout=self.settings.reader_preview_timeout_seconds,
                max_bytes=self.settings.reader_preview_max_bytes,
                extra_headers={
                    "Accept-Language": "en-US,en;q=0.9",
                    "Upgrade-Insecure-Requests": "1",
                },
            )
        except (ArticleReaderError, HTTPError, URLError, TimeoutError):
            return None

        if resource.content_type not in {"text/html", "application/xhtml+xml"}:
            return None

        decoded = resource.payload.decode(resource.charset, errors="replace")
        return self._extract_preview_image(decoded, resource.resolved_url or url)

    def _build_request(
        self,
        url: str,
        *,
        accept: str,
        extra_headers: dict[str, str] | None = None,
    ) -> Request:
        headers = {
            "Accept": accept,
            "User-Agent": self.settings.user_agent,
        }
        if extra_headers:
            headers.update(extra_headers)
        return Request(url, headers=headers)

    def _download(
        self,
        url: str,
        *,
        accept: str,
        timeout: float,
        max_bytes: int,
        extra_headers: dict[str, str] | None = None,
    ) -> _FetchedResource:
        request = self._build_request(
            url,
            accept=accept,
            extra_headers=extra_headers,
        )
        opener = build_opener(_ValidatedRedirectHandler(self._ensure_remote_fetch_allowed))
        with opener.open(request, timeout=timeout) as response:
            resolved_url = response.geturl()
            self._ensure_remote_fetch_allowed(resolved_url)
            payload = response.read(max_bytes + 1)

            truncated = len(payload) > max_bytes
            if truncated:
                payload = payload[:max_bytes]

            return _FetchedResource(
                payload=payload,
                content_type=response.headers.get_content_type(),
                charset=response.headers.get_content_charset() or "utf-8",
                resolved_url=resolved_url,
                truncated=truncated,
            )

    def _ensure_remote_fetch_allowed(self, url: str) -> None:
        if self.settings.allow_private_page_fetch:
            return

        parsed = urlparse(url)
        scheme = parsed.scheme.strip().lower()
        if scheme not in FETCHABLE_SCHEMES:
            return

        hostname = (parsed.hostname or "").strip().lower()
        if not hostname:
            raise ArticleReaderError(
                status_code=400,
                detail="Only http and https pages can be fetched.",
            )

        port = parsed.port or (443 if scheme == "https" else 80)
        if self._is_private_or_local_host(hostname, port):
            raise ArticleReaderError(
                status_code=403,
                detail=(
                    f"sear_ch blocks page fetches to private or local addresses like {hostname} by default. "
                    "Set SEAR_CH_ALLOW_PRIVATE_PAGE_FETCH=1 only if you trust this network and want "
                    "sear_ch to fetch intranet pages."
                ),
            )

    def _is_private_or_local_host(self, hostname: str, port: int) -> bool:
        normalized_host = str(hostname or "").strip().lower()
        if not normalized_host or normalized_host == "localhost":
            return True

        address_candidate = normalized_host.split("%", 1)[0]
        try:
            return not ipaddress.ip_address(address_candidate).is_global
        except ValueError:
            pass

        try:
            address_infos = socket.getaddrinfo(
                normalized_host,
                port,
                type=socket.SOCK_STREAM,
            )
        except socket.gaierror:
            return False

        for _, _, _, _, socket_address in address_infos:
            resolved_host = str(socket_address[0]).split("%", 1)[0]
            try:
                if not ipaddress.ip_address(resolved_host).is_global:
                    return True
            except ValueError:
                continue
        return False

    def _extract_html(self, value: str) -> tuple[str, str]:
        parser = _HTMLTextExtractor()
        parser.feed(value)
        parser.close()
        return parser.extract()

    def _extract_preview_image(self, value: str, base_url: str) -> str | None:
        parser = _HTMLPreviewExtractor(base_url)
        parser.feed(value)
        parser.close()
        preview = parser.extract()
        return preview or None
