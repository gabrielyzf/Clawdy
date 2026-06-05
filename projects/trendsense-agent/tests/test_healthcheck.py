"""Tests for the healthcheck CLI command."""
from __future__ import annotations

import io
from contextlib import redirect_stdout

from app import __version__
from app.cli import main


def test_healthcheck_returns_zero_and_prints_ok() -> None:
    buf = io.StringIO()
    with redirect_stdout(buf):
        rc = main(["healthcheck"])
    out = buf.getvalue()
    assert rc == 0
    assert __version__ in out
    assert "ok" in out


def test_app_imports_cleanly() -> None:
    # Import surface — should not raise.
    import app  # noqa: F401
    import app.cli  # noqa: F401
    import app.config  # noqa: F401
    import app.models  # noqa: F401
    import app.storage  # noqa: F401
    import app.collectors  # noqa: F401
    import app.processing  # noqa: F401
    import app.scoring  # noqa: F401
    import app.ledger  # noqa: F401
    import app.reporting  # noqa: F401
    import app.integrations  # noqa: F401
