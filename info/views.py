from django.shortcuts import render


def news_view(request):
    context = {
        'title': 'Wanderift news'
    }
    return render(request, 'news.html', context)


def about_view(request):
    context = {
        'title': 'About us'
    }
    return render(request, 'about.html', context)


def feedback_view(request):
    context = {
        'title': 'Feedback'
    }
    return render(request, 'feedback.html', context)


def team_view(request):
    context = {
        'title': 'Wanderift Team'
    }
    return render(request, 'team.html', context)


def partners_view(request):
    context = {
        'title': 'Wanderift Partners'
    }
    return render(request, 'partners.html', context)


def how_it_works_view(request):
    context = {
        'title': 'How it Works'
    }
    return render(request, 'personal-how-it-works.html', context)


def corporate_how_it_works_view(request):
    context = {
        'title': 'Corporate How it Works'
    }
    return render(request, 'how-it-works.html', context)


def faq_view(request):
    context = {
        "title": "Wanderift faq"
    }
    return render(request, "faq.html", context)
