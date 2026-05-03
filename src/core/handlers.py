from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from ..clients.ollama import OllamaError
from ..clients.searxng import SearxngError
from ..services.assistant import AssistError
from ..services.reader import ArticleReaderError
from ..services.search import SearchServiceError
from .config import FALSE_ENV_VALUES, TRUE_ENV_VALUES, VALID_TIME_RANGES

if TYPE_CHECKING:
    from .app import AppContext


MAX_QUERY_CHARS = 200
MAX_PROVIDER_CHARS = 80
MAX_CATEGORY_CHARS = 120
MAX_LANGUAGE_CHARS = 80
MAX_ENGINES_CHARS = 500
MAX_PREVIEW_IMAGE_LIMIT = 8
MAX_AUTOCOMPLETE_LIMIT = 20
MAX_URL_CHARS = 2_000
MAX_MODEL_CHARS = 120
MAX_PROMPT_CHARS = 4_000
MAX_AI_NUM_PREDICT = 4096
MAX_AI_SOURCE_LIMIT = 10
MAX_ASSIST_BODY_BYTES = 1_000_000
MAX_ASSIST_RESULTS = 25
MAX_CHAT_MESSAGE_CHARS = 2_000
MAX_CHAT_MESSAGES = 16
MAX_CHAT_RESULTS = 6


class ApiRequestError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


@dataclass(frozen=True, slots=True)
class SearchRequest:
    query: str
    provider: str | None = None
    categories: str | None = None
    language: str | None = None
    page: int = 1
    safesearch: int | None = None
    time_range: str | None = None
    engines: str | None = None
    preview_images: bool = False
    preview_image_limit: int | None = None


@dataclass(frozen=True, slots=True)
class AutocompleteRequest:
    query: str
    provider: str | None = None
    autocomplete_provider: str | None = None
    autocomplete_min_chars: int | None = None
    autocomplete_limit: int | None = None


@dataclass(frozen=True, slots=True)
class PageRequest:
    url: str


@dataclass(frozen=True, slots=True)
class AssistRequest:
    mode: str
    query: str
    prompt: str
    results: list[dict[str, object]]
    model: str | None = None
    temperature: float | None = None
    num_predict: int | None = None
    source_limit: int | None = None
    include_pages: bool = False


@dataclass(frozen=True, slots=True)
class ChatRequest:
    query: str
    messages: list[dict[str, str]]
    results: list[dict[str, object]]
    model: str | None = None
    temperature: float | None = None
    num_predict: int | None = None
    source_limit: int | None = None


def _first_value(params: Mapping[str, Any], key: str, default: Any = "") -> Any:
    value = params.get(key, default)
    if isinstance(value, Sequence) and not isinstance(value, (str, bytes, bytearray)):
        return value[0] if value else default
    return value


def _text(
    value: Any,
    *,
    field: str,
    max_chars: int,
    required: bool = False,
) -> str:
    text = str(value or "").strip()
    if required and not text:
        raise ApiRequestError(400, f"{field} is required.")
    if len(text) > max_chars:
        raise ApiRequestError(400, f"{field} must be {max_chars} characters or fewer.")
    return text


def _optional_text(value: Any, *, field: str, max_chars: int) -> str | None:
    text = _text(value, field=field, max_chars=max_chars)
    return text or None


def _int_range(
    value: Any,
    *,
    field: str,
    default: int | None,
    minimum: int,
    maximum: int,
) -> int | None:
    raw = str(value or "").strip()
    if not raw:
        return default

    try:
        parsed = int(raw)
    except ValueError as exc:
        raise ApiRequestError(400, f"{field} must be an integer between {minimum} and {maximum}.") from exc

    if parsed < minimum or parsed > maximum:
        raise ApiRequestError(400, f"{field} must be an integer between {minimum} and {maximum}.")
    return parsed


def _float_range(
    value: Any,
    *,
    field: str,
    default: float | None,
    minimum: float,
    maximum: float,
) -> float | None:
    raw = str(value or "").strip()
    if not raw:
        return default

    try:
        parsed = float(raw)
    except ValueError as exc:
        raise ApiRequestError(400, f"{field} must be a number between {minimum:g} and {maximum:g}.") from exc

    if parsed < minimum or parsed > maximum:
        raise ApiRequestError(400, f"{field} must be a number between {minimum:g} and {maximum:g}.")
    return parsed


