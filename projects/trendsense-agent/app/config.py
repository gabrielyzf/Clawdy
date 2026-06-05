"""Configuration loader.

Reads the three YAML files under ``config/``:

* ``sources.yaml``    — signal source registry + layer weights
* ``scoring.yaml``    — stage thresholds + scoring weights
* ``watchlists.yaml`` — tracked tickers / cik / crypto

Validation is intentionally light: presence of required top-level keys
and basic type checks. Anything more is the caller's job.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Mapping

import yaml


class ConfigError(Exception):
    """Raised when a config file is missing required keys or malformed."""


# ---------------------------------------------------------------------------
# dataclasses
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class SourcesConfig:
    layers: Mapping[str, Mapping[str, Any]]
    sources: list[Mapping[str, Any]]

    def layer_weight(self, layer: str) -> float:
        if layer not in self.layers:
            raise ConfigError(f"unknown layer: {layer!r}")
        return float(self.layers[layer]["default_weight"])

    def source_weight(self, source_id: str) -> float:
        for s in self.sources:
            if s.get("id") == source_id:
                if "weight" in s:
                    return float(s["weight"])
                return self.layer_weight(s["layer"])
        raise ConfigError(f"unknown source id: {source_id!r}")


@dataclass(frozen=True)
class ScoringConfig:
    stages: Mapping[str, Mapping[str, Any]]
    weights: Mapping[str, float]
    decay: Mapping[str, Any]


@dataclass(frozen=True)
class WatchlistsConfig:
    tickers: list[str] = field(default_factory=list)
    cik: list[str] = field(default_factory=list)
    crypto: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class AppConfig:
    sources: SourcesConfig
    scoring: ScoringConfig
    watchlists: WatchlistsConfig


# ---------------------------------------------------------------------------
# loaders
# ---------------------------------------------------------------------------


def _read_yaml(path: Path) -> Mapping[str, Any]:
    if not path.exists():
        raise ConfigError(f"config file not found: {path}")
    try:
        with path.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as exc:
        raise ConfigError(f"invalid YAML in {path}: {exc}") from exc
    if data is None:
        return {}
    if not isinstance(data, dict):
        raise ConfigError(f"{path} must be a mapping at top level")
    return data


def _require(data: Mapping[str, Any], key: str, path: Path) -> Any:
    if key not in data:
        raise ConfigError(f"{path}: missing required key {key!r}")
    return data[key]


def load_sources(path: Path) -> SourcesConfig:
    data = _read_yaml(path)
    layers = _require(data, "layers", path)
    sources = _require(data, "sources", path)
    if not isinstance(layers, dict) or not layers:
        raise ConfigError(f"{path}: 'layers' must be a non-empty mapping")
    if not isinstance(sources, list):
        raise ConfigError(f"{path}: 'sources' must be a list")
    for layer_name, layer in layers.items():
        if not isinstance(layer, dict) or "default_weight" not in layer:
            raise ConfigError(
                f"{path}: layer {layer_name!r} missing 'default_weight'"
            )
    for s in sources:
        for required in ("id", "layer"):
            if required not in s:
                raise ConfigError(
                    f"{path}: source missing required key {required!r}: {s}"
                )
        if s["layer"] not in layers:
            raise ConfigError(
                f"{path}: source {s['id']!r} references unknown layer "
                f"{s['layer']!r}"
            )
    return SourcesConfig(layers=layers, sources=sources)


def load_scoring(path: Path) -> ScoringConfig:
    data = _read_yaml(path)
    stages = _require(data, "stages", path)
    weights = _require(data, "weights", path)
    decay = data.get("decay", {})
    if not isinstance(stages, dict) or not stages:
        raise ConfigError(f"{path}: 'stages' must be a non-empty mapping")
    if not isinstance(weights, dict) or not weights:
        raise ConfigError(f"{path}: 'weights' must be a non-empty mapping")
    for k, v in weights.items():
        if not isinstance(v, (int, float)):
            raise ConfigError(f"{path}: weight {k!r} must be numeric")
    return ScoringConfig(stages=stages, weights=weights, decay=decay)


def load_watchlists(path: Path) -> WatchlistsConfig:
    data = _read_yaml(path)
    return WatchlistsConfig(
        tickers=list(data.get("tickers") or []),
        cik=list(data.get("cik") or []),
        crypto=list(data.get("crypto") or []),
    )


def load_config(config_dir: Path | str) -> AppConfig:
    """Load all three configs from ``config_dir``."""
    cdir = Path(config_dir)
    if not cdir.is_dir():
        raise ConfigError(f"config dir not found: {cdir}")
    return AppConfig(
        sources=load_sources(cdir / "sources.yaml"),
        scoring=load_scoring(cdir / "scoring.yaml"),
        watchlists=load_watchlists(cdir / "watchlists.yaml"),
    )
