# ARCHITECTURE.md

High-level design baseline for TrendSense Agent. Implementation is staged;
this document is the target shape, not necessarily the current state.

## 1. Goals

- Ingest heterogeneous market signals (news, filings, prices, social, alt).
- Group items into **themes** (clusters of related signals).
- Promote themes to **ideas** through a **stage framework**.
- Score each idea on multiple dimensions and keep a transparent
  **evidence ledger** so a human can audit any conclusion.
- Emit periodic **reports** (daily / weekly / on-demand) and
  **postmortems** for ideas that resolved.

## 2. Signal layers

Signals are tagged by *layer*, each with a default trust weight.
Weights live in `config/sources.yaml` and feed the scorer.

| Layer       | Examples                              | Default weight |
|-------------|---------------------------------------|----------------|
| primary     | SEC filings, exchange disclosures     | high           |
| market      | OHLCV, options, on-chain              | high           |
| reputable   | major newswires, established outlets  | medium-high    |
| analyst     | sell-side notes, expert blogs         | medium         |
| social      | curated social handles                | low-medium     |
| alt         | alt-data, scrapes, niche feeds        | low            |

A single source can be reweighted in config without code changes.

## 3. Stage framework

Themes/ideas pass through stages; each stage has acceptance thresholds
defined in `config/scoring.yaml`:

1. **observation** — at least one signal in window
2. **corroboration** — N independent signals across ≥2 layers
3. **thesis** — corroborated + scored above the thesis threshold
4. **conviction** — thesis + market or primary confirmation
5. **resolved** — outcome recorded; postmortem written

Demotion is allowed: if signals decay or contradict, the idea drops
back a stage rather than disappearing.

## 4. Scoring

Each idea gets a vector of sub-scores (default weights in
`config/scoring.yaml`):

- **signal_density** — count and recency of supporting items
- **source_quality** — weighted by layer trust
- **independence**   — diversity of sources / layers
- **market_confirmation** — price/volume reaction
- **novelty**        — not already widely covered
- **risk_flags**     — known contradictions, low-quality sources

Aggregate score = weighted sum, clamped to [0, 1]. Weights are
configurable; the engine never hard-codes them.

## 5. Evidence ledger

Every score line is backed by a row in the ledger pointing to the raw
items it used. Audit means: pick an idea → fetch ledger rows → fetch
raw items → reconstruct the reasoning.

## 6. Reporting

Reports are derived artifacts (not the source of truth):

- **Daily brief** — new and promoted ideas in the last 24h.
- **Weekly review** — surviving ideas, demotions, new themes.
- **Postmortem** — written when an idea resolves.

## 7. Module map

| Module | Path                  | Responsibility                              |
|--------|-----------------------|---------------------------------------------|
| 0      | (git/branch setup)    | preflight, branch hygiene                   |
| 1      | `app/cli.py`, skeleton| CLI entry, project layout                   |
| 2      | `app/config.py`       | YAML config loader + validation             |
| 3      | `app/storage/`        | SQLite schema + repository                  |
| 4      | `app/collectors/manual` | manual ingestion (paste-in items)         |
| 5      | `app/processing/entities` | entity extraction MVP                   |
| 6      | `app/processing/themes`   | theme clustering                        |
| 7      | `app/scoring/`        | stage framework + scoring engine            |
| 8      | `app/ledger/`         | evidence ledger writer                      |
| 9      | `app/collectors/feeds`| RSS / news feed collectors                  |
| 10     | `app/collectors/market` | market data collectors                    |
| 11     | `app/collectors/filings` | SEC filings collectors                   |
| 12     | `app/reporting/`      | daily / weekly / postmortem reports         |
| 13     | `app/integrations/`   | outbound channels (Feishu, Slack, email)    |
| 14     | `app/cli.py` (full)   | full CLI: ingest, score, report, ledger     |

Each module ships with its own tests under `tests/`.

## 8. Storage

SQLite (single file, default `data/trendsense.sqlite`). Tables:

- `raw_items` — every ingested signal, immutable
- `sources` — registry mirror of `config/sources.yaml`
- `themes` — clusters of raw_items
- `ideas` — promoted themes with stage + score
- `market_snapshots` — price/volume at scoring time
- `reports` — emitted artifacts (path + metadata)
- `postmortems` — resolved-idea writeups

Schema lives in `app/storage/schema.sql`.

## 9. Non-goals (for the skeleton phase)

- No live data fetching.
- No external API credentials.
- No deployment automation.
- No production data writes.
