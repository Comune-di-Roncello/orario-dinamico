# Generated by Django 5.1.2 on 2024-10-15 09:23

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ufficio',
            fields=[
                ('pkid', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='Orario',
            fields=[
                ('pkid', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('time_start', models.TimeField()),
                ('time_end', models.TimeField()),
                ('day_of_week', models.IntegerField()),
                ('fkufficio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orario', to='webpage.ufficio')),
            ],
        ),
    ]