from __future__ import annotations

from dataclasses import dataclass, field
from urllib.parse import urlparse


def _extract_domain(url: str) -> str | None:
    hostname = urlparse(url).hostname
    if not hostname:
        return None
    return hostname.removeprefix("www.")


@dataclass(slots=True)
class SearchFilters:
    categories: str | None = None
    language: str | None = None
    safesearch: int | None = None
    time_range: str | None = None
    engines: str | None = None

    def to_dict(self) -> dict[str, str | int | None]:
        return {
            "categories": self.categories,
            "language": self.language,
            "safesearch": self.safesearch,
            "time_range": self.time_range,
            "engines": self.engines,
        }


@dataclass(slots=True)
class SearchResult:
    id: str
    title: str
    url: str
    content: str = ""
    engine: str | None = None
    category: str | None = None
    provider: str = "searxng"
    domain: str | None = None
    image_url: str | None = None
    thumbnail_url: str | None = None
    source: str | None = None
    author: str | None = None
    published_date: str | None = None
    resolution: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    boundingbox: list[float] | None = None
    address: dict[str, object] | None = None
    address_label: str | None = None
    osm: dict[str, object] | None = None
    place_type: str | None = None
    type_icon: str | None = None
    website: str | None = None
    phone: str | None = None

    def __post_init__(self) -> None:
        if not self.domain:
            self.domain = _extract_domain(self.url)

    def to_dict(self) -> dict[str, object]:
        return {
            "id": self.id,
            "title": self.title,
            "url": self.url,
            "content": self.content,
            "engine": self.engine,
            "category": self.category,
            "provider": self.provider,
            "domain": self.domain,
            "image_url": self.image_url,
            "thumbnail_url": self.thumbnail_url,
            "source": self.source,
            "author": self.author,
            "published_date": self.published_date,
            "resolution": self.resolution,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "boundingbox": self.boundingbox,
            "address": self.address,
            "address_label": self.address_label,
            "osm": self.osm,
            "place_type": self.place_type,
            "type_icon": self.type_icon,
            "website": self.website,
            "phone": self.phone,
        }


@dataclass(slots=True)
class SearchResponse:
    query: str
    provider: str
    page: int
    total_results: int
    filters: SearchFilters
    results: list[SearchResult] = field(default_factory=list)
    suggestions: list[str] = field(default_factory=list)
    page_result_count: int = 0
    total_results_known: bool = False
    has_more_pages: bool | None = None

    def __post_init__(self) -> None:
        if self.page_result_count <= 0:
            self.page_result_count = len(self.results)
        if self.total_results < self.page_result_count:
            self.total_results = self.page_result_count

    def to_dict(self) -> dict[str, object]:
        return {
            "query": self.query,
            "provider": self.provider,
            "page": self.page,
            "total_results": self.total_results,
            "page_result_count": self.page_result_count,
            "total_results_known": self.total_results_known,
            "has_more_pages": self.has_more_pages,
            "filters": self.filters.to_dict(),
            "results": [result.to_dict() for result in self.results],
            "suggestions": self.suggestions,
        }


@dataclass(slots=True)
class ProviderInfo:
    id: str
    label: str
    kind: str
    default: bool
    base_url: str | None
    capabilities: list[str] = field(default_factory=list)
    status: str = "unknown"
    detail: str | None = None

    def to_dict(self) -> dict[str, object]:
        return {
            "id": self.id,
            "label": self.label,
            "kind": self.kind,
            "default": self.default,
            "base_url": self.base_url,
            "capabilities": self.capabilities,
            "status": self.status,
            "detail": self.detail,
        }


@dataclass(slots=True)
class PageResponse:
    url: str
    title: str
    content: str
    content_type: str | None = None
    excerpt: str = ""
    truncated: bool = False

    def __post_init__(self) -> None:
        if not self.excerpt:
            excerpt = self.content[:280].strip()
            if len(self.content) > 280:
                excerpt = f"{excerpt.rstrip()}..."
            self.excerpt = excerpt

    def to_dict(self) -> dict[str, object]:
        return {
            "url": self.url,
            "title": self.title,
            "content": self.content,
            "content_type": self.content_type,
            "excerpt": self.excerpt,
            "truncated": self.truncated,
        }


@dataclass(slots=True)
class AssistSource:
    title: str
    url: str
    domain: str | None = None
    snippet: str = ""
    used_page: bool = False
    note: str | None = None

    def __post_init__(self) -> None:
        if not self.domain:
            self.domain = _extract_domain(self.url)

    def to_dict(self) -> dict[str, object]:
        return {
            "title": self.title,
            "url": self.url,
            "domain": self.domain,
            "snippet": self.snippet,
            "used_page": self.used_page,
            "note": self.note,
        }


@dataclass(slots=True)
class AssistResponse:
    mode: str
    model: str
    answer: str
    sources: list[AssistSource] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        return {
            "mode": self.mode,
            "model": self.model,
            "answer": self.answer,
            "sources": [source.to_dict() for source in self.sources],
        }
