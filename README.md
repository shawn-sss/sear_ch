<p align="center">
    <img width="1200" height="475" src="logo.png" alt="Logo">
</p>

# sear_ch

A self-hosted web app that combines SearXNG results with local AI answers, context, and chat.

<p align="center">
    <img width="1200" height="475" src="screenshot.png" alt="Screenshot">
</p>

## Why sear_ch?

Replace big tech search engines with a privacy-focused alternative:
- No ads, tracking, or paid promotions
- Full control over your data
- Works completely offline with local AI
- Search results aren't manipulated or biased
- Self-hosted on hardware you own

## Principles

- Self-hosted friendly
- Local-friendly
- Privacy-focused
- Customizable workflows
- Open-source friendly

## What It Does

- Searches web, news, images, and maps via SearXNG
- Uses Ollama for local AI answers, context, and chat
- Serves the UI from one host PC to other devices on your network
- Saves app preferences in the browser
- Chat history is memory-only (unless browser saving is enabled)

## Requirements

- Python 3.12+
- SearXNG reachable from the sear_ch host
- Ollama reachable from the sear_ch host
- An installed Ollama model matching `OLLAMA_DEFAULT_MODEL`

## Quick Start

```bash
cp .env.example .env
python3 -m src.web.server
```

### Default Local URLs

```text
sear_ch: http://127.0.0.1:8891
SearXNG: http://127.0.0.1:8890
Ollama:  http://127.0.0.1:11434
```

### Access from Other Devices

From another device on the same network:

```text
http://<host-pc-ip>:8891
```

## Configuration

By default, `.env` sets `SEAR_CH_HOST=0.0.0.0`, which lets the sear_ch UI listen on the host PC and LAN interfaces.

The `SEARXNG_BASE_URL` and `OLLAMA_BASE_URL` values are the addresses sear_ch uses to reach those backends.

## Stack

- **SearXNG**: Multi-engine search without tracking or ads
- **Ollama**: Local AI model inference
- **Frontend**: Interactive search and chat interface
- **Runtime**: Configured via `.env`
