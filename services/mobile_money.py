# Implement Mobile Money payment integration.
# Requirements:
# - Payment initiation
# - Callback verification
# - Subscription activation
# - Idempotency handling
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from dependencies import get_current_user, User
from database import initiate_mobile_money_payment, verify_mobile_money_callback, activate_subscription
from enums import SubscriptionStatus
router = APIRouter()
class MobileMoneyPaymentRequest(BaseModel):
    amount: float
    phone_number: str
    plan_id: str
class MobileMoneyPaymentResponse(BaseModel):
    payment_id: str
    status: str
@router.post("/payments/mobile-money", response_model=MobileMoneyPaymentResponse)
async def initiate_mobile_money_payment_endpoint(
    request: MobileMoneyPaymentRequest,
    current_user: User = Depends(get_current_user)
):
    payment = initiate_mobile_money_payment(
        user_id=current_user.id,
        amount=request.amount,
        phone_number=request.phone_number,
        plan_id=request.plan_id
    )
    return MobileMoneyPaymentResponse(payment_id=payment.id, status=payment.status)
@router.post("/payments/mobile-money/callback")
async def mobile_money_callback_endpoint(request: Request):
    payload = await request.json()
    try:
        callback_data = verify_mobile_money_callback(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if callback_data['status'] == 'SUCCESS':
        activate_subscription(
            user_id=callback_data['user_id'],
            plan_id=callback_data['plan_id'],
            payment_id=callback_data['payment_id']
        )
    return {"status": "success"}
    # Note: Ensure idempotency by checking if the payment_id has already been processed before
    # activating the subscription in the activate_subscription function.
    