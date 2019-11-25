from django.contrib.auth.models import User
from django.db import models


class Subscriptions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    plan = models.CharField(max_length=30, blank=False)
    tokens = models.IntegerField(null=False, default=0)
    rollover = models.IntegerField(null=False, default=0)
    price = models.BigIntegerField(null=False, default=0)

    def __str__(self):
        return str(self.tokens)
