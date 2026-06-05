# trendsense-agent

> **Phase**: skeleton (Modules 0–3 complete). No live ingestion yet.

TrendSense Agent is a research-first market-intelligence tool. It ingests
multi-layer signal streams (news, filings, market data, social, alt-data),
groups them into themes, scores ideas through a stage framework, keeps a
ledger of evidence, and produces reports.

This repository is developed via the OpenClaw coding harness; see
`CLAUDE.md` for the rules every coding session must follow.

## Status

- Git initialized: YES (local-only, no remote)
- Modules built: 0, 1, 2, 3
- Modules pending: 4+ (ingestion, scoring, reporting, integrations)
- API connections: NONE
- Deployments: NONE

## Layout

```
trendsense-agent/
├── README.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── pyproject.toml
├── .gitignore
├── app/
│   ├── __init__.py
│   ├── cli.py             # entry point: healthcheck, init-db
│   ├── config.py          # YAML config loader
│   ├── models.py          # dataclass stubs
│   ├── storage/           # SQLite layer
│   ├── collectors/        # (stub) signal ingestion
│   ├── processing/        # (stub) entity extraction, theme grouping
│   ├── scoring/           # (stub) stage framework + scoring
│   ├── ledger/            # (stub) evidence ledger
│   ├── reporting/         # (stub) report generation
│   └── integrations/      # (stub) outbound (Feishu/Slack/etc.)
├── config/
│   ├── sources.yaml       # source layer registry + weights
│   ├── scoring.yaml       # stage thresholds + score weights
│   └── watchlists.yaml    # tracked tickers / cik / crypto
├── tests/                 # pytest suites
├── scripts/               # ops scripts (empty)
├── data/                  # gitignored runtime data
├── logs/                  # gitignored runtime logs
└── reports/               # gitignored generated reports
```

## How to run

Requires Python 3.10+.

```bash
# install deps (editable)
pip install -e .

# health check
python -m app.cli healthcheck

# initialize a sqlite database
python -m app.cli init-db --db data/trendsense.sqlite

# run tests
pytest -q
```

## Development discipline

- All work happens on a `task/TS-BUILD-XXXX` branch.
- No remote, no auto-push, no auto-deploy.
- Tests must pass before each module commit.
- See `CLAUDE.md` for the full ruleset.
