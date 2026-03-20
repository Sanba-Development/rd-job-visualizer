# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RD Job Visualizer is a 7-day challenge organized by **Sanba Development** to visualize AI exposure across Dominican Republic job sectors, inspired by [Andrej Karpathy's US Job Market Visualizer](https://karpathy.ai/jobs/). The goal is to scrape DR job portals (RD Trabaja, Aldaba RSS, datos.gob.do) as data sources, score occupations for AI exposure using LLMs, and render an interactive D3.js treemap. Note: RD Trabaja is one of several data sources — not the identity of the project.

## Current State

The project is currently a **single static HTML file** (`index.html`) serving as a recruitment/landing page for the hackathon sprint, plus a research document (`RD Job Visualizer Research.md`) detailing the data architecture plan. There is no build system, package manager, or framework installed yet.

## Development

Open `index.html` in a browser directly — no build step needed. Any static file server works (`npx serve .`, `python -m http.server`, etc.).

## Stack & Dependencies (CDN-loaded, no local install)

- **Tailwind CSS** via CDN script tag
- **Lucide Icons** via unpkg
- **Plus Jakarta Sans** via Google Fonts

All JS is inline at the bottom of `index.html`.

## Planned Architecture (from research doc)

The full MVP pipeline follows Karpathy's pattern:
1. **Ingestion** — Playwright scrapers for RD Trabaja (SPA), RSS parser for Aldaba, CSV/JSON downloads from ONE/MAP via datos.gob.do
2. **Processing** — BeautifulSoup HTML→Markdown cleanup, normalization to CNO (Clasificación Nacional de Ocupaciones)
3. **AI Scoring** — LLM-based 0-10 AI exposure scoring per occupation, adapted for DR context (informalidad, brecha digital/lingüística)
4. **Visualization** — React + D3.js interactive treemap with layers: sector, geography, AI risk
5. **Storage** — JSON/SQLite for MVP simplicity

## Language

All UI and content is in **Spanish**. Comments and code may mix Spanish and English.
