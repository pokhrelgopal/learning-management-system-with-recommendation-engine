# Generated by Django 5.0.6 on 2024-07-09 17:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0023_payment_status"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="payment",
            options={"ordering": ["-created_at"], "verbose_name_plural": "Payments"},
        ),
    ]