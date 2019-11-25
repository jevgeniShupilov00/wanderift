from django import template
from django.template.defaultfilters import register
from django.utils import dateparse

register = template.Library()


@register.filter(name='comparison')
def comparison(flight):
    price = flight['price']
    if len(flight['routes']) == 1:
        if price > 118:
            return (price-118)
    elif len(flight['routes']) > 1:
        if price > 237:
            return (price-237)