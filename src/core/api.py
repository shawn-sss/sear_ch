from __future__ import annotations

from .app import AppContext
from .config import build_access_urls, is_network_visible_host


FEATURE_FLAGS = ("search", "page-read", "assist", "chat")


def _serialize_providers(context: AppContext) -> list[dict[str, object]]:
    return [
        provider.to_dict()
        for provider in context.search.list_providers()
    ]


def build_providers_payload(context: AppContext) -> dict[str, object]:
    return {
        "default_provider": context.search.default_provider,
        "providers": _serialize_providers(context),
    }


def _build_deployment_payload(context: AppContext) -> dict[str, object]:
    shared_on_network = is_network_visible_host(context.settings.host)
    access_urls = [
        {"label": label, "url": url}
        for label, url in build_access_urls(context.settings.host, context.settings.port)
    ]
    local_url = next(
        (entry["url"] for entry in access_urls if entry["label"] == "Local"),
        None,
    )
    network_url = next(
        (entry["url"] for entry in access_urls if entry["label"] == "Network"),
        None,
    )
    if shared_on_network and network_url:
        summary = f"Shared on your local network at {network_url}."
    elif shared_on_network:
        summary = "Shared on your local network."
    elif local_url:
        summary = (
            f"Running only on this device at {local_url}. "
            "Set SEAR_CH_HOST=0.0.0.0 to share it on your local network."
        )
    else:
        summary = (
            "Running only on this device. "
            "Set SEAR_CH_HOST=0.0.0.0 to share it on your local network."
        )

    return {
        "bind_host": context.settings.host,
        "port": context.settings.port,
        "shared_on_network": shared_on_network,
        "summary": summary,
        "local_url": local_url,
        "network_url": network_url,
        "access_urls": access_urls,
    }


def build_health_payload(context: AppContext) -> dict[str, object]:
    provider_payload = _serialize_providers(context)
    ollama_status = context.ollama.healthcheck()
    overall_status = "ok"
    if any(provider["status"] != "ok" for provider in provider_payload):
        overall_status = "degraded"
    if ollama_status.get("status") != "ok":
        overall_status = "degraded"

    return {
        "status": overall_status,
        "app": context.settings.app_name,
        "tagline": context.settings.app_tagline,
        "default_provider": context.search.default_provider,
        "search_defaults": {
            "categories": context.settings.default_categories,
            "language": context.settings.default_language,
            "safesearch": context.settings.default_safe_search,
            "time_range": context.settings.default_time_range or None,
            "engines": context.settings.default_engines or None,
        },
        "search_profiles": {
            "general": {
                "categories": "general",
                "time_range": context.settings.default_time_range or None,
                "engines": context.settings.default_engines or None,
            },
            "news": {
                "categories": "news",
                "time_range": context.settings.news_default_time_range or None,
                "engines": context.settings.news_default_engines or None,
            },
            "images": {
                "categories": "images",
                "time_range": None,
                "engines": context.settings.images_default_engines or None,
            },
            "map": {
                "categories": "map",
                "time_range": None,
                "engines": context.settings.map_default_engines or None,
            },
            "it": {
                "categories": "it",
                "time_range": None,
                "engines": context.settings.it_default_engines or None,
            },
            "science": {
                "categories": "science",
                "time_range": None,
                "engines": context.settings.science_default_engines or None,
            },
            "allowed_engines": list(context.settings.allowed_engines),
        },
        "autocomplete": {
            "provider": context.settings.default_autocomplete_provider or None,
            "min_chars": context.settings.autocomplete_min_chars,
            "limit": context.settings.autocomplete_limit,
        },
        "ai_defaults": {
            "temperature": context.settings.ollama_temperature,
            "num_predict": context.settings.ollama_num_predict,
            "max_sources": context.settings.max_assist_sources,
        },
        "providers": provider_payload,
        "ollama": ollama_status,
        "deployment": _build_deployment_payload(context),
        "features": list(FEATURE_FLAGS),
    }
