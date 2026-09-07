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


class CustomerLocationIn(BaseModel):
    country: Optional[str] = Field(None, max_length=50)
    city: Optional[str] = Field(None, max_length=100)
    area: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = None


class OrderItemIn(BaseModel):
    productId: str
    offerId: str
    variantName: Optional[str] = Field(None, max_length=255)
    color: Optional[str] = Field(None, max_length=255)

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
    location: Optional[CustomerLocationIn] = None
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
    customerPhoneMasked: str
    items: list[OrderItemOut]
    createdAt: str


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail


# Admin API schemas

class CODSyncInfo(BaseModel):
    """COD (Cash on Delivery) sync information"""
    syncStatus: str  # pending, sent, failed
    codOrderId: Optional[str] = None
    trackingNumber: Optional[str] = None
    lastSync: Optional[str] = None
    syncError: Optional[str] = None


class AdminOrderDetail(BaseModel):
    """Detailed order information for admin panel"""
    orderId: str
    orderNumber: str
    orderStatus: str  # new, confirmed, processing, sent, delivered, cancelled, returned
    totalKwd: float
    customerName: str
    customerPhone: str
    country: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    items: list[OrderItemOut]
    cod: CODSyncInfo
    sheetSyncStatus: str  # pending, sent, failed
    sheetSyncError: Optional[str] = None
    createdAt: str
    updatedAt: str


class UpdateOrderStatusRequest(BaseModel):
    """Request to update order status"""
    orderStatus: Optional[str] = None


class UpdateCODStatusRequest(BaseModel):
    """Request to update COD sync status"""
    codSyncStatus: Optional[str] = None
    codOrderId: Optional[str] = None
    codTrackingNumber: Optional[str] = None
    syncError: Optional[str] = None


class RetrySheetSyncRequest(BaseModel):
    """Request to retry Google Sheets sync"""
    pass

