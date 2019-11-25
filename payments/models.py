from django.contrib.auth.models import User
from django.db import models

from account.models import Account
from subscriptions.models import Subscriptions


class Payments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=None)
    subscription = models.ForeignKey(Subscriptions, on_delete=None)
    amount = models.BigIntegerField()
    status = models.CharField(max_length=10, blank=True)
    plan_id = models.CharField(max_length=70, blank=True)


class Plans(models.Model):
    plan_id = models.CharField(max_length=70, blank=True, unique=True)
    active = models.BooleanField(blank=True)
    amount = models.BigIntegerField(blank=True)
    currency = models.CharField(max_length=10, blank=True)
    name = models.CharField(max_length=20, blank=True, unique=True)
    product = models.CharField(max_length=70, blank=True)
