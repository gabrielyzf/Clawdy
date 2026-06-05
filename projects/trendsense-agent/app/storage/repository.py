"""Thin CRUD wrappers around the SQLite schema.

These are intentionally minimal — enough for Module 4+ to lean on
without locking us into a heavy ORM. Other tables (market_snapshots,
postmortems) get placeholder methods that raise NotImplementedError
until those modules land.
"""
from __future__ import annotations

import sqlite3
from typing import Any, Mapping, Optional


# ---------------------------------------------------------------------------
# raw_items
# ---------------------------------------------------------------------------


def insert_raw_item(
    conn: sqlite3.Connection,
    *,
    source_id: str,
    layer: str,
    title: str,
    url: Optional[str] = None,
    body: Optional[str] = None,
    published_at: Optional[str] = None,
    payload_json: Optional[str] = None,
) -> int:
    cur = conn.execute(
        """
        INSERT INTO raw_items (source_id, layer, title, url, body,
                               published_at, payload_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (source_id, layer, title, url, body, published_at, payload_json),
    )
    return int(cur.lastrowid)


def get_raw_item(
    conn: sqlite3.Connection, item_id: int
) -> Optional[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM raw_items WHERE id = ?", (item_id,)
    ).fetchone()


def list_raw_items(
    conn: sqlite3.Connection, *, limit: int = 100
) -> list[sqlite3.Row]:
    return list(
        conn.execute(
            "SELECT * FROM raw_items ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    )


# ---------------------------------------------------------------------------
# sources
# ---------------------------------------------------------------------------


def upsert_source(
    conn: sqlite3.Connection,
    *,
    id: str,
    layer: str,
    kind: Optional[str] = None,
    weight: Optional[float] = None,
    enabled: bool = False,
) -> None:
    conn.execute(
        """
        INSERT INTO sources (id, layer, kind, weight, enabled)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            layer = excluded.layer,
            kind = excluded.kind,
            weight = excluded.weight,
            enabled = excluded.enabled,
            updated_at = CURRENT_TIMESTAMP
        """,
        (id, layer, kind, weight, 1 if enabled else 0),
    )


def get_source(conn: sqlite3.Connection, source_id: str) -> Optional[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM sources WHERE id = ?", (source_id,)
    ).fetchone()


# ---------------------------------------------------------------------------
# themes
# ---------------------------------------------------------------------------


def insert_theme(
    conn: sqlite3.Connection, *, label: str, summary: Optional[str] = None
) -> int:
    cur = conn.execute(
        "INSERT INTO themes (label, summary) VALUES (?, ?)",
        (label, summary),
    )
    return int(cur.lastrowid)


def link_theme_item(
    conn: sqlite3.Connection, *, theme_id: int, raw_item_id: int
) -> None:
    conn.execute(
        "INSERT OR IGNORE INTO theme_items (theme_id, raw_item_id) "
        "VALUES (?, ?)",
        (theme_id, raw_item_id),
    )


def get_theme(conn: sqlite3.Connection, theme_id: int) -> Optional[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM themes WHERE id = ?", (theme_id,)
    ).fetchone()


# ---------------------------------------------------------------------------
# ideas
# ---------------------------------------------------------------------------


def insert_idea(
    conn: sqlite3.Connection,
    *,
    theme_id: int,
    stage: str,
    score: float = 0.0,
    rationale: Optional[str] = None,
) -> int:
    cur = conn.execute(
        """
        INSERT INTO ideas (theme_id, stage, score, rationale)
        VALUES (?, ?, ?, ?)
        """,
        (theme_id, stage, score, rationale),
    )
    return int(cur.lastrowid)


def update_idea_stage(
    conn: sqlite3.Connection,
    *,
    idea_id: int,
    stage: str,
    score: Optional[float] = None,
) -> None:
    if score is None:
        conn.execute(
            "UPDATE ideas SET stage = ?, updated_at = CURRENT_TIMESTAMP "
            "WHERE id = ?",
            (stage, idea_id),
        )
    else:
        conn.execute(
            "UPDATE ideas SET stage = ?, score = ?, "
            "updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (stage, score, idea_id),
        )


def get_idea(conn: sqlite3.Connection, idea_id: int) -> Optional[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM ideas WHERE id = ?", (idea_id,)
    ).fetchone()


# ---------------------------------------------------------------------------
# reports
# ---------------------------------------------------------------------------


def insert_report(
    conn: sqlite3.Connection,
    *,
    kind: str,
    path: str,
    summary: Optional[str] = None,
) -> int:
    cur = conn.execute(
        "INSERT INTO reports (kind, path, summary) VALUES (?, ?, ?)",
        (kind, path, summary),
    )
    return int(cur.lastrowid)


def list_reports(
    conn: sqlite3.Connection, *, kind: Optional[str] = None, limit: int = 50
) -> list[sqlite3.Row]:
    if kind is None:
        rows = conn.execute(
            "SELECT * FROM reports ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM reports WHERE kind = ? ORDER BY id DESC LIMIT ?",
            (kind, limit),
        ).fetchall()
    return list(rows)


# ---------------------------------------------------------------------------
# placeholders for later modules
# ---------------------------------------------------------------------------


def insert_market_snapshot(*_args: Any, **_kwargs: Any) -> int:
    raise NotImplementedError("market_snapshots writer arrives in Module 10")


def insert_postmortem(*_args: Any, **_kwargs: Any) -> int:
    raise NotImplementedError("postmortems writer arrives with reporting")


__all__ = [
    "insert_raw_item",
    "get_raw_item",
    "list_raw_items",
    "upsert_source",
    "get_source",
    "insert_theme",
    "link_theme_item",
    "get_theme",
    "insert_idea",
    "update_idea_stage",
    "get_idea",
    "insert_report",
    "list_reports",
    "insert_market_snapshot",
    "insert_postmortem",
]
