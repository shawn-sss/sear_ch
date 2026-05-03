from __future__ import annotations

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from ..core.api import build_health_payload, build_providers_payload
from ..core.app import get_app_context
from ..core.config import build_access_urls
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


STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


class SearChServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


class SearChHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs) -> None:
        self.context = get_app_context()
        self.settings = self.context.settings
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)

        if parsed.path == "/api/health":
            self._write_json(build_health_payload(self.context))
            return

        if parsed.path == "/api/providers":
            self._write_json(build_providers_payload(self.context))
            return

        if parsed.path == "/api/search":
            self._handle_search(parsed)
            return

        if parsed.path == "/api/autocomplete":
            self._handle_autocomplete(parsed)
            return

        if parsed.path == "/api/page":
            self._handle_page(parsed)
            return

        if parsed.path.startswith("/static/"):
            self.path = parsed.path.removeprefix("/static")
            super().do_GET()
            return

        if parsed.path == "/":
            self.path = "/index.html"

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/assist":
            self._handle_assist()
            return

        if parsed.path == "/api/chat":
            self._handle_chat()
            return

        self._write_json({"detail": "Route not found."}, status=404)

    def _handle_search(self, parsed) -> None:
        params = parse_qs(parsed.query, keep_blank_values=True)

        try:
            payload = search_payload(self.context, build_search_request(params))
        except ApiRequestError as exc:
            self._write_json({"detail": exc.detail}, status=exc.status_code)
            return

        self._write_json(payload)

    def _handle_page(self, parsed) -> None:
        params = parse_qs(parsed.query)
        try:
            payload = page_payload(self.context, build_page_request(params))
        except ApiRequestError as exc:
            self._write_json({"detail": exc.detail}, status=exc.status_code)
            return

        self._write_json(payload)

    def _handle_autocomplete(self, parsed) -> None:
        params = parse_qs(parsed.query)
        try:
            payload = autocomplete_payload(
                self.context,
                build_autocomplete_request(params),
            )
        except ApiRequestError as exc:
            self._write_json({"detail": exc.detail}, status=exc.status_code)
            return

        self._write_json(payload)

    def _handle_assist(self) -> None:
        self._handle_json_post(
            build_request=build_assist_request,
            build_payload=assist_payload,
        )

    def _handle_chat(self) -> None:
        self._handle_json_post(
            build_request=build_chat_request,
            build_payload=chat_payload,
        )

    def _handle_json_post(self, *, build_request, build_payload) -> None:
        try:
            content_length = parse_content_length(self.headers.get("Content-Length"))
            ensure_assist_body_size(content_length)
        except ApiRequestError as exc:
            self._write_json({"detail": exc.detail}, status=exc.status_code)
            return

        content_length = content_length or 0
        if content_length <= 0:
            self._write_json({"detail": "A JSON request body is required."}, status=400)
            return

        try:
            raw_body = self.rfile.read(content_length)
            ensure_assist_body_size(len(raw_body))
            payload = json.loads(raw_body)
        except json.JSONDecodeError:
            self._write_json({"detail": "Request body must be valid JSON."}, status=400)
            return
        except ApiRequestError as exc:
            self._write_json({"detail": exc.detail}, status=exc.status_code)
            return

        try:
            response = build_payload(self.context, build_request(payload))
        except ApiRequestError as exc:
            self._write_json({"detail": exc.detail}, status=exc.status_code)
            return

        self._write_json(response)

    def _write_json(self, payload: dict[str, object], *, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run() -> None:
    settings = get_app_context().settings
    with SearChServer((settings.host, settings.port), SearChHandler) as server:
        print(f"{settings.app_name} running.")
        for label, url in build_access_urls(settings.host, settings.port):
            print(f"{label}: {url}")
        print(f"Web search: {settings.searxng_base_url}")
        print(f"AI service: {settings.ollama_base_url}")
        server.serve_forever()


if __name__ == "__main__":
    run()
