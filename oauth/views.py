from django.contrib import messages, auth
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect

from account.views import account_view
from home.views import home_view


def create_user(request):
    username = request.POST.get("email", "admin@gmail.com")
    email = username
    password = request.POST["password"]

    user = User.objects.create_user(username, email, password)
    user.save()
    user = authenticate(request, username=username, password=password)
    auth.login(request, user)
    return redirect(account_view)


def login_user(request):
    username = request.POST["email"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        auth.login(request, user)
        return redirect(home_view)
    else:
        messages.error(request, 'Failed: Your credentials were incorrect')
        return redirect(home_view)


def forgot_password(request):
    user = User.objects.get(username=request.POST["email"])

    if user is not None:
        user.set_password(request.POST["password"])
        user.save()
        return HttpResponse("Password reset successfully", status=200)
    else:
        return HttpResponse("Failed: Email does not exist", status=405)


def logout_view(request):
    logout(request)
    messages.success(request, 'Successfully logged out')
    return redirect(home_view)
