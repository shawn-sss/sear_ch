from __future__ import annotations

from pathlib import Path

try:
    from fastapi import Body, FastAPI, HTTPException, Query, Request
    from fastapi.responses import FileResponse, JSONResponse
    from fastapi.staticfiles import StaticFiles
except ModuleNotFoundError as exc:
    raise RuntimeError(
        "FastAPI is optional. Install `sear_ch[fastapi]` to use this entrypoint, "
        "or run `python3 -m sear_ch.web.server` for the built-in server."
    ) from exc

from ..core.api import build_health_payload, build_providers_payload
from ..core.app import get_app_context
from ..core.handlers import (
    ApiRequestError,
    assist_payload,
    autocomplete_payload,
    build_assist_request,
    build_autocomplete_request,
    build_chat_request,
    build_page_request,
    build_search_request,
    chat_payload,
    ensure_assist_body_size,
    page_payload,
    parse_content_length,
    search_payload,
)


PACKAGE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = PACKAGE_DIR / "static"

app = FastAPI(
    title="sear_ch",
    version="1.0",
    summary="A self-hosted web app for AI-augmented private search.",
)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
context = get_app_context()


@app.middleware("http")
async def reject_large_assist_bodies(request: Request, call_next):
    if request.url.path in {"/api/assist", "/api/chat"}:
        try:
            ensure_assist_body_size(
                parse_content_length(request.headers.get("content-length")),
            )
        except ApiRequestError as exc:
            return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)
    return await call_next(request)


@app.get("/", response_class=FileResponse)
def home() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/robots.txt", response_class=FileResponse, include_in_schema=False)
def robots() -> FileResponse:
    return FileResponse(STATIC_DIR / "robots.txt", media_type="text/plain")


@app.get("/api/health")
def health() -> dict[str, object]:
    return build_health_payload(context)


@app.get("/api/providers")
def providers() -> dict[str, object]:
    return build_providers_payload(context)


@app.get("/api/search")
def search(
    q: str = Query(default=""),
    provider: str | None = Query(default=None),
    categories: str | None = Query(default=None),
    language: str | None = Query(default=None),
    page: str = Query(default="1"),
    safesearch: str | None = Query(default=None),
    time_range: str | None = Query(default=None),
    engines: str | None = Query(default=None),
    preview_images: str | None = Query(default=None),
    preview_image_limit: str | None = Query(default=None),
) -> dict[str, object]:
    try:
        request = build_search_request(
            {
                "q": q,
                "provider": provider,
                "categories": categories,
                "language": language,
                "page": page,
                "safesearch": safesearch,
                "time_range": time_range,
                "engines": engines,
                "preview_images": preview_images,
                "preview_image_limit": preview_image_limit,
            },
        )
        return search_payload(context, request)
    except ApiRequestError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/api/autocomplete")
def autocomplete(
    q: str = Query(default=""),
    provider: str | None = Query(default=None),
    autocomplete_provider: str | None = Query(default=None),
    autocomplete_min_chars: int | None = Query(default=None),
    autocomplete_limit: int | None = Query(default=None),
) -> dict[str, object]:
    try:
        request = build_autocomplete_request(
            {
                "q": q,
                "provider": provider,
                "autocomplete_provider": autocomplete_provider,
                "autocomplete_min_chars": autocomplete_min_chars,
                "autocomplete_limit": autocomplete_limit,
            },
        )
        return autocomplete_payload(context, request)
    except ApiRequestError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/api/page")
def page(url: str = Query(default="")) -> dict[str, object]:
    try:
        return page_payload(context, build_page_request({"url": url}))
    except ApiRequestError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/api/assist")
def assist(payload: object = Body(default=None)) -> dict[str, object]:
    try:
        return assist_payload(context, build_assist_request(payload))
    except ApiRequestError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/api/chat")
def chat(payload: object = Body(default=None)) -> dict[str, object]:
    try:
        return chat_payload(context, build_chat_request(payload))
    except ApiRequestError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
