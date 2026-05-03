from __future__ import annotations

import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from ..core.config import Settings


class OllamaError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class OllamaClient:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _build_request(
        self,
        endpoint: str,
        *,
        payload: dict[str, object] | None = None,
    ) -> Request:
        headers = {
            "Accept": "application/json",
            "User-Agent": self.settings.user_agent,
        }
        request_body = None
        method = "GET"
        if payload is not None:
            headers["Content-Type"] = "application/json"
            request_body = json.dumps(payload).encode("utf-8")
            method = "POST"

        return Request(
            f"{self.settings.ollama_base_url}{endpoint}",
            data=request_body,
            headers=headers,
            method=method,
        )

    def _raise_request_error(self, endpoint: str, exc: Exception) -> None:
        if isinstance(exc, HTTPError):
            error_detail = ""
            try:
                error_body = exc.read().decode("utf-8", errors="replace").strip()
                if error_body:
                    parsed_error = json.loads(error_body)
                    if isinstance(parsed_error, dict):
                        error_detail = self._coerce_text(parsed_error.get("error"))
                    if not error_detail:
                        error_detail = error_body
            except Exception:
                error_detail = ""

            suffix = f" Detail: {error_detail}" if error_detail else ""
            raise OllamaError(
                status_code=502,
                detail=(
                    f"Ollama returned HTTP {exc.code} for {endpoint} request "
                    f"at {self.settings.ollama_base_url}{endpoint}.{suffix}"
                ),
            ) from exc
        if isinstance(exc, TimeoutError):
            raise OllamaError(
                status_code=502,
                detail=(
                    f"Timed out while contacting Ollama at "
                    f"{self.settings.ollama_base_url}{endpoint}."
                ),
            ) from exc
        if isinstance(exc, URLError):
            reason = getattr(exc, "reason", None)
            detail = (
                "Unable to reach the configured Ollama instance at "
                f"{self.settings.ollama_base_url}."
            )
            if reason:
                detail = f"{detail} Reason: {reason}."
            raise OllamaError(
                status_code=502,
                detail=detail,
            ) from exc

        raise exc

    def _request_bytes(
        self,
        endpoint: str,
        *,
        payload: dict[str, object] | None = None,
    ) -> bytes:
        request = self._build_request(
            endpoint,
            payload=payload,
        )

        try:
            with urlopen(request, timeout=self.settings.ollama_timeout_seconds) as response:
                return response.read()
        except (HTTPError, TimeoutError, URLError) as exc:
            self._raise_request_error(endpoint, exc)
        raise AssertionError("Ollama request unexpectedly completed without a response.")

    def _request_json(
        self,
        endpoint: str,
        *,
        payload: dict[str, object] | None = None,
    ) -> dict[str, object]:
        response_body = self._request_bytes(endpoint, payload=payload)
        try:
            body = json.loads(response_body)
        except json.JSONDecodeError as exc:
            raise OllamaError(
                status_code=502,
                detail=(
                    "Received an invalid JSON response from "
                    f"{self.settings.ollama_base_url}{endpoint}."
                ),
            ) from exc
        return body if isinstance(body, dict) else {}

    def _post_json(self, endpoint: str, payload: dict[str, object]) -> dict[str, object]:
        return self._request_json(endpoint, payload=payload)

    @staticmethod
    def _coerce_text(value: object) -> str:
        if isinstance(value, str):
            return value.strip()
        if value is None:
            return ""
        text = str(value).strip()
        return text

    @staticmethod
    def _extract_text_answer(body: dict[str, object]) -> str:
        response = body.get("response")
        response_text = OllamaClient._coerce_text(response)
        if response_text:
            return response_text

        direct_text = OllamaClient._coerce_text(body.get("text"))
        if direct_text:
            return direct_text

        direct_content = OllamaClient._coerce_text(body.get("content"))
        if direct_content:
            return direct_content

        message = body.get("message")
        if isinstance(message, dict):
            content = OllamaClient._coerce_text(message.get("content"))
            if content:
                return content

        choices = body.get("choices")
        if isinstance(choices, list):
            for choice in choices:
                if not isinstance(choice, dict):
                    continue
                choice_content = OllamaClient._coerce_text(choice.get("text"))
                if choice_content:
                    return choice_content
                choice_message = choice.get("message")
                if isinstance(choice_message, dict):
                    choice_message_content = OllamaClient._coerce_text(choice_message.get("content"))
                    if choice_message_content:
                        return choice_message_content

        outputs = body.get("outputs")
        if isinstance(outputs, list):
            for output in outputs:
                if not isinstance(output, dict):
                    continue
                if isinstance(output.get("text"), str):
                    output_text = output.get("text", "").strip()
                    if output_text:
                        return output_text

        output = body.get("output")
        if isinstance(output, dict):
            output_content = OllamaClient._coerce_text(output.get("text"))
            if output_content:
                return output_content
            if isinstance(output.get("message"), dict):
                output_message_content = OllamaClient._coerce_text(output.get("message", {}).get("content"))
                if output_message_content:
                    return output_message_content

        return ""

    @staticmethod
    def _matches_model_name(requested_model: str, available_model: str) -> bool:
        normalized_requested = str(requested_model or "").strip()
        normalized_available = str(available_model or "").strip()
        if not normalized_requested or not normalized_available:
            return False
        if normalized_requested == normalized_available:
            return True

        requested_name, requested_has_tag, requested_tag = normalized_requested.partition(":")
        available_name, available_has_tag, available_tag = normalized_available.partition(":")
        if requested_name != available_name:
            return False

        normalized_requested_tag = requested_tag if requested_has_tag else "latest"
        normalized_available_tag = available_tag if available_has_tag else "latest"
        return normalized_requested_tag == normalized_available_tag

    def _post_streamed_text(self, endpoint: str, payload: dict[str, object]) -> str:
        response_bytes = self._request_bytes(endpoint, payload=payload)
        text = ""
        for line in response_bytes.decode("utf-8", errors="replace").splitlines():
            chunk_line = line.strip()
            if not chunk_line:
                continue

            if chunk_line.startswith("data:"):
                chunk_line = chunk_line[5:].strip()
            if not chunk_line or chunk_line == "[DONE]":
                continue

            try:
                chunk_body = json.loads(chunk_line)
            except json.JSONDecodeError:
                continue

            chunk_text = self._extract_text_answer(chunk_body)
            if chunk_text:
                text += chunk_text

        return text

    def generate(
        self,
        *,
        prompt: str,
        model: str | None = None,
        temperature: float | None = None,
        num_predict: int | None = None,
        system: str | None = None,
        response_format: str | None = None,
    ) -> tuple[str, str]:
        resolved_model = (model or self.settings.ollama_default_model).strip()
        if not resolved_model:
            raise OllamaError(
                status_code=400,
                detail="No Ollama model was provided. Set OLLAMA_DEFAULT_MODEL or send a model in the request.",
            )

        options = self._build_options(
            temperature=temperature,
            num_predict=num_predict,
        )
        payload: dict[str, object] = {
            "model": resolved_model,
            "prompt": prompt,
            "stream": False,
            "think": False,
        }
        if options:
            payload["options"] = options
        if system:
            payload["system"] = system
        if response_format:
            payload["format"] = response_format

        try:
            body = self._post_json("/api/generate", payload)
        except OllamaError as exc:
            if not response_format:
                raise

            fallback_payload = dict(payload)
            if "format" in fallback_payload:
                del fallback_payload["format"]
            try:
                body = self._post_json("/api/generate", fallback_payload)
            except OllamaError:
                raise exc
        answer = self._extract_text_answer(body)
        if not answer:
            stream_payload = dict(payload)
            stream_payload["stream"] = True
            try:
                answer = self._post_streamed_text("/api/generate", stream_payload)
            except OllamaError:
                answer = ""

        chat_body: dict[str, object] = {}
        if not answer:
            chat_payload: dict[str, object] = {
                "model": resolved_model,
                "messages": self._build_messages(
                    prompt=prompt,
                    system=system,
                ),
                "stream": False,
                "think": False,
            }
            if response_format:
                chat_payload["format"] = response_format
            if options:
                chat_payload["options"] = options

            try:
                chat_body = self._post_json("/api/chat", chat_payload)
            except OllamaError:
                if response_format and "format" in chat_payload:
                    fallback_chat_payload = dict(chat_payload)
                    fallback_chat_payload.pop("format", None)
                    try:
                        chat_body = self._post_json("/api/chat", fallback_chat_payload)
                    except OllamaError:
                        chat_body = {}
                else:
                    chat_body = {}
            else:
                answer = self._extract_text_answer(chat_body)

            if not answer:
                try:
                    chat_payload["stream"] = True
                    answer = self._post_streamed_text("/api/chat", chat_payload)
                except OllamaError:
                    pass

        if not answer:
            body_keys = set()
            if isinstance(body, dict):
                body_keys.update(body.keys())
            if isinstance(chat_body, dict):
                body_keys.update(chat_body.keys())

            detail_keys = sorted(body_keys)
            detail = "Ollama returned an empty response."
            if detail_keys:
                detail = f"{detail} Response keys: {', '.join(detail_keys)}."
            done_reason = body.get("done_reason") if isinstance(body, dict) else None
            if done_reason:
                detail = f"{detail} done_reason={done_reason}."
            raise OllamaError(
                status_code=502,
                detail=detail,
            )

        return resolved_model, answer

    def _build_options(
        self,
        *,
        temperature: float | None = None,
        num_predict: int | None = None,
    ) -> dict[str, object]:
        options: dict[str, object] = {}
        resolved_temperature = (
            self.settings.ollama_temperature
            if temperature is None
            else temperature
        )
        resolved_num_predict = (
            self.settings.ollama_num_predict
            if num_predict is None
            else num_predict
        )
        if resolved_temperature >= 0:
            options["temperature"] = resolved_temperature
        if resolved_num_predict > 0:
            options["num_predict"] = resolved_num_predict
        return options

    def _build_messages(
        self,
        *,
        prompt: str,
        system: str | None = None,
    ) -> list[dict[str, str]]:
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        return messages

    def healthcheck(self) -> dict[str, object]:
        try:
            payload = self._request_json("/api/tags")
        except OllamaError:
            return {
                "status": "offline",
                "base_url": self.settings.ollama_base_url,
                "default_model": self.settings.ollama_default_model or None,
                "models": [],
                "detail": "Unable to reach Ollama.",
            }

        models = [
            str(model.get("name", "")).strip()
            for model in payload.get("models", [])
            if str(model.get("name", "")).strip()
        ]
        default_model = (self.settings.ollama_default_model or "").strip()
        model_available = bool(default_model) and any(
            self._matches_model_name(default_model, model_name)
            for model_name in models
        )

        status = "ok"
        detail = "Connected."
        if not models:
            status = "degraded"
            detail = "Connected, but no local models were reported."
        elif not default_model:
            status = "degraded"
            detail = "Connected, but no default model is configured for AI features."
        elif not model_available:
            status = "degraded"
            detail = f"Connected, but default model '{default_model}' is not installed locally."
        else:
            detail = f"Connected. Ready with {default_model}."

        return {
            "status": status,
            "base_url": self.settings.ollama_base_url,
            "default_model": default_model or None,
            "models": models,
            "detail": detail,
        }
