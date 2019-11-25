from django.urls import path

from info.views import news_view, about_view, feedback_view, team_view, partners_view, how_it_works_view, corporate_how_it_works_view ,faq_view

urlpatterns = [
    path('news', news_view, name="news"),
    path('about', about_view, name="about"),
    path('feedback', feedback_view, name="feedback"),
    path('team', team_view, name="team"),
    path('partners', partners_view, name="partners"),
    path('how-it-works', how_it_works_view, name="how-it-works"),
    path('corporate-how-it-works', corporate_how_it_works_view, name="corporate-how-it-works"),
    path('faq', faq_view, name="faq")
]
