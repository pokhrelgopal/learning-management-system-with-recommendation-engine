# Generated by Django 5.0.6 on 2024-06-20 12:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0009_enrollment_payment"),
    ]

    operations = [
        migrations.AddField(
            model_name="payment",
            name="pidx",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
