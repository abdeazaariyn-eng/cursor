from __future__ import annotations

import base64
import secrets
from datetime import datetime, timedelta
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import func, select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.models import Order, TrackingEvent
from app.db.session import get_db

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBasic()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, settings.ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, settings.ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@router.get("/metrics")
async def get_metrics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    query_orders = select(func.count(Order.id), func.sum(Order.total_kwd)).where(Order.status != "cancelled")
    query_clicks = select(func.count(TrackingEvent.id)).where(TrackingEvent.event_name == "click")
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query_orders = query_orders.where(Order.created_at >= start_dt)
        query_clicks = query_clicks.where(TrackingEvent.created_at >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date) + timedelta(days=1)
        query_orders = query_orders.where(Order.created_at < end_dt)
        query_clicks = query_clicks.where(TrackingEvent.created_at < end_dt)
        
    result_orders = await db.execute(query_orders)
    orders_count, revenue = result_orders.first() or (0, 0)
    
    result_clicks = await db.execute(query_clicks)
    clicks_count = result_clicks.scalar() or 0
    
    conversion_rate = (orders_count / clicks_count * 100) if clicks_count and clicks_count > 0 else 0
    
    return {
        "orders": orders_count,
        "revenue": float(revenue) if revenue else 0,
        "clicks": clicks_count,
        "conversion_rate": round(conversion_rate, 2)
    }

@router.get("/orders")
async def get_orders(
    page: int = 1,
    limit: int = 50,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * limit
    
    query = select(Order).order_by(desc(Order.created_at)).offset(offset).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return {
        "orders": [
            {
                "id": str(o.id),
                "order_number": o.order_number,
                "customer_name": o.customer_name,
                "phone": o.phone_raw,
                "status": o.status,
                "total_kwd": float(o.total_kwd),
                "created_at": o.created_at.isoformat() if o.created_at else None,
                "client_ip": o.client_ip
            } for o in orders
        ]
    }
