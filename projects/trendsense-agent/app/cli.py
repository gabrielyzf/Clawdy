"""Command-line entry point for TrendSense Agent.

Subcommands:
    healthcheck  — print version + ok
    init-db      — apply schema.sql to a sqlite database (idempotent)
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Sequence

from app import __version__


def cmd_healthcheck(_args: argparse.Namespace) -> int:
    print(f"trendsense-agent {__version__} ok")
    return 0


def cmd_init_db(args: argparse.Namespace) -> int:
    # Imported lazily so that a missing storage module does not break
    # `healthcheck`.
    from app.storage.db import init_db

    db_path = Path(args.db)
    init_db(db_path)
    print(f"initialized db at {db_path}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="trendsense",
        description="TrendSense Agent CLI",
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_health = sub.add_parser("healthcheck", help="print version and exit 0")
    p_health.set_defaults(func=cmd_healthcheck)

    p_init = sub.add_parser("init-db", help="initialize the sqlite database")
    p_init.add_argument(
        "--db",
        default="data/trendsense.sqlite",
        help="path to sqlite file (default: data/trendsense.sqlite)",
    )
    p_init.set_defaults(func=cmd_init_db)

    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
