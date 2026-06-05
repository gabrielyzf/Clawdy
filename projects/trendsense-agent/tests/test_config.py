"""Tests for the config loader."""
from __future__ import annotations

from pathlib import Path

import pytest

from app.config import (
    AppConfig,
    ConfigError,
    load_config,
    load_scoring,
    load_sources,
    load_watchlists,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONFIG_DIR = PROJECT_ROOT / "config"


# ---------------------------------------------------------------------------
# happy path — bundled configs load
# ---------------------------------------------------------------------------


def test_load_bundled_config() -> None:
    cfg = load_config(CONFIG_DIR)
    assert isinstance(cfg, AppConfig)
    # sources
    assert "primary" in cfg.sources.layers
    assert cfg.sources.layer_weight("primary") > 0
    # scoring
    assert "thesis" in cfg.scoring.stages
    assert sum(v for v in cfg.scoring.weights.values() if v > 0) > 0
    # watchlists default empty
    assert cfg.watchlists.tickers == []


def test_source_weight_falls_back_to_layer(tmp_path: Path) -> None:
    cfg = load_config(CONFIG_DIR)
    # sec_edgar has no override, so it should equal the primary layer weight
    assert cfg.sources.source_weight("sec_edgar") == cfg.sources.layer_weight(
        "primary"
    )


def test_source_weight_override_used() -> None:
    cfg = load_config(CONFIG_DIR)
    # bloomberg_rss has weight: 0.75 override
    assert cfg.sources.source_weight("bloomberg_rss") == 0.75


# ---------------------------------------------------------------------------
# validation errors
# ---------------------------------------------------------------------------


def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def test_missing_dir_raises(tmp_path: Path) -> None:
    with pytest.raises(ConfigError, match="config dir not found"):
        load_config(tmp_path / "nope")


def test_sources_missing_layers_raises(tmp_path: Path) -> None:
    p = tmp_path / "sources.yaml"
    _write(p, "sources: []\n")
    with pytest.raises(ConfigError, match="missing required key 'layers'"):
        load_sources(p)


def test_sources_unknown_layer_raises(tmp_path: Path) -> None:
    p = tmp_path / "sources.yaml"
    _write(
        p,
        """
layers:
  primary:
    default_weight: 0.9
sources:
  - id: bad
    layer: ghost
""",
    )
    with pytest.raises(ConfigError, match="unknown layer 'ghost'"):
        load_sources(p)


def test_sources_layer_missing_default_weight(tmp_path: Path) -> None:
    p = tmp_path / "sources.yaml"
    _write(
        p,
        """
layers:
  primary: {}
sources: []
""",
    )
    with pytest.raises(ConfigError, match="missing 'default_weight'"):
        load_sources(p)


def test_scoring_missing_weights(tmp_path: Path) -> None:
    p = tmp_path / "scoring.yaml"
    _write(p, "stages:\n  thesis:\n    min_score: 0.5\n")
    with pytest.raises(ConfigError, match="missing required key 'weights'"):
        load_scoring(p)


def test_scoring_non_numeric_weight(tmp_path: Path) -> None:
    p = tmp_path / "scoring.yaml"
    _write(
        p,
        """
stages:
  thesis:
    min_score: 0.5
weights:
  signal_density: oops
""",
    )
    with pytest.raises(ConfigError, match="must be numeric"):
        load_scoring(p)


def test_invalid_yaml_raises(tmp_path: Path) -> None:
    p = tmp_path / "scoring.yaml"
    _write(p, "stages: [unclosed\n")
    with pytest.raises(ConfigError, match="invalid YAML"):
        load_scoring(p)


def test_watchlists_empty_ok(tmp_path: Path) -> None:
    p = tmp_path / "watchlists.yaml"
    _write(p, "")
    wl = load_watchlists(p)
    assert wl.tickers == [] and wl.cik == [] and wl.crypto == []
