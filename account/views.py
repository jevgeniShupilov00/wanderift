from datetime import datetime

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import stripe

from account.models import Account
from payments.models import Plans
from subscriptions.models import Subscriptions

stripe.api_key = "sk_test_H2ypPKiLEc14JVbd6OpDIWQv00gPMSrkj1"


@login_required
def account_view(request):
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    try:
        account = Account.objects.filter(user=user)
    except Account.DoesNotExist:
        account = None

    if account is not None:
        context = {
            "title": "Accounts",
            "account": account
        }
        return render(request, "accounts.html", context)
    else:
        account = {}
        context = {
            "title": "Accounts",
            "account": account
        }
        return render(request, "accounts.html", context)


@login_required()
def update_profile(request):
    user_id = request.user.id
    if request.method == 'POST':
        user = User.objects.get(pk=user_id)
        user.first_name = request.POST["first_name"]
        user.last_name = request.POST["last_name"]
        user.email = request.POST["email"]
        user.profile.dob = request.POST["dob"]
        user.profile.gender = request.POST["gender"]
        user.profile.market = request.POST["market"]
        user.save()
    messages.success(request, 'Details updated Successfully')
    return redirect('accounts')


@login_required()
def save_card(request):
    user_id = request.user.id
    if request.method == 'POST':
        user = User.objects.get(pk=user_id)

        card_number = request.POST["card_number"]
        expiry = request.POST["expiry"]
        cvc = request.POST["cvc"]
        country = request.POST["country"]
        zip = request.POST["zip"]

        card_info = card_token(card_number, expiry, cvc)
        account = Account.objects.create(card_number=card_number,
                                         expiry=expiry, cvc=cvc,
                                         country=country, zip=zip,
                                         brand=card_info.card.brand,
                                         last4=card_info.card.last4,
                                         stripe_id=card_info.card.id,
                                         token=card_info.id,
                                         user=user)
        account.save()
        customer = stripe_customer(user)
        user.profile.customer_id = customer.id
        user.profile.save()
        messages.success(request, 'Card details updated Successfully')
        return redirect('accounts')
    else:
        messages.error(request, 'Details update failed. Please try again')
        return redirect('accounts')


def stripe_customer(user):
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=user.account_set.all()[0].token  # obtained with Stripe.js
    )


def card_token(card_number, expiry, cvc):
    date_object = datetime.strptime(expiry, "%d/%m/%Y")
    return stripe.Token.create(
        card={
            'number': card_number,
            'exp_month': date_object.month,
            'exp_year': date_object.year,
            'cvc': cvc,
        })


def sub_user(request):
    user = request.user
    if request.method == 'POST':
        if request.POST['subscription'] == 'pro':
            user = request.user
            plan = Plans.objects.filter(name="pro").get()
            stripe.Subscription.create(
                customer=request.user.profile.customer_id,
                items=[
                    {
                        "plan": plan.plan_id
                    },
                ]
            )
            subscription = Subscriptions.objects.create(plan="pro", tokens=4, price=459, user=user)
            subscription.save()
            messages.success(request, "You subscribed to pro plan successfully")
        elif request.POST['subscription'] == 'lite':
            user = request.user
            plan = Plans.objects.filter(name="lite").get()
            stripe.Subscription.create(
                customer=request.user.profile.customer_id,
                items=[
                    {
                        "plan": plan.plan_id
                    },
                ]
            )
            subscription = Subscriptions.objects.create(plan="lite", tokens=3, price=369, user=user)
            subscription.save()
            messages.success(request, "You subscribed to lite plan successfully")
    return redirect(account_view)
