-- TrendSense Agent — SQLite schema (Module 3)
-- Idempotent: every CREATE uses IF NOT EXISTS.
-- Seven tables per the architecture spec.

PRAGMA foreign_keys = ON;

-- 1. raw_items: every ingested signal, immutable.
CREATE TABLE IF NOT EXISTS raw_items (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id     TEXT    NOT NULL,
    layer         TEXT    NOT NULL,
    title         TEXT    NOT NULL,
    url           TEXT,
    body          TEXT,
    published_at  TEXT,                              -- ISO-8601
    ingested_at   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payload_json  TEXT
);
CREATE INDEX IF NOT EXISTS idx_raw_items_source     ON raw_items(source_id);
CREATE INDEX IF NOT EXISTS idx_raw_items_layer      ON raw_items(layer);
CREATE INDEX IF NOT EXISTS idx_raw_items_published  ON raw_items(published_at);

-- 2. sources: registry mirror of config/sources.yaml.
CREATE TABLE IF NOT EXISTS sources (
    id          TEXT PRIMARY KEY,
    layer       TEXT NOT NULL,
    kind        TEXT,
    weight      REAL,
    enabled     INTEGER NOT NULL DEFAULT 0,
    updated_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. themes: clusters of raw_items.
CREATE TABLE IF NOT EXISTS themes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    label       TEXT    NOT NULL,
    summary     TEXT,
    created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_themes_label ON themes(label);

-- Linking table: many-to-many between themes and raw_items.
CREATE TABLE IF NOT EXISTS theme_items (
    theme_id     INTEGER NOT NULL REFERENCES themes(id)    ON DELETE CASCADE,
    raw_item_id  INTEGER NOT NULL REFERENCES raw_items(id) ON DELETE CASCADE,
    PRIMARY KEY (theme_id, raw_item_id)
);

-- 4. ideas: themes promoted into the stage framework.
CREATE TABLE IF NOT EXISTS ideas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    theme_id    INTEGER NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    stage       TEXT    NOT NULL,                    -- observation/.../resolved
    score       REAL    NOT NULL DEFAULT 0.0,
    rationale   TEXT,
    created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ideas_stage ON ideas(stage);
CREATE INDEX IF NOT EXISTS idx_ideas_theme ON ideas(theme_id);

-- 5. market_snapshots: price/volume captured at scoring time.
CREATE TABLE IF NOT EXISTS market_snapshots (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id     INTEGER REFERENCES ideas(id) ON DELETE SET NULL,
    symbol      TEXT    NOT NULL,
    price       REAL,
    volume      REAL,
    captured_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payload_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_market_symbol ON market_snapshots(symbol);
CREATE INDEX IF NOT EXISTS idx_market_idea   ON market_snapshots(idea_id);

-- 6. reports: emitted artifacts.
CREATE TABLE IF NOT EXISTS reports (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    kind        TEXT    NOT NULL,                    -- daily/weekly/postmortem/...
    path        TEXT    NOT NULL,
    summary     TEXT,
    created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reports_kind ON reports(kind);

-- 7. postmortems: one per resolved idea.
CREATE TABLE IF NOT EXISTS postmortems (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id      INTEGER NOT NULL UNIQUE REFERENCES ideas(id) ON DELETE CASCADE,
    outcome      TEXT    NOT NULL,                   -- correct/incorrect/inconclusive
    notes        TEXT,
    resolved_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
