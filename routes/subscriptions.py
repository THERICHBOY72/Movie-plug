# Implement subscription lifecycle endpoints.
# Features:
# - Create subscription
# - Cancel / resume
# - Check subscription status
# - Enforce access rules
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from dependencies import get_current_user, User
from database import get_subscription_by_user, create_subscription, update_subscription_status
from enums import SubscriptionStatus
router = APIRouter()
class SubscriptionCreateRequest(BaseModel):
    plan_id: str
    payment_method: str
class SubscriptionStatusResponse(BaseModel):
    status: SubscriptionStatus
    valid_until: Optional[datetime]
@router.post("/subscriptions", response_model=SubscriptionStatusResponse)
async def create_subscription_endpoint(
    request: SubscriptionCreateRequest,
    current_user: User = Depends(get_current_user)
):
    subscription = create_subscription(current_user.id, request.plan_id, request.payment_method)
    return SubscriptionStatusResponse(status=subscription.status, valid_until=subscription.valid_until)
@router.post("/subscriptions/cancel", response_model=SubscriptionStatusResponse)
async def cancel_subscription_endpoint(
    current_user: User = Depends(get_current_user)
):
    subscription = update_subscription_status(current_user.id, SubscriptionStatus.CANCELED)
    return SubscriptionStatusResponse(status=subscription.status, valid_until=subscription.valid_until)
@router.post("/subscriptions/resume", response_model=SubscriptionStatusResponse)
async def resume_subscription_endpoint(
    current_user: User = Depends(get_current_user)
):
    subscription = update_subscription_status(current_user.id, SubscriptionStatus.ACTIVE)
    return SubscriptionStatusResponse(status=subscription.status, valid_until=subscription.valid_until)
@router.get("/subscriptions/status", response_model=SubscriptionStatusResponse)
async def check_subscription_status_endpoint(
    current_user: User = Depends(get_current_user)
):
    subscription = get_subscription_by_user(current_user.id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return SubscriptionStatusResponse(status=subscription.status, valid_until=subscription.valid_until)
    # Note: Access enforcement logic would typically be implemented in middleware or within the video access endpoints.
    