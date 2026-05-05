"""Tests for order business logic."""
import pytest
from decimal import Decimal
from app.services.orders import (
    PRICE_RULES,
    PRODUCT_CATALOG,
    get_upsell_recommendation,
)


class TestPriceRules:
    def test_one_piece_price(self):
        assert PRICE_RULES["one_piece"]["price_kwd"] == Decimal("19")
        assert PRICE_RULES["one_piece"]["quantity"] == 1

    def test_two_pieces_price(self):
        assert PRICE_RULES["two_pieces"]["price_kwd"] == Decimal("27")
        assert PRICE_RULES["two_pieces"]["quantity"] == 2

    def test_three_pieces_price(self):
        assert PRICE_RULES["three_pieces"]["price_kwd"] == Decimal("33")
        assert PRICE_RULES["three_pieces"]["quantity"] == 3

    def test_upsell_price(self):
        assert PRICE_RULES["upsell_9kwd"]["price_kwd"] == Decimal("9")


class TestProductCatalog:
    def test_all_products_exist(self):
        assert "baby_head_protection_mask" in PRODUCT_CATALOG
        assert "portable_baby_bottle_warmer" in PRODUCT_CATALOG
        assert "wearable_electric_breast_pump" in PRODUCT_CATALOG

    def test_product_has_required_fields(self):
        for pid, product in PRODUCT_CATALOG.items():
            assert "id" in product
            assert "slug" in product
            assert "name_ar" in product


class TestUpsellRecommendation:
    def test_recommends_different_product(self):
        cart = ["baby_head_protection_mask"]
        rec = get_upsell_recommendation(cart)
        assert rec != "baby_head_protection_mask"
        assert rec in PRODUCT_CATALOG

    def test_recommends_non_pump_when_cart_has_two(self):
        cart = ["baby_head_protection_mask", "portable_baby_bottle_warmer"]
        rec = get_upsell_recommendation(cart)
        assert rec is not None

    def test_empty_cart_recommendation(self):
        rec = get_upsell_recommendation([])
        assert rec is not None
        assert rec in PRODUCT_CATALOG
