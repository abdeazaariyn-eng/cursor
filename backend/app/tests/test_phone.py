"""Tests for phone normalization and validation."""
import pytest
from app.services.phone import normalize_phone, validate_phone


class TestNormalizePhone:
    def test_domestic_format(self):
        result = normalize_phone("0551234567")
        assert result["domestic"] == "0551234567"
        assert result["e164"] == "+966551234567"
        assert result["digits"] == "966551234567"

    def test_without_leading_zero(self):
        result = normalize_phone("551234567")
        assert result["domestic"] == "0551234567"
        assert result["e164"] == "+966551234567"

    def test_with_plus966(self):
        result = normalize_phone("+966551234567")
        assert result["domestic"] == "0551234567"
        assert result["e164"] == "+966551234567"

    def test_with_966(self):
        result = normalize_phone("966551234567")
        assert result["domestic"] == "0551234567"
        assert result["e164"] == "+966551234567"

    def test_with_00966(self):
        result = normalize_phone("00966551234567")
        assert result["domestic"] == "0551234567"
        assert result["e164"] == "+966551234567"

    def test_invalid_landline(self):
        with pytest.raises(ValueError, match="كويتي"):
            normalize_phone("0112345678")

    def test_invalid_short(self):
        with pytest.raises(ValueError):
            normalize_phone("055123")

    def test_invalid_empty(self):
        with pytest.raises(ValueError):
            normalize_phone("")

    def test_with_spaces(self):
        result = normalize_phone("055 123 4567")
        assert result["domestic"] == "0551234567"

    def test_with_dashes(self):
        result = normalize_phone("055-123-4567")
        assert result["domestic"] == "0551234567"


class TestValidatePhone:
    def test_valid_returns_true(self):
        assert validate_phone("0551234567") is True

    def test_invalid_returns_false(self):
        assert validate_phone("123") is False
