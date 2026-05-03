from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
import os
from pathlib import Path
import socket

LOCAL_ONLY_HOSTS = frozenset({"127.0.0.1", "localhost", "::1"})
WILDCARD_HOSTS = frozenset({"0.0.0.0", "::"})
TRUE_ENV_VALUES = frozenset({"1", "true", "yes", "on"})
FALSE_ENV_VALUES = frozenset({"0", "false", "no", "off"})
VALID_TIME_RANGES = frozenset({"day", "month", "year"})


def _get_env(name: str) -> str | None:
    return os.getenv(name)


def _get_raw_str(name: str, default: str) -> str:
    value = _get_env(name)
    if value is None:
        return default
    return value


def _get_float(name: str, default: float) -> float:
    value = _get_env(name)
    if value is None:
        return default

    try:
        return float(value)
    except ValueError:
        return default


def _get_int(name: str, default: int) -> int:
    value = _get_env(name)
    if value is None:
        return default

    try:
        return int(value)
    except ValueError:
        return default


def _get_str(name: str, default: str) -> str:
    value = _get_env(name)
    if value is None:
        return default
    return value.strip() or default


def _get_bool(name: str, default: bool) -> bool:
    value = _get_env(name)
    if value is None:
        return default

    normalized = value.strip().lower()
    if normalized in TRUE_ENV_VALUES:
        return True
    if normalized in FALSE_ENV_VALUES:
        return False
    return default


def _get_time_range(name: str, default: str) -> str:
    value = _get_env(name)
    if value is None:
        return default

    normalized = value.strip().lower()
    if not normalized:
        return ""
    if normalized in VALID_TIME_RANGES:
        return normalized
    return default


def _get_csv(name: str, default: tuple[str, ...] = ()) -> tuple[str, ...]:
    value = _get_env(name)
    if value is None:
        return default

    values: list[str] = []
    seen: set[str] = set()
    for raw_part in value.split(","):
        part = raw_part.strip()
        if not part:
            continue
        normalized = part.casefold()
        if normalized in seen:
            continue
        seen.add(normalized)
        values.append(part)
    return tuple(values)


def _load_dotenv_if_present() -> None:
    package_path = Path(__file__).resolve()
    candidate_paths = [
        Path.cwd() / ".env",
        package_path.parents[2] / ".env",
        package_path.parents[1] / ".env",
    ]

    env_path = None
    seen_paths: set[Path] = set()
    for path in candidate_paths:
        if path in seen_paths:
            continue
        seen_paths.add(path)
        if path.exists():
            env_path = path
            break

    if env_path is None:
        return

    try:
        text = env_path.read_text(encoding="utf-8")
    except OSError:
        return

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        if not key or key.startswith("#"):
            continue

        value = value.strip()
        if len(value) >= 2 and (
            (value.startswith('"') and value.endswith('"'))
            or (value.startswith("'") and value.endswith("'"))
        ):
            value = value[1:-1]

        if os.environ.get(key):
            continue
        os.environ[key] = value


def is_network_visible_host(host: str) -> bool:
    normalized = str(host or "").strip().lower()
    return bool(normalized) and normalized not in LOCAL_ONLY_HOSTS


def is_wildcard_host(host: str) -> bool:
    return str(host or "").strip().lower() in WILDCARD_HOSTS


def format_http_url(host: str, port: int) -> str:
    display_host = str(host or "").strip() or "127.0.0.1"
    if ":" in display_host and not display_host.startswith("["):
        display_host = f"[{display_host}]"
    return f"http://{display_host}:{port}"


def detect_lan_ip() -> str | None:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("10.255.255.255", 1))
            candidate = sock.getsockname()[0].strip()
    except OSError:
        return None

    if not candidate or candidate.startswith("127."):
        return None
    return candidate


def build_access_urls(host: str, port: int) -> list[tuple[str, str]]:
    normalized_host = str(host or "").strip() or "127.0.0.1"
    urls: list[tuple[str, str]] = []

    if is_wildcard_host(normalized_host):
        urls.append(("Local", format_http_url("127.0.0.1", port)))
        lan_ip = detect_lan_ip()
        if lan_ip:
            urls.append(("Network", format_http_url(lan_ip, port)))
        return urls

    label = "Network" if is_network_visible_host(normalized_host) else "Local"
    urls.append((label, format_http_url(normalized_host, port)))
    return urls


