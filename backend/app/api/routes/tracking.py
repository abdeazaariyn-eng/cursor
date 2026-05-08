from __future__ import annotations

import uuid
from typing import Any, Optional

from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.tracking import TrackingEventRequest, TrackingEventResponse
from app.db.session import get_db
from app.db.models import TrackingEvent
from app.services.maxmind import check_ip_allowed

router = APIRouter(prefix="/tracking", tags=["tracking"])

def _get_client_ip(request: Request) -> Optional[str]:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None

@router.post("/event", response_model=TrackingEventResponse)
async def relay_tracking_event(
    payload: TrackingEventRequest, 
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> TrackingEventResponse:
    """
    Store tracking events like clicks if they are from valid Kuwait IPs.
    """
    client_ip = _get_client_ip(request)
    
    # We only care about saving clicks (page views) or other events from valid IPs
    is_allowed = await check_ip_allowed(client_ip, "")
    
    if is_allowed:
        event = TrackingEvent(
            event_name=payload.eventName,
            event_id=payload.eventId or str(uuid.uuid4()),
            platform=payload.platform or "web",
            payload=payload.payload,
            status="received"
        )
        if payload.orderId:
            try:
                event.order_id = uuid.UUID(payload.orderId)
            except ValueError:
                pass
        
        db.add(event)
        await db.commit()

    return TrackingEventResponse(success=True, message="Event processed")
