<p align="center">
    <img width="1200" height="475" src="logo.png" alt="Screenshot">
</p>

# sear_ch

`sear_ch` is a self-hosted web app for AI-augmented private search. It combines SearXNG results with local AI answers, context, and chat.

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
