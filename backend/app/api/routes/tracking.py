from __future__ import annotations

from fastapi import APIRouter

from app.schemas.tracking import TrackingEventRequest, TrackingEventResponse

router = APIRouter(prefix="/tracking", tags=["tracking"])


@router.post("/event", response_model=TrackingEventResponse)
async def relay_tracking_event(payload: TrackingEventRequest) -> TrackingEventResponse:
    """
    Optional browser-to-server tracking relay endpoint.
    Can be extended to store events or trigger additional CAPI calls.
    """
    return TrackingEventResponse(success=True, message="Event received")
