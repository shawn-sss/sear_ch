from __future__ import annotations

import hashlib
import json
import re
from typing import Any

from ..clients.ollama import OllamaClient
from ..core.config import Settings
from ..models.schemas import AssistResponse, AssistSource, SearchResult
from .reader import ArticleReader, ArticleReaderError


SYSTEM_PROMPT = (
    "You are a local research assistant. Use only the supplied search results and extracted page text. "
    "Do not use outside knowledge or assumptions, and do not invent facts. "
    "Cite uncertainty plainly, avoid fabricating facts, and prefer concise, actionable answers. "
    "Return only the final answer text. Do not include preambles, disclaimers, source-processing language, "
    "or notes about how the answer was generated. "
    "Do not copy source phrasing verbatim unless quoting is necessary; paraphrase clearly and briefly. "
    "Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas. "
    "If a claim is not directly supported by the context, mark it as uncertain or unknown."
)

CHAT_SYSTEM_PROMPT = (
    "You are sear_ch's local AI chat assistant. Be helpful, natural, and direct in everyday conversation. "
    "You can answer general questions, help think through plans, explain concepts, draft text, and troubleshoot simple problems. "
    "If current search results are supplied, use them when they are relevant, but do not pretend you browsed beyond the provided context. "
    "If the user asks for live, current, legal, medical, or financial facts and no search context was supplied, say that the answer may need a fresh search. "
    "Keep replies concise unless the user asks for detail. "
    "Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas. "
    "Return only the assistant reply."
)

MAX_CONTEXT_CHARS = 1400
MAX_CHAT_CONTEXT_CHARS = 900
SUMMARY_PAGE_FETCH_LIMIT = 1
SUMMARY_DETAIL_LIMIT = 5
SUMMARY_ALT_KEY_SETS = (
    ("paragraph1", "paragraph one", "first_paragraph", "first"),
    ("paragraph2", "paragraph two", "second_paragraph", "second"),
)
PREFACE_PATTERNS = (
    r"\bokay,?\s*let",
    r"\blet['’]s\s+tackle",
    r"\blet['’]s\s+first",
    r"\bi\s+need\s+to",
    r"\bto\s+check\s+the\s+provided",
    r"\blooking\s+at\s+the",
    r"\bbased\s+on\s+the",
    r"\bfirst,\s+i['’]ll",
    r"\bthe\s+user",
    r"\bhere['’]s\s+how",
)
SUMMARY_META_TERMS = (
    "paragraph",
    "sentence",
    "markdown",
    "bullet",
    "json",
    "source",
    "sources",
    "context",
    "prompt",
    "preamble",
    "neutral",
    "concise",
    "factual",
    "final answer",
)
SUMMARY_BULLET_PATTERN = re.compile(r"^(?:[-*•]|\d+[.)])\s+")


def _strip_code_fences(value: str) -> str:
    text = value.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*\n?", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\n?\s*```$", "", text, flags=re.IGNORECASE).strip()
    return text


def _promote_inline_key_details_heading(value: str) -> str:
    return re.sub(r"([.!?])\s+(Key Details\b)", r"\1\n\n\2", value, flags=re.IGNORECASE)


def _normalize_latex_expression(value: str) -> str:
    text = str(value or "")
    text = re.sub(r"(\d+)\s*\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}", r"\1 \2/\3", text)
    text = re.sub(r"\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}", r"\1/\2", text)
    text = re.sub(r"\\text\{([^{}\n]*)\}", r"\1", text)
    replacements = (
        (r"\\(?:times|cdot)\b", "x"),
        (r"\\div\b", "/"),
        (r"\\approx\b", "about"),
        (r"\\leq\b", "<="),
        (r"\\geq\b", ">="),
        (r"\\neq\b", "!="),
        (r"\\pm\b", "+/-"),
    )
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)
    text = text.replace(r"\%", "%")
    text = re.sub(r"\\[,;:! ]", " ", text)
    text = text.replace("{", "").replace("}", "").replace("\\", "")
    return " ".join(text.split())


