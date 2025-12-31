# Integrate Stripe subscription payments.
# Include:
# - Checkout session creation
# - Webhook verification
# - Subscription state updates
# - Failed payment handling
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from dependencies import get_current_user, User
from database import create_stripe_checkout_session, update_subscription_status, get_subscription_by_user
from enums import SubscriptionStatus
import stripe
router = APIRouter()
stripe.api_key = "your_stripe_secret_key"  # Replace with your actual Stripe secret
class CheckoutSessionRequest(BaseModel):
    plan_id: str
class CheckoutSessionResponse(BaseModel):
    session_id: str
@router.post("/payments/checkout-session", response_model=CheckoutSessionResponse)
async def create_checkout_session_endpoint(
    request: CheckoutSessionRequest,
    current_user: User = Depends(get_current_user)
):
    session = create_stripe_checkout_session(current_user.id, request.plan_id)
    return CheckoutSessionResponse(session_id=session.id)
@router.post("/payments/webhook")
async def stripe_webhook_endpoint(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    endpoint
    secret = "your_stripe_webhook_secret"  # Replace with your actual Stripe webhook secret
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata']['user_id']
        update_subscription_status(user_id, SubscriptionStatus.ACTIVE)
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        user_id = invoice['metadata']['user_id']
        update_subscription_status(user_id, SubscriptionStatus.PAST_DUE)
    return {"status": "success"}
    # Note: Ensure to handle other relevant events as needed for your subscription logic.
    