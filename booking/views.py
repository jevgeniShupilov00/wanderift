import requests
from django.contrib.auth.models import User
from django.shortcuts import render

from account.models import Account

apiKey = "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"


def retail_booking_view(request, booking_token):
    check_flights_dto = {
        "booking_token": booking_token,
        "apikey": apiKey,
        "pnum": int(request.session.get('search_query')['adults']),
        "bnum": 0
    }

    request.session["booking_token"] = booking_token
    url = "https://kiwicom-prod.apigee.net/v2/booking/check_flights"
    response = requests.get(url, params=check_flights_dto)
    flight = response.json()
    context = {
        "title": "Retail Booking",
        "flight": flight
    }
    return render(request, "retail.html", context)


def traveller_booking_view(request):
    if request.method == 'POST':
        username = request.POST["email"]
        email = username
        password = ""
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        gender = request.POST["gender"]
        dob = request.POST["dob"]
        phone_number = request.POST["phone_number"]
        card_number = request.POST["card_number"]
        expiry = request.POST["expiry"]
        cvc = request.POST["cvc"]
        country = request.POST["country"]
        zip = request.POST["zip"]

        user = User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)
        user.save()
        user = User.objects.get(pk=user.id)
        user.profile.dob = dob
        user.profile.gender = gender
        user.profile.phone_number = phone_number
        user.profile.save()
        account = Account.objects.create(card_number=card_number, expiry=expiry, cvc=cvc, country=country, zip=zip,
                                         user=user)
        account.save()

        save_booking(request, user)
        context = {
            "users": user
        }
        return render(request, "retail.html", context)
    else:
        context = {}
        return render(request, "retail.html", context)


def save_booking(request, user):
    print(user)
    account = user.account_set.all()
    params = {
        "apikey": apiKey,
        "visitor_uniqid": user.id
    }
    booking = {
        "bags": 0,
        "booking_token": request.session.get("booking_token"),
        "currency": "usd",
        "lang": "en",
        "locale": "en",
        "passengers": [
            {
                "birthday": user.profile.dob,
                "cardno": account[0].card_number,
                "category": "adults",
                "email": user.email,
                "expiration": account[0].cvc,
                "name": user.first_name,
                "nationality": "SE",
                "phone": user.profile.phone_number,
                "surname": user.last_name,
                "title": "ms"
            }
        ]
    }

    headers = {'content-type': 'application/json'}
    url = "https://kiwicom-prod.apigee.net/v2/booking/save_booking"
    response = requests.post(url, params=params, json=booking, headers=headers)
    return response.json()
