# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-03-26 04:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0007_auto_20190325_2213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='changestaken',
            name='remarks',
            field=models.CharField(max_length=128, null=True),
        ),
    ]