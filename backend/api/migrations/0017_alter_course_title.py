# Generated by Django 5.0.6 on 2024-06-21 12:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0016_attachment_created_at_attachment_updated_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="title",
            field=models.CharField(max_length=150, unique=True),
        ),
    ]
