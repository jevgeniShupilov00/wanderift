from django.urls import path
from corporate.views import corporate_view, trips_view, manage_trips_view, how_it_works

urlpatterns = [
    path('corporate', corporate_view, name="corporate"),
    path('corporate-trips', trips_view, name="trips"),
    path('manage-corporate-trips', manage_trips_view, name="manage-trips"),
    path('corp-how-it-works', how_it_works, name="corp-how-it-works")
]