def _normalize_friendly_display_text(value: str) -> str:
    text = str(value or "")
    text = re.sub(
        r"\\\(([\s\S]*?)\\\)",
        lambda match: _normalize_latex_expression(match.group(1)),
        text,
    )
    text = re.sub(
        r"\$([^$\n]+)\$",
        lambda match: _normalize_latex_expression(match.group(1)),
        text,
    )
    text = re.sub(r"(\d+)\s*\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}", r"\1 \2/\3", text)
    text = re.sub(r"\\[dt]?frac\{([^{}\n]+)\}\{([^{}\n]+)\}", r"\1/\2", text)
    text = re.sub(r"\\text\{([^{}\n]*)\}", r"\1", text)
    replacements = (
        (r"\\(?:times|cdot)\b", "x"),
        (r"\\div\b", "/"),
        (r"\\approx\b", "about"),
        (r"\\leq\b", "<="),
        (r"\\geq\b", ">="),
        (r"\\neq\b", "!="),
        (r"\\pm\b", "+/-"),
    )
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)
    text = text.replace(r"\%", "%")
    text = re.sub(r"\\[,;:! ]", " ", text)
    text = re.sub(r"[ \t]+([,.;:!?])", r"\1", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text


def _find_balanced_json_object(text: str) -> str | None:
    start = text.find("{")
    if start < 0:
        return None

    in_string = False
    escape = False
    depth = 0
    for index in range(start, len(text)):
        char = text[index]

        if escape:
            escape = False
            continue
        if char == "\\" and in_string:
            escape = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if char == "{":
            depth += 1
            continue
        if char == "}":
            depth -= 1
            if depth == 0:
                return text[start:index + 1]

    return None


def _extract_json_object(text: str) -> dict[str, object] | None:
    cleaned = _strip_code_fences(text)
    if not cleaned:
        return None

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    balanced = _find_balanced_json_object(cleaned)
    if balanced is None:
        return None

    try:
        parsed = json.loads(balanced)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        return None


def _coerce_summary_sentence(value: Any) -> str:
    if not isinstance(value, str):
        return ""
    compact = " ".join(_normalize_friendly_display_text(value).split())
    return compact


def _looks_like_preface_line(value: str) -> bool:
    compact = value.strip().lower()
    if not compact:
        return False

    for pattern in PREFACE_PATTERNS:
        if re.match(pattern, compact):
            return True
    return False


def _looks_like_meta_sentence(value: str) -> bool:
    compact = _coerce_summary_sentence(value).lower()
    if not compact:
        return False
    if _looks_like_preface_line(compact):
        return True
    if re.match(r"^paragraph\s+(?:\d+|one|two)\b", compact):
        return True
    if re.match(r"^(i need to|need to|make sure|ensure|check if|the answer|the user)\b", compact):
        return True
    if re.match(r"^(avoid|keep it|do not|don't|return|write exactly)\b", compact):
        return any(term in compact for term in SUMMARY_META_TERMS)
    return any(term in compact for term in ("source-processing", "search process"))


def _split_sentences(text: str) -> list[str]:
    normalized = " ".join(text.strip().split())
    if not normalized:
        return []
    return [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", normalized) if sentence.strip()]


def _is_summary_bullet_line(value: str) -> bool:
    return bool(SUMMARY_BULLET_PATTERN.match(value.strip()))


def _normalize_summary_line(value: str) -> str:
    compact = " ".join(_normalize_friendly_display_text(value).strip().split())
    if not compact:
        return ""

    bullet_match = SUMMARY_BULLET_PATTERN.match(compact)
    if bullet_match:
        bullet_text = compact[bullet_match.end():].strip()
        return f"- {bullet_text}" if bullet_text else ""
    return compact


def _normalize_summary_detail_item(value: str) -> str:
    compact = _normalize_summary_line(value)
    if not compact:
        return ""

    if _is_summary_bullet_line(compact):
        compact = compact[2:].strip()

    if not compact or _looks_like_meta_sentence(compact):
        return ""

    return compact if compact[-1] in ".!?" else f"{compact}."


def _extract_summary_structure(text: str) -> tuple[str, list[str]]:
    lead_lines: list[str] = []
    detail_items: list[str] = []
    in_details = False

    for raw_line in text.replace("\r", "").splitlines():
        normalized_line = _normalize_summary_line(raw_line)
        if not normalized_line:
            continue

        if re.match(r"^key details\b", normalized_line, flags=re.IGNORECASE):
            in_details = True
            continue

        if _is_summary_bullet_line(normalized_line):
            in_details = True
            bullet_text = normalized_line[2:].strip()
            if bullet_text:
                detail_items.append(bullet_text)
            continue

        if in_details:
            detail_items.append(normalized_line)
            continue

        if _looks_like_meta_sentence(normalized_line):
            continue

        lead_lines.append(normalized_line)

    return " ".join(lead_lines).strip(), detail_items


def _clean_summary_paragraphs(text: str) -> list[str]:
    raw_paragraphs = [part.strip() for part in re.split(r"\n\s*\n+", text.strip()) if part.strip()]
    if not raw_paragraphs:
        raw_paragraphs = [text.strip()] if text.strip() else []

    cleaned_paragraphs: list[str] = []
    for paragraph in raw_paragraphs:
        sentences = _split_sentences(paragraph)
        filtered_sentences = [sentence for sentence in sentences if not _looks_like_meta_sentence(sentence)]
        if filtered_sentences:
            cleaned_paragraphs.append(" ".join(filtered_sentences))
            continue

        normalized_paragraph = _coerce_summary_sentence(paragraph)
        if normalized_paragraph and not _looks_like_meta_sentence(normalized_paragraph):
            cleaned_paragraphs.append(normalized_paragraph)

    return cleaned_paragraphs


def _split_summary_text(text: str) -> list[str]:
    normalized = " ".join(text.strip().split())
    if not normalized:
        return []

    if "\n\n" not in text:
        sentences = re.split(r"(?<=[.!?])\s+", normalized)
        if len(sentences) < 4:
            return [normalized]

        first_count = 5 if len(sentences) <= 10 else 6
        if first_count >= len(sentences):
            first_count = max(1, len(sentences) // 2)

        part_one = _coerce_summary_sentence(" ".join(sentences[:first_count]))
        part_two = _coerce_summary_sentence(" ".join(sentences[first_count:]))
        if part_two:
            return [part_one, part_two]
        return [part_one]

    return [_coerce_summary_sentence(part) for part in re.split(r"\n\s*\n+", text.strip()) if part.strip()]


def _extract_summary_from_json(payload: dict[str, object]) -> str:
    paragraph_one: str = ""
    paragraph_two: str = ""

    paragraph_one = _coerce_summary_sentence(payload.get("paragraph_1"))
    paragraph_two = _coerce_summary_sentence(payload.get("paragraph_2"))

    if not paragraph_one:
        for key in SUMMARY_ALT_KEY_SETS[0]:
            paragraph_one = _coerce_summary_sentence(payload.get(key))
            if paragraph_one:
                break

    for key in SUMMARY_ALT_KEY_SETS[1]:
        paragraph_two = _coerce_summary_sentence(payload.get(key))
        if paragraph_two:
            break

    if not paragraph_one and not paragraph_two and isinstance(payload.get("paragraphs"), list):
        paragraph_fields = payload.get("paragraphs")
        if paragraph_fields and len(paragraph_fields) >= 2:
            paragraph_one = _coerce_summary_sentence(paragraph_fields[0])
            paragraph_two = _coerce_summary_sentence(paragraph_fields[1])

    if not paragraph_one and not paragraph_two:
        summary = _coerce_summary_sentence(payload.get("summary"))
        if summary:
            return _join_summary_paragraphs(_split_summary_text(summary))

    if not paragraph_one and paragraph_two:
        return paragraph_two
    if paragraph_one and not paragraph_two:
        return paragraph_one
    return _join_summary_paragraphs([paragraph_one, paragraph_two])


def _join_summary_paragraphs(paragraphs: list[str]) -> str:
    normalized = [_coerce_summary_sentence(paragraph) for paragraph in paragraphs]
    normalized = [paragraph for paragraph in normalized if paragraph]

    if not normalized:
        return ""
    if len(normalized) == 1:
        chunks = _split_summary_text(normalized[0])
        if len(chunks) <= 1 or chunks == normalized:
            return normalized[0]
        return _join_summary_paragraphs(chunks)
    return "\n\n".join(normalized[:2])


def normalize_summary_answer(value: str) -> str:
    text = value.strip()
    if not text:
        return ""

    structured = _extract_json_object(text)
    if isinstance(structured, dict):
        json_answer = _extract_summary_from_json(structured)
        if json_answer:
            cleaned_json_paragraphs = _clean_summary_paragraphs(json_answer)
            if not cleaned_json_paragraphs:
                return ""
            return _join_summary_paragraphs(cleaned_json_paragraphs[:2])

    compact = _promote_inline_key_details_heading(_strip_code_fences(text))
    if not compact:
        return ""

    has_detail_block = bool(re.search(r"(?mi)^\s*key details\b", compact) or re.search(r"(?m)^\s*(?:[-*•]|\d+[.)])\s+", compact))
    if has_detail_block:
        lead_paragraph, detail_items = _extract_summary_structure(compact)
        structured_parts = []
        if lead_paragraph:
            structured_parts.append(lead_paragraph)
        normalized_detail_items = [
            item
            for item in (_normalize_summary_detail_item(detail) for detail in detail_items)
            if item
        ]
        if normalized_detail_items:
            structured_parts.append(
                "Key Details\n" + "\n".join(f"- {item}" for item in normalized_detail_items[:SUMMARY_DETAIL_LIMIT]),
            )
        return "\n\n".join(structured_parts)

    paragraphs = _clean_summary_paragraphs(compact)

    if not paragraphs:
        return ""
    if len(paragraphs) >= 2:
        return _join_summary_paragraphs(paragraphs[:2])
    return _join_summary_paragraphs(_split_summary_text(paragraphs[0]))


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    if not isinstance(value, str):
        return str(value)
    return " ".join(value.split())


def _trim_text(value: str, limit: int) -> str:
    clean = _clean_text(value)
    if not clean:
        return ""
    if len(clean) <= limit:
        return clean
    return f"{clean[:limit].strip()}…"


class AssistError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class AssistService:
    def __init__(
        self,
        settings: Settings,
        *,
        reader: ArticleReader,
        ollama: OllamaClient,
    ) -> None:
        self.settings = settings
        self.reader = reader
        self.ollama = ollama

    def assist(
        self,
        *,
        mode: str,
        query: str,
        prompt: str,
        results: list[dict[str, object]],
        model: str | None = None,
        temperature: float | None = None,
        num_predict: int | None = None,
        source_limit: int | None = None,
        include_pages: bool = False,
    ) -> AssistResponse:
        normalized_mode = mode.strip().lower() or "summary"
        if normalized_mode not in {"summary", "qa"}:
            raise AssistError(
                status_code=400,
                detail="Mode must be 'summary' or 'qa'.",
            )

        if not results:
            raise AssistError(
                status_code=400,
                detail="Select at least one result before sending context to Ollama.",
            )

        resolved_source_limit = max(1, int(source_limit or self.settings.max_assist_sources))
        selected_results = [
            self._coerce_result(item)
            for item in results[:resolved_source_limit]
        ]

        sources: list[AssistSource] = []
        context_blocks: list[str] = []

        for index, result in enumerate(selected_results, start=1):
            source = AssistSource(
                title=result.title,
                url=result.url,
                domain=result.domain,
                snippet=result.content,
            )

            context_block = [
                f"Source {index}",
                f"Title: {result.title}",
                f"URL: {result.url}",
                f"Snippet: {result.content or 'No snippet supplied.'}",
            ]

            should_fetch_page = include_pages and (
                normalized_mode != "summary" or index <= SUMMARY_PAGE_FETCH_LIMIT
            )

            if should_fetch_page:
                try:
                    page = self.reader.fetch(result.url)
                except ArticleReaderError as exc:
                    source.note = exc.detail
                else:
                    source.used_page = True
                    source.snippet = _trim_text(page.content, MAX_CONTEXT_CHARS) or source.snippet
                    context_block.append(f"Page title: {page.title}")
                    context_block.append(f"Page text: {_trim_text(page.content, MAX_CONTEXT_CHARS)}")

            sources.append(source)
            context_blocks.append("\n".join(context_block))

        compiled_prompt = self._build_prompt(
            mode=normalized_mode,
            query=query,
            prompt=prompt,
            context_blocks=context_blocks,
        )
        chosen_model, answer = self.ollama.generate(
            prompt=compiled_prompt,
            model=model,
            temperature=temperature,
            num_predict=num_predict,
            system=SYSTEM_PROMPT,
        )
        if normalized_mode == "summary":
            answer = normalize_summary_answer(answer)
        return AssistResponse(
            mode=normalized_mode,
            model=chosen_model,
            answer=answer,
            sources=sources,
        )

    def chat(
        self,
        *,
        query: str,
        messages: list[dict[str, str]],
        results: list[dict[str, object]] | None = None,
        model: str | None = None,
        temperature: float | None = None,
        num_predict: int | None = None,
        source_limit: int | None = None,
    ) -> AssistResponse:
        normalized_messages = [
            {
                "role": _clean_text(message.get("role")).lower(),
                "content": _clean_text(message.get("content")),
            }
            for message in messages
            if isinstance(message, dict)
        ]
        normalized_messages = [
            message
            for message in normalized_messages
            if message["role"] in {"user", "assistant"} and message["content"]
        ]
        if not normalized_messages or not any(message["role"] == "user" for message in normalized_messages):
            raise AssistError(
                status_code=400,
                detail="At least one user message is required.",
            )

        resolved_source_limit = max(1, int(source_limit or self.settings.max_assist_sources))
        selected_results = [
            self._coerce_result(item)
            for item in (results or [])[:resolved_source_limit]
            if isinstance(item, dict)
        ]
        sources = [
            AssistSource(
                title=result.title,
                url=result.url,
                domain=result.domain,
                snippet=result.content,
            )
            for result in selected_results
        ]
        compiled_prompt = self._build_chat_prompt(
            query=query,
            messages=normalized_messages,
            results=selected_results,
        )
        chosen_model, answer = self.ollama.generate(
            prompt=compiled_prompt,
            model=model,
            temperature=temperature,
            num_predict=num_predict,
            system=CHAT_SYSTEM_PROMPT,
        )
        return AssistResponse(
            mode="chat",
            model=chosen_model,
            answer=_normalize_friendly_display_text(answer).strip(),
            sources=sources,
        )

    def _build_prompt(
        self,
        *,
        mode: str,
        query: str,
        prompt: str,
        context_blocks: list[str],
    ) -> str:
        instruction = (
            "Write a concise overview of the searched thing using only the supplied evidence. "
            "Output only the finished overview text. "
            "Use exactly this structure: one lead paragraph, then a heading that says 'Key Details', then a bullet list. "
            "Treat Source 1 as the resolved meaning of the query, and do not switch to a different entity unless the supplied evidence clearly identifies one. "
            "Write one short overview paragraph, usually two to three sentences, in a natural factual style. "
            "After the paragraph, add a heading line that says 'Key Details'. "
            "Then add 3 to 5 bullet points, never more than 5 total. Each bullet must be one short sentence. "
            "Choose the most relevant concrete facts for this specific subject. "
            "Use dates, release information, current status, or lifecycle details only when they naturally fit the subject. "
            "Do not force a beginning, ending, discontinuation, or lifecycle framing when it does not fit the subject. "
            "If the query is ambiguous or the evidence is incomplete, say so briefly. "
            "Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas. "
            "Do not include planning notes, self-instructions, or mention sources, prompts, or the search process."
            if mode == "summary"
            else (
                "Answer the user's question using only the supplied evidence. "
                "Give a direct, concise answer first. "
                "If the sources are incomplete or conflicting, say what is missing or uncertain. "
                "Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas. "
                "Do not include planning notes, self-instructions, or mention sources, prompts, or the search process."
            )
        )
        user_prompt = prompt.strip() or (
            "Write a concise overview of the searched thing." if mode == "summary" else "Answer the question."
        )
        if mode == "summary":
            user_prompt = (
                f"{user_prompt}\n\n"
                "Overview policy:\n"
                "- Use only facts explicitly stated in the provided context.\n"
                "- Treat Source 1 as the intended subject when the query could mean more than one thing.\n"
                "- Prefer the interpretation that best matches the supplied results.\n"
                "- If key details are missing or conflicting, mention that uncertainty briefly instead of guessing.\n"
                "- Return one short overview paragraph, usually 2 to 3 sentences.\n"
                "- After that paragraph, add a heading line that says Key Details.\n"
                "- Under Key Details, return 3 to 5 bullet points and never more than 5.\n"
                "- Each bullet must be one short sentence.\n"
                "- Pick the most relevant facts for this specific subject.\n"
                "- Include dates, release info, status, or lifecycle details only when they naturally fit.\n"
                "- Do not force a founding date, ending, discontinuation, or lifecycle framing if it does not fit the subject.\n"
                "- Use plain readable text for numbers and fractions, such as 4 1/3. Do not use LaTeX, dollar-delimited math, or raw formulas.\n"
                "- Keep the overview short, direct, and neutral.\n"
                "- Output only the final overview text with no planning notes or reasoning.\n"
                "- Return plain text only.\n"
                "- Do not mention sources, context, prompts, or search process."
            )
        query_line = query.strip() or "No original query supplied."
        return (
            f"{instruction}\n\n"
            f"Original search query:\n{query_line}\n\n"
            f"User request:\n{user_prompt}\n\n"
            "Context sources:\n"
            f"{'\n\n'.join(context_blocks)}"
        )

    def _build_chat_prompt(
        self,
        *,
        query: str,
        messages: list[dict[str, str]],
        results: list[SearchResult],
    ) -> str:
        transcript = "\n".join(
            f"{'User' if message['role'] == 'user' else 'Assistant'}: {message['content']}"
            for message in messages
        )
        query_line = query.strip() or "No active search query."
        if results:
            context_blocks = []
            for index, result in enumerate(results, start=1):
                context_blocks.append(
                    "\n".join(
                        [
                            f"Result {index}",
                            f"Title: {result.title}",
                            f"URL: {result.url}",
                            f"Snippet: {_trim_text(result.content, MAX_CHAT_CONTEXT_CHARS) or 'No snippet supplied.'}",
                        ],
                    ),
                )
            search_context = "\n\n".join(context_blocks)
        else:
            search_context = "No current search results were supplied."

        return (
            "Continue the conversation. Answer the newest user message directly and naturally.\n\n"
            f"Active search query:\n{query_line}\n\n"
            "Current search context:\n"
            f"{search_context}\n\n"
            "Conversation:\n"
            f"{transcript}"
        )

    def _coerce_result(self, item: dict[str, object]) -> SearchResult:
        url = _clean_text(item.get("url"))
        title = _clean_text(item.get("title")) or url or "Untitled result"
        result_id = _clean_text(item.get("id")) or hashlib.sha1(
            f"{url}|{title}".encode("utf-8"),
        ).hexdigest()[:12]
        return SearchResult(
            id=result_id,
            title=title,
            url=url,
            content=_clean_text(item.get("content")),
            engine=_clean_text(item.get("engine")) or None,
            category=_clean_text(item.get("category")) or None,
            provider=_clean_text(item.get("provider")) or "external",
        )
