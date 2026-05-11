<p align="center">
    <img width="1200" height="475" src="logo.png" alt="Logo">
</p>

# sear_ch

`sear_ch` is another step forward for self-hosted applications.

<p align="center">
    <img width="1200" height="475" src="screenshot.png" alt="Screenshot">
</p>

## Replace the big tech search engines you use every day

- They make it harder to find what you want.
- Your speed and privacy suffer through ads and tracking.
- There are paid promotions and search result bias manipulations.
- They make money through your utilization of their product.

The free self-hosted version should at least meet the following standards:

## sear_ch Principles

- Self-hosted friendly
- Local-friendly
- Privacy-focused
- Customizable workflows
- Open-source friendly

Use what you have at home, no subscriptions and full control:

## sear_ch Foundation
- Search with SearXNG
- Add AI with Ollama
- Single host PC
- LAN device access
- Browser-saved preferences
- Memory-only chat option

This product provides a composite usage of both SearXNG results with Ollama-friendly local AI.

Below are the benefits of each of these systems and why they allow this app to work.

## SearXNG Benefits

- Combines search engines
- No tracking and ads search
- No user profiling
- Web search
- News search
- Image search
- Map search

## Ollama Benefits

- Runs AI locally
- Works with search data
- Provides AI answers
- Adds context
- Supports chat
- Works offline
- More data control

## What It Does

- Searches web, news, images, and maps through SearXNG.
- Uses Ollama for local AI answers, context, and chat.
- Serves the UI from one host PC to other devices on your network.
- Keeps runtime defaults in `.env`.
- Saves app preferences in the browser; AI Chat history is memory-only unless browser saving is enabled.

## Quick Setup

```bash
cp .env.example .env
python3 -m src.web.server
```

Default local URLs:

```text
sear_ch: http://127.0.0.1:8891
SearXNG: http://127.0.0.1:8890
Ollama:  http://127.0.0.1:11434
```

From another device on the same network, open:

```text
http://<host-pc-ip>:8891
```

## Ports And Access

By default, `.env` sets `SEAR_CH_HOST=0.0.0.0`, which lets the sear_ch UI listen on the host PC and LAN interfaces.

The `SEARXNG_BASE_URL` and `OLLAMA_BASE_URL` values are the addresses sear_ch uses to reach those backends. 

## Requirements

- Python 3.12+
- SearXNG reachable from the sear_ch host
- Ollama reachable from the sear_ch host
- An installed Ollama model matching `OLLAMA_DEFAULT_MODEL`
