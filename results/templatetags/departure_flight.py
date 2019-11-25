from django import template

register = template.Library()


@register.filter(name='departure_date')
def departure_date(value):
    departure_data = []
    for route in value:
        if route["return"] == 0:
            departure_data.append(route)
    return departure_data
