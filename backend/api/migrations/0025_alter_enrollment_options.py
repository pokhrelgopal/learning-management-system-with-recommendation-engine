# Generated by Django 5.0.6 on 2024-07-09 17:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0024_alter_payment_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="enrollment",
            options={"ordering": ["-created_at"], "verbose_name_plural": "Enrollments"},
        ),
    ]