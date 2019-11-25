from django import template
from django.utils import dateparse

register = template.Library()


@register.filter(name='iso_date')
def iso_date(value):
    y = dateparse.parse_datetime(value)
    return y
