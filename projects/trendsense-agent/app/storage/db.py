"""SQLite connection helpers and schema bootstrap."""
from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

DEFAULT_DB_PATH = Path("data/trendsense.sqlite")
SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def connect(db_path: Path | str) -> sqlite3.Connection:
    """Open a sqlite connection with foreign keys ON and Row factory."""
    path = Path(db_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def connection(db_path: Path | str) -> Iterator[sqlite3.Connection]:
    conn = connect(db_path)
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db(db_path: Path | str, schema_path: Path | None = None) -> None:
    """Apply the schema. Idempotent — uses CREATE ... IF NOT EXISTS."""
    schema = (schema_path or SCHEMA_PATH).read_text(encoding="utf-8")
    with connection(db_path) as conn:
        conn.executescript(schema)


def list_tables(db_path: Path | str) -> list[str]:
    with connection(db_path) as conn:
        rows = conn.execute(
            "SELECT name FROM sqlite_master "
            "WHERE type='table' AND name NOT LIKE 'sqlite_%' "
            "ORDER BY name"
        ).fetchall()
    return [r["name"] for r in rows]
