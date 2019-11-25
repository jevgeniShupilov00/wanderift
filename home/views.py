from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def home_view(request):
    print(request.user)
    context = {
        "title": "Wanderift | Search, Book, Save with Wanderift",
    }
    return render(request, "home.html", context)
