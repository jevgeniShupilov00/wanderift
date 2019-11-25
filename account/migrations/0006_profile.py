# Generated by Django 2.2.4 on 2019-09-05 11:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0005_auto_20190903_1932'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('market', models.CharField(blank=True, max_length=30)),
                ('gender', models.CharField(blank=True, max_length=10)),
                ('phone_number', models.CharField(blank=True, max_length=20)),
                ('dob', models.DateField(blank=True, null=True)),
                ('stripe_id', models.CharField(blank=True, max_length=50)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
