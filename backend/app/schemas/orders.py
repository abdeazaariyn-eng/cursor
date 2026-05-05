from __future__ import annotations

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


VALID_PRODUCT_IDS = {
    "baby_head_protection_mask",
    "portable_baby_bottle_warmer",
    "wearable_electric_breast_pump",
}

VALID_OFFER_IDS = {
    "one_piece",
    "two_pieces",
    "three_pieces",
}


class CustomerIn(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., min_length=5, max_length=50)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        stripped = v.strip()
        if len(stripped) < 2:
            raise ValueError("اكتبي اسمك عشان نأكد الطلب")
        return stripped


class OrderItemIn(BaseModel):
    productId: str
    offerId: str

    @field_validator("productId")
    @classmethod
    def validate_product_id(cls, v: str) -> str:
        if v not in VALID_PRODUCT_IDS:
            raise ValueError(f"معرف المنتج غير صحيح: {v}")
        return v

    @field_validator("offerId")
    @classmethod
    def validate_offer_id(cls, v: str) -> str:
        if v not in VALID_OFFER_IDS:
            raise ValueError(f"معرف العرض غير صحيح: {v}")
        return v


class AttributionIn(BaseModel):
    landingPage: Optional[str] = None
    source: Optional[str] = None
    utmSource: Optional[str] = None
    utmMedium: Optional[str] = None
    utmCampaign: Optional[str] = None
    utmContent: Optional[str] = None
    utmTerm: Optional[str] = None
    fbp: Optional[str] = None
    fbc: Optional[str] = None
    ttp: Optional[str] = None
    ttclid: Optional[str] = None
    scClickId: Optional[str] = None


class EventsIn(BaseModel):
    leadEventId: Optional[str] = None
    purchaseEventId: Optional[str] = None


class CreateOrderRequest(BaseModel):
    customer: CustomerIn
    items: list[OrderItemIn] = Field(..., min_length=1)
    attribution: Optional[AttributionIn] = None
    events: Optional[EventsIn] = None


class UpsellRequest(BaseModel):
    action: str = Field(..., pattern="^(accepted|skipped)$")
    productId: Optional[str] = None

    @field_validator("productId")
    @classmethod
    def validate_product_id(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_PRODUCT_IDS:
            raise ValueError(f"معرف المنتج غير صحيح: {v}")
        return v


class FinalizeRequest(BaseModel):
    purchaseEventId: Optional[str] = None
    browserEventSent: bool = False


class RecommendedUpsell(BaseModel):
    productId: str
    priceKwd: int


class CreateOrderResponse(BaseModel):
    orderId: str
    orderNumber: str
    status: str
    totalKwd: float
    recommendedUpsell: Optional[RecommendedUpsell] = None


class UpsellResponse(BaseModel):
    orderId: str
    upsellStatus: str
    totalKwd: float


class FinalizeResponse(BaseModel):
    orderId: str
    orderNumber: str
    status: str
    thankYouUrl: str


class OrderItemOut(BaseModel):
    productId: str
    productNameAr: str
    offerId: str
    quantity: int
    priceKwd: float
    isUpsell: bool


class GetOrderResponse(BaseModel):
    orderId: str
    orderNumber: str
    status: str
    totalKwd: float
    customerName: str
    items: list[OrderItemOut]
    createdAt: str


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail
