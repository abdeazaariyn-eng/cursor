from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel


class TrackingEventRequest(BaseModel):
    eventName: str
    eventId: Optional[str] = None
    platform: Optional[str] = None
    orderId: Optional[str] = None
    payload: Optional[dict[str, Any]] = None


class TrackingEventResponse(BaseModel):
    success: bool
    message: str
