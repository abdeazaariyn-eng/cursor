"""Tests for phone hashing service."""
import hashlib
from app.services.hashing import hash_meta_snap, hash_tiktok, hash_value


def sha256(v: str) -> str:
    return hashlib.sha256(v.encode()).hexdigest()


class TestHashing:
    def test_hash_meta_snap_uses_digits_with_country_code(self):
        result = hash_meta_snap("966551234567")
        assert result == sha256("966551234567")

    def test_hash_meta_snap_no_plus(self):
        result = hash_meta_snap("966551234567")
        assert "+" not in result
        assert len(result) == 64

    def test_hash_tiktok_uses_e164_with_plus(self):
        result = hash_tiktok("+966551234567")
        assert result == sha256("+966551234567")

    def test_hash_tiktok_different_from_meta(self):
        meta = hash_meta_snap("966551234567")
        tiktok = hash_tiktok("+966551234567")
        assert meta != tiktok

    def test_hash_value_generic(self):
        result = hash_value("test@example.com")
        assert result == sha256("test@example.com")
        assert len(result) == 64
