# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-03-17 19:10
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0005_auto_20190317_0206'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='shoot_sub_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='portal.ShootSubType'),
        ),
    ]