def _bool_value(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    normalized = str(value or "").strip().lower()
    if normalized in TRUE_ENV_VALUES:
        return True
    if normalized in FALSE_ENV_VALUES:
        return False
    return False


def parse_content_length(value: str | None) -> int | None:
    if value is None or not str(value).strip():
        return None
    try:
        content_length = int(str(value).strip())
    except ValueError as exc:
        raise ApiRequestError(400, "Content-Length must be an integer.") from exc
    if content_length < 0:
        raise ApiRequestError(400, "Content-Length must be zero or greater.")
    return content_length


def ensure_assist_body_size(content_length: int | None) -> None:
    if content_length is not None and content_length > MAX_ASSIST_BODY_BYTES:
        raise ApiRequestError(
            413,
            f"Request body must be {MAX_ASSIST_BODY_BYTES} bytes or fewer.",
        )


def build_search_request(params: Mapping[str, Any]) -> SearchRequest:
    query = _text(
        _first_value(params, "q"),
        field="Query parameter `q`",
        max_chars=MAX_QUERY_CHARS,
        required=True,
    )
    time_range = _optional_text(
        _first_value(params, "time_range"),
        field="Time range",
        max_chars=20,
    )
    if time_range is not None:
        time_range = time_range.lower()
    if time_range not in {None, *VALID_TIME_RANGES}:
        raise ApiRequestError(400, "Time range must be day, month, or year.")

    safesearch = _int_range(
        _first_value(params, "safesearch"),
        field="Safe search",
        default=None,
        minimum=0,
        maximum=2,
    )

    return SearchRequest(
        query=query,
        provider=_optional_text(
            _first_value(params, "provider"),
            field="Provider",
            max_chars=MAX_PROVIDER_CHARS,
        ),
        categories=_optional_text(
            _first_value(params, "categories"),
            field="Categories",
            max_chars=MAX_CATEGORY_CHARS,
        ),
        language=_optional_text(
            _first_value(params, "language"),
            field="Language",
            max_chars=MAX_LANGUAGE_CHARS,
        ),
        page=_int_range(
            _first_value(params, "page", "1"),
            field="Page",
            default=1,
            minimum=1,
            maximum=20,
        ) or 1,
        safesearch=safesearch,
        time_range=time_range,
        engines=_optional_text(
            _first_value(params, "engines"),
            field="Engines",
            max_chars=MAX_ENGINES_CHARS,
        ),
        preview_images=_bool_value(_first_value(params, "preview_images")),
        preview_image_limit=_int_range(
            _first_value(params, "preview_image_limit"),
            field="Preview image limit",
            default=None,
            minimum=0,
            maximum=MAX_PREVIEW_IMAGE_LIMIT,
        ),
    )


def build_autocomplete_request(params: Mapping[str, Any]) -> AutocompleteRequest:
    return AutocompleteRequest(
        query=_text(
            _first_value(params, "q"),
            field="Query parameter `q`",
            max_chars=MAX_QUERY_CHARS,
        ),
        provider=_optional_text(
            _first_value(params, "provider"),
            field="Provider",
            max_chars=MAX_PROVIDER_CHARS,
        ),
        autocomplete_provider=_optional_text(
            _first_value(params, "autocomplete_provider"),
            field="Autocomplete provider",
            max_chars=MAX_PROVIDER_CHARS,
        ),
        autocomplete_min_chars=_int_range(
            _first_value(params, "autocomplete_min_chars"),
            field="Autocomplete minimum characters",
            default=None,
            minimum=1,
            maximum=10,
        ),
        autocomplete_limit=_int_range(
            _first_value(params, "autocomplete_limit"),
            field="Autocomplete suggestion limit",
            default=None,
            minimum=1,
            maximum=MAX_AUTOCOMPLETE_LIMIT,
        ),
    )


def build_page_request(params: Mapping[str, Any]) -> PageRequest:
    return PageRequest(
        url=_text(
            _first_value(params, "url"),
            field="Query parameter `url`",
            max_chars=MAX_URL_CHARS,
            required=True,
        ),
    )


def build_assist_request(payload: object) -> AssistRequest:
    if not isinstance(payload, dict):
        raise ApiRequestError(400, "Request body must be a JSON object.")

    raw_results = payload.get("results", [])
    if not isinstance(raw_results, list):
        raise ApiRequestError(400, "`results` must be an array.")

    results = [
        item
        for item in raw_results[:MAX_ASSIST_RESULTS]
        if isinstance(item, dict)
    ]

    return AssistRequest(
        mode=_text(
            payload.get("mode", "summary"),
            field="Mode",
            max_chars=20,
        ) or "summary",
        query=_text(
            payload.get("query", ""),
            field="Query",
            max_chars=MAX_QUERY_CHARS,
        ),
        prompt=_text(
            payload.get("prompt", ""),
            field="Prompt",
            max_chars=MAX_PROMPT_CHARS,
        ),
        results=results,
        model=_optional_text(
            payload.get("model", ""),
            field="Model",
            max_chars=MAX_MODEL_CHARS,
        ),
        temperature=_float_range(
            payload.get("temperature", ""),
            field="Temperature",
            default=None,
            minimum=0,
            maximum=2,
        ),
        num_predict=_int_range(
            payload.get("num_predict", ""),
            field="Response token limit",
            default=None,
            minimum=32,
            maximum=MAX_AI_NUM_PREDICT,
        ),
        source_limit=_int_range(
            payload.get("source_limit", ""),
            field="AI source limit",
            default=None,
            minimum=1,
            maximum=MAX_AI_SOURCE_LIMIT,
        ),
        include_pages=_bool_value(payload.get("include_pages", False)),
    )


def build_chat_request(payload: object) -> ChatRequest:
    if not isinstance(payload, dict):
        raise ApiRequestError(400, "Request body must be a JSON object.")

    raw_messages = payload.get("messages", [])
    if not isinstance(raw_messages, list):
        raise ApiRequestError(400, "`messages` must be an array.")

    messages: list[dict[str, str]] = []
    for item in raw_messages[-MAX_CHAT_MESSAGES:]:
        if not isinstance(item, dict):
            continue
        role = _text(
            item.get("role", ""),
            field="Message role",
            max_chars=20,
        ).lower()
        if role not in {"user", "assistant"}:
            continue
        content = _text(
            item.get("content", ""),
            field="Message content",
            max_chars=MAX_CHAT_MESSAGE_CHARS,
        )
        if content:
            messages.append({
                "role": role,
                "content": content,
            })

    if not messages or not any(message["role"] == "user" for message in messages):
        raise ApiRequestError(400, "At least one user message is required.")

    raw_results = payload.get("results", [])
    if raw_results is None:
        raw_results = []
    if not isinstance(raw_results, list):
        raise ApiRequestError(400, "`results` must be an array.")

    results = [
        item
        for item in raw_results[:MAX_CHAT_RESULTS]
        if isinstance(item, dict)
    ]

    return ChatRequest(
        query=_text(
            payload.get("query", ""),
            field="Query",
            max_chars=MAX_QUERY_CHARS,
        ),
        messages=messages,
        results=results,
        model=_optional_text(
            payload.get("model", ""),
            field="Model",
            max_chars=MAX_MODEL_CHARS,
        ),
        temperature=_float_range(
            payload.get("temperature", ""),
            field="Temperature",
            default=None,
            minimum=0,
            maximum=2,
        ),
        num_predict=_int_range(
            payload.get("num_predict", ""),
            field="Response token limit",
            default=None,
            minimum=32,
            maximum=MAX_AI_NUM_PREDICT,
        ),
        source_limit=_int_range(
            payload.get("source_limit", ""),
            field="AI source limit",
            default=None,
            minimum=1,
            maximum=MAX_AI_SOURCE_LIMIT,
        ),
    )


def search_payload(context: AppContext, request: SearchRequest) -> dict[str, object]:
    try:
        return context.search.search(
            request.query,
            provider_id=request.provider,
            categories=request.categories,
            language=request.language,
            page=request.page,
            safesearch=request.safesearch,
            time_range=request.time_range,
            engines=request.engines,
            preview_images=request.preview_images,
            preview_image_limit=request.preview_image_limit,
        ).to_dict()
    except (SearchServiceError, SearxngError) as exc:
        raise ApiRequestError(exc.status_code, exc.detail) from exc


def autocomplete_payload(
    context: AppContext,
    request: AutocompleteRequest,
) -> dict[str, object]:
    autocomplete_min_chars = request.autocomplete_min_chars or context.settings.autocomplete_min_chars
    if len(request.query) < autocomplete_min_chars:
        return {
            "query": request.query,
            "suggestions": [],
        }

    try:
        suggestions = context.search.autocomplete(
            request.query,
            provider_id=request.provider,
            autocomplete_provider=request.autocomplete_provider or context.settings.default_autocomplete_provider or None,
            autocomplete_limit=request.autocomplete_limit,
        )
    except (SearchServiceError, SearxngError) as exc:
        raise ApiRequestError(exc.status_code, exc.detail) from exc

    return {
        "query": request.query,
        "suggestions": suggestions,
    }


def page_payload(context: AppContext, request: PageRequest) -> dict[str, object]:
    try:
        return context.reader.fetch(request.url).to_dict()
    except ArticleReaderError as exc:
        raise ApiRequestError(exc.status_code, exc.detail) from exc


def assist_payload(context: AppContext, request: AssistRequest) -> dict[str, object]:
    try:
        return context.assistant.assist(
            mode=request.mode,
            query=request.query,
            prompt=request.prompt,
            results=request.results,
            model=request.model,
            temperature=request.temperature,
            num_predict=request.num_predict,
            source_limit=request.source_limit,
            include_pages=request.include_pages,
        ).to_dict()
    except (AssistError, OllamaError) as exc:
        raise ApiRequestError(exc.status_code, exc.detail) from exc


def chat_payload(context: AppContext, request: ChatRequest) -> dict[str, object]:
    try:
        return context.assistant.chat(
            query=request.query,
            messages=request.messages,
            results=request.results,
            model=request.model,
            temperature=request.temperature,
            num_predict=request.num_predict,
            source_limit=request.source_limit,
        ).to_dict()
    except (AssistError, OllamaError) as exc:
        raise ApiRequestError(exc.status_code, exc.detail) from exc
