from django.shortcuts import render


def corporate_view(request, *args, **kwargs):
    context = {
        "title": "Wanderift Corporates"
    }
    return render(request, "corporate.html", context)


def trips_view(request, *args, **kwargs):
    context = {
        "title": "Corporates Trips"
    }
    return render(request, "trips.html", context)


def manage_trips_view(request, *args, **kwargs):
    context = {
        "title": "Manage Corporates Trips"
    }
    return render(request, "manage-trips.html", context)


def how_it_works(request):
    context = {
        "title": "How it works"
    }

    return render(request, "how-it-works.html", context)
