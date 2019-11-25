from django.urls import path
from account.views import account_view, update_profile, save_card, sub_user

urlpatterns = [
    path('accounts', account_view, name="accounts"),
    path('profile', update_profile, name="profile"),
    path('save-card', save_card, name="save-card"),
    path('subscribe', sub_user, name="subscribe")
]
