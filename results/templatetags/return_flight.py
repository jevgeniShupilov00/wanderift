from django import template

register = template.Library()


@register.filter(name='return_date')
def return_date(value):
    return_data = []
    for route in value:
        if route["return"] == 1:
            return_data.append(route)
    return return_data
