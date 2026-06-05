"""Domain dataclasses (stub).

These are placeholders. The real shapes will solidify once the scoring
and ledger modules land.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass
class RawItem:
    """A single ingested signal."""

    id: Optional[int]
    source_id: str
    layer: str
    title: str
    url: Optional[str]
    body: Optional[str]
    published_at: Optional[str]  # ISO-8601


@dataclass
class Theme:
    """A cluster of related raw items."""

    id: Optional[int]
    label: str
    created_at: Optional[str]


@dataclass
class Idea:
    """A theme that has been promoted into the stage framework."""

    id: Optional[int]
    theme_id: int
    stage: str
    score: float
