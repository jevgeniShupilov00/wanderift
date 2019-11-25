from django import template

register = template.Library()


@register.filter(name='airlines')
def airlines(value):
    if value == 'DL':
        return "Delta"
    if value == 'AS':
        return 'Alaska'
    if value == 'NK':
        return 'Spirit'
    if value == 'B6':
        return 'JetBlue'
    if value == 'F9':
        return 'Frontier'
    if value == 'G4':
        return 'Allegiant'
    if value == 'UA':
        return 'United'
    if value == 'AA':
        return 'American'
    if value == 'WN':
        return 'Southwest'
    if value == 'SY':
        return 'Sun Country'
