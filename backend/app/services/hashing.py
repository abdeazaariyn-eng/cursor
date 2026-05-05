from __future__ import annotations

import hashlib


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_meta_snap(digits_phone: str) -> str:
    """
    Hash phone for Meta and Snap CAPI.
    Input: digits with country code, no plus. e.g. '966551234567'
    """
    return _sha256(digits_phone)


def hash_tiktok(e164_phone: str) -> str:
    """
    Hash phone for TikTok Events API.
    Input: E.164 with plus. e.g. '+966551234567'
    """
    return _sha256(e164_phone)


def hash_value(value: str) -> str:
    """Generic SHA256 hash."""
    return _sha256(value.lower().strip())
