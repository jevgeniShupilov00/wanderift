from django.contrib import messages
from django.shortcuts import render, redirect
import stripe

from home.views import home_view
from payments.models import Plans
from subscriptions.models import Subscriptions

stripe.api_key = "sk_test_H2ypPKiLEc14JVbd6OpDIWQv00gPMSrkj1"


def sub_payment(request, plan):
    user = request.user
    if plan == 'pro':
        plan = Plans.objects.filter(name=plan).get()
        stripe.Subscription.create(
            customer=request.user.profile.customer_id,
            items=[
                {
                    "plan": plan.plan_id,
                },
            ]
        )
        subscription = Subscriptions.objects.update_or_create(plan="pro", tokens=4, price=459, defaults={'user': user})
        subscription.save()
        messages.success(request, "You subscribed to pro plan successfully")
    elif plan == 'lite':
        plan = Plans.objects.filter(name=plan).get()
        stripe.Subscription.create(
            customer=request.user.profile.customer_id,
            items=[
                {
                    "plan": plan.plan_id,
                },
            ]
        )
        subscription = Subscriptions.objects.get_or_create(plan="lite", tokens=3, price=369, defaults={'user': user})
        subscription.save()
        messages.success(request, "You subscribed to lite plan successfully")

    messages.success(request, "Payment successful")
    return redirect(home_view)
