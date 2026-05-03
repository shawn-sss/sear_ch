from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from ..clients.ollama import OllamaClient
from ..clients.searxng import SearxngClient
from ..services.assistant import AssistService
from ..services.reader import ArticleReader
from ..services.search import SearchService
from .config import Settings, get_settings


@dataclass(slots=True)
class AppContext:
    settings: Settings
    search: SearchService
    reader: ArticleReader
    ollama: OllamaClient
    assistant: AssistService


@lru_cache(maxsize=1)
def get_app_context() -> AppContext:
    settings = get_settings()
    reader = ArticleReader(settings)
    search_service = SearchService(
        providers=[SearxngClient(settings)],
        default_provider=settings.default_provider,
        preview_reader=reader,
        news_preview_enrichment_limit=settings.news_preview_enrichment_limit,
    )
    ollama = OllamaClient(settings)
    assistant = AssistService(
        settings,
        reader=reader,
        ollama=ollama,
    )
    return AppContext(
        settings=settings,
        search=search_service,
        reader=reader,
        ollama=ollama,
        assistant=assistant,
    )
