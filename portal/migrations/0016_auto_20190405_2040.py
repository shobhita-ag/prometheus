# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-04-05 15:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0015_auto_20190405_2028'),
    ]

    operations = [
        migrations.AlterField(
            model_name='changesimplementation',
            name='end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='changesimplementation',
            name='start_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='changestaken',
            name='changes_taken_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='colorcorrection',
            name='end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='colorcorrection',
            name='start_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='delivery',
            name='delivery_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='dummysent',
            name='dummy_sent_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='layout',
            name='end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='layout',
            name='start_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='posecutting',
            name='end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='posecutting',
            name='start_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='printing',
            name='end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='printing',
            name='start_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='shoot',
            name='end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='shoot',
            name='start_date',
            field=models.DateTimeField(null=True),
        ),
    ]
