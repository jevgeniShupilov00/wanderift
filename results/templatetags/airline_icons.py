from django import template

register = template.Library()


@register.filter(name='aircon')
def aircon(value):
    if value == 'DL':
        return "delta"
    if value == 'AS':
        return 'alaska'
    if value == 'NK':
        return 'spirit'
    if value == 'B6':
        return 'jetblue'
    if value == 'F9':
        return 'frontier'
    if value == 'G4':
        return 'allegiant'
    if value == 'UA':
        return 'united'
    if value == 'AA':
        return 'american'
    if value == 'WN':
        return 'southwest'
    if value == 'SY':
        return 'suncountry'