@dataclass(frozen=True, slots=True)
class Settings:
    app_name: str = "sear_ch"
    app_tagline: str = (
        "A self-hosted web app for AI-augmented private search."
    )
    searxng_base_url: str = "http://127.0.0.1:8080"
    searxng_timeout_seconds: float = 10.0
    default_provider: str = "searxng"
    default_categories: str = "general"
    default_language: str = "auto"
    default_safe_search: int = 0
    default_time_range: str = ""
    default_engines: str = ""
    news_default_time_range: str = ""
    news_default_engines: str = ""
    images_default_engines: str = ""
    map_default_engines: str = ""
    it_default_engines: str = ""
    science_default_engines: str = ""
    allowed_engines: tuple[str, ...] = ()
    default_autocomplete_provider: str = "google"
    autocomplete_min_chars: int = 3
    autocomplete_limit: int = 8
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_timeout_seconds: float = 45.0
    ollama_temperature: float = 0.2
    ollama_num_predict: int = 240
    ollama_default_model: str = ""
    reader_timeout_seconds: float = 12.0
    reader_max_bytes: int = 250_000
    reader_extract_chars: int = 4_500
    reader_preview_timeout_seconds: float = 1.5
    reader_preview_max_bytes: int = 96_000
    allow_private_page_fetch: bool = False
    news_preview_enrichment_limit: int = 4
    max_assist_sources: int = 5
    host: str = "127.0.0.1"
    port: int = 8891
    user_agent: str = "sear_ch/1.0"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    _load_dotenv_if_present()

    defaults = Settings()
    return Settings(
        app_name=_get_str("SEAR_CH_APP_NAME", defaults.app_name),
        app_tagline=_get_str("SEAR_CH_APP_TAGLINE", defaults.app_tagline),
        searxng_base_url=_get_str("SEARXNG_BASE_URL", defaults.searxng_base_url).rstrip("/"),
        searxng_timeout_seconds=_get_float(
            "SEARXNG_TIMEOUT_SECONDS",
            defaults.searxng_timeout_seconds,
        ),
        default_provider=_get_str(
            "SEAR_CH_DEFAULT_PROVIDER",
            defaults.default_provider,
        ),
        default_categories=_get_str(
            "SEAR_CH_DEFAULT_CATEGORIES",
            defaults.default_categories,
        ),
        default_language=_get_str(
            "SEAR_CH_DEFAULT_LANGUAGE",
            defaults.default_language,
        ),
        default_safe_search=_get_int(
            "SEAR_CH_DEFAULT_SAFE_SEARCH",
            defaults.default_safe_search,
        ),
        default_time_range=_get_time_range(
            "SEAR_CH_DEFAULT_TIME_RANGE",
            defaults.default_time_range,
        ),
        default_engines=_get_raw_str(
            "SEAR_CH_DEFAULT_ENGINES",
            defaults.default_engines,
        ).strip(),
        news_default_time_range=_get_time_range(
            "SEAR_CH_NEWS_DEFAULT_TIME_RANGE",
            defaults.news_default_time_range,
        ),
        news_default_engines=_get_raw_str(
            "SEAR_CH_NEWS_DEFAULT_ENGINES",
            defaults.news_default_engines,
        ).strip(),
        images_default_engines=_get_raw_str(
            "SEAR_CH_IMAGES_DEFAULT_ENGINES",
            defaults.images_default_engines,
        ).strip(),
        map_default_engines=_get_raw_str(
            "SEAR_CH_MAP_DEFAULT_ENGINES",
            defaults.map_default_engines,
        ).strip(),
        it_default_engines=_get_raw_str(
            "SEAR_CH_IT_DEFAULT_ENGINES",
            defaults.it_default_engines,
        ).strip(),
        science_default_engines=_get_raw_str(
            "SEAR_CH_SCIENCE_DEFAULT_ENGINES",
            defaults.science_default_engines,
        ).strip(),
        allowed_engines=_get_csv(
            "SEAR_CH_ALLOWED_ENGINES",
            defaults.allowed_engines,
        ),
        default_autocomplete_provider=_get_raw_str(
            "SEAR_CH_AUTOCOMPLETE_PROVIDER",
            defaults.default_autocomplete_provider,
        ).strip(),
        autocomplete_min_chars=_get_int(
            "SEAR_CH_AUTOCOMPLETE_MIN_CHARS",
            defaults.autocomplete_min_chars,
        ),
        autocomplete_limit=_get_int(
            "SEAR_CH_AUTOCOMPLETE_LIMIT",
            defaults.autocomplete_limit,
        ),
        ollama_base_url=_get_str("OLLAMA_BASE_URL", defaults.ollama_base_url).rstrip("/"),
        ollama_timeout_seconds=_get_float(
            "OLLAMA_TIMEOUT_SECONDS",
            defaults.ollama_timeout_seconds,
        ),
        ollama_temperature=_get_float(
            "OLLAMA_TEMPERATURE",
            defaults.ollama_temperature,
        ),
        ollama_num_predict=_get_int(
            "OLLAMA_NUM_PREDICT",
            defaults.ollama_num_predict,
        ),
        ollama_default_model=_get_raw_str(
            "OLLAMA_DEFAULT_MODEL",
            defaults.ollama_default_model,
        ).strip(),
        reader_timeout_seconds=_get_float(
            "SEAR_CH_READER_TIMEOUT_SECONDS",
            defaults.reader_timeout_seconds,
        ),
        reader_max_bytes=_get_int(
            "SEAR_CH_READER_MAX_BYTES",
            defaults.reader_max_bytes,
        ),
        reader_extract_chars=_get_int(
            "SEAR_CH_READER_EXTRACT_CHARS",
            defaults.reader_extract_chars,
        ),
        reader_preview_timeout_seconds=_get_float(
            "SEAR_CH_READER_PREVIEW_TIMEOUT_SECONDS",
            defaults.reader_preview_timeout_seconds,
        ),
        reader_preview_max_bytes=_get_int(
            "SEAR_CH_READER_PREVIEW_MAX_BYTES",
            defaults.reader_preview_max_bytes,
        ),
        allow_private_page_fetch=_get_bool(
            "SEAR_CH_ALLOW_PRIVATE_PAGE_FETCH",
            defaults.allow_private_page_fetch,
        ),
        news_preview_enrichment_limit=_get_int(
            "SEAR_CH_NEWS_PREVIEW_ENRICHMENT_LIMIT",
            defaults.news_preview_enrichment_limit,
        ),
        max_assist_sources=_get_int(
            "SEAR_CH_MAX_ASSIST_SOURCES",
            defaults.max_assist_sources,
        ),
        host=_get_str("SEAR_CH_HOST", defaults.host),
        port=_get_int("SEAR_CH_PORT", defaults.port),
        user_agent=_get_str("SEAR_CH_USER_AGENT", defaults.user_agent),
    )
