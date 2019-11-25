from django.urls import path

from payments.views import sub_payment

urlpatterns = [
    path('payment/<str:plan>', sub_payment, name='payment')
]
