from django import template
from django.utils import dateparse

register = template.Library()


@register.filter(name='time_interval')
def time_interval(value):
    x = dateparse.parse_datetime(value['local_departure'])
    y = dateparse.parse_datetime(value['local_arrival'])
    z = y-x
    hours = int(z.seconds/3600)
    minutes = int(z.seconds/60 - (hours*60))
    return str(hours)+"h "+str(minutes)+"m "
