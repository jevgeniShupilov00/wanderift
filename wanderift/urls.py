"""wanderift URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.staticfiles.urls import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include

import info
from booking.views import retail_booking_view, traveller_booking_view
from construction.views import under_construction
from results.views import results_view
from home.views import home_view
from wanderift import settings

urlpatterns = [
    path('admin/', admin.site.urls),

    # site under construction
    # path('', under_construction, name="construction"),

    # Home page links
    path('', home_view, name="home"),

    # Results page urls
    path('results', results_view, name="results"),

    # Accounts page urls
    path('account/', include("account.urls")),

    # Corporate urls
    path('corporates/', include("corporate.urls")),

    # Auth urls
    path('auth/', include("oauth.urls")),

    # Information about Wanderift
    path('info/', include('info.urls')),

    # booking
    path('retail/<str:booking_token>', retail_booking_view, name="retail"),
    path('book', traveller_booking_view, name="book"),

    # subscriptions
    path("subscriptions/", include('subscriptions.urls')),

    # payments
    path('pay/', include('payments.urls'))
]
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

