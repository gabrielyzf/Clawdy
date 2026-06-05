"""Tests for the storage layer."""
from __future__ import annotations

from pathlib import Path

import pytest

from app.cli import main as cli_main
from app.storage import db, repository as repo


EXPECTED_TABLES = {
    "raw_items",
    "sources",
    "themes",
    "theme_items",
    "ideas",
    "market_snapshots",
    "reports",
    "postmortems",
}
SPEC_TABLES = {
    "raw_items",
    "sources",
    "themes",
    "ideas",
    "market_snapshots",
    "reports",
    "postmortems",
}


def test_init_db_creates_all_tables(tmp_path: Path) -> None:
    db_path = tmp_path / "trendsense_test.sqlite"
    db.init_db(db_path)
    tables = set(db.list_tables(db_path))
    # All seven spec tables present
    assert SPEC_TABLES.issubset(tables)
    # And our internal join table too
    assert EXPECTED_TABLES.issubset(tables)


def test_init_db_is_idempotent(tmp_path: Path) -> None:
    db_path = tmp_path / "idem.sqlite"
    db.init_db(db_path)
    db.init_db(db_path)  # second call must not raise
    assert SPEC_TABLES.issubset(set(db.list_tables(db_path)))


def test_cli_init_db_subcommand(tmp_path: Path) -> None:
    db_path = tmp_path / "via_cli.sqlite"
    rc = cli_main(["init-db", "--db", str(db_path)])
    assert rc == 0
    assert db_path.exists()
    assert SPEC_TABLES.issubset(set(db.list_tables(db_path)))


def test_insert_and_query_raw_item(tmp_path: Path) -> None:
    db_path = tmp_path / "rt.sqlite"
    db.init_db(db_path)
    with db.connection(db_path) as conn:
        rid = repo.insert_raw_item(
            conn,
            source_id="reuters_rss",
            layer="reputable",
            title="Test headline",
            url="https://example.com/x",
            body="example body",
            published_at="2026-05-31T12:00:00Z",
        )
        row = repo.get_raw_item(conn, rid)
    assert row is not None
    assert row["title"] == "Test headline"
    assert row["layer"] == "reputable"
    assert row["source_id"] == "reuters_rss"


def test_theme_idea_flow(tmp_path: Path) -> None:
    db_path = tmp_path / "flow.sqlite"
    db.init_db(db_path)
    with db.connection(db_path) as conn:
        rid = repo.insert_raw_item(
            conn,
            source_id="reuters_rss",
            layer="reputable",
            title="Headline A",
        )
        tid = repo.insert_theme(conn, label="theme-a", summary="cluster")
        repo.link_theme_item(conn, theme_id=tid, raw_item_id=rid)
        idea_id = repo.insert_idea(
            conn, theme_id=tid, stage="observation", score=0.1
        )
        repo.update_idea_stage(
            conn, idea_id=idea_id, stage="corroboration", score=0.4
        )
        idea = repo.get_idea(conn, idea_id)
    assert idea is not None
    assert idea["stage"] == "corroboration"
    assert idea["score"] == pytest.approx(0.4)


def test_upsert_source_and_get(tmp_path: Path) -> None:
    db_path = tmp_path / "src.sqlite"
    db.init_db(db_path)
    with db.connection(db_path) as conn:
        repo.upsert_source(
            conn, id="reuters_rss", layer="reputable", kind="rss", weight=0.7
        )
        repo.upsert_source(
            conn,
            id="reuters_rss",
            layer="reputable",
            kind="rss",
            weight=0.72,
            enabled=True,
        )
        row = repo.get_source(conn, "reuters_rss")
    assert row is not None
    assert row["weight"] == pytest.approx(0.72)
    assert row["enabled"] == 1


def test_reports_insert_and_list(tmp_path: Path) -> None:
    db_path = tmp_path / "rep.sqlite"
    db.init_db(db_path)
    with db.connection(db_path) as conn:
        repo.insert_report(conn, kind="daily", path="/tmp/d1.md", summary="x")
        repo.insert_report(conn, kind="weekly", path="/tmp/w1.md")
        all_ = repo.list_reports(conn)
        only_daily = repo.list_reports(conn, kind="daily")
    assert len(all_) == 2
    assert len(only_daily) == 1
    assert only_daily[0]["kind"] == "daily"


def test_production_db_not_touched_during_tests(tmp_path: Path) -> None:
    """Sanity check: tests must not create data/trendsense.sqlite."""
    project_root = Path(__file__).resolve().parents[1]
    prod_db = project_root / "data" / "trendsense.sqlite"
    # If a previous run accidentally created it, the test will catch it.
    # We only enforce that *this* test doesn't create it.
    existed_before = prod_db.exists()
    # touch nothing related to the prod db
    db.init_db(tmp_path / "nope.sqlite")
    assert prod_db.exists() == existed_before


def test_placeholder_methods_raise(tmp_path: Path) -> None:
    with pytest.raises(NotImplementedError):
        repo.insert_market_snapshot()
    with pytest.raises(NotImplementedError):
        repo.insert_postmortem()
