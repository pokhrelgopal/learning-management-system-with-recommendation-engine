from django.db import models
from users.models import User
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "category"
        verbose_name_plural = "Categories"


class Course(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=200, unique=True, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="courses",
        null=True,
        blank=True,
    )
    instructor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="instructor"
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0, null=True, blank=True
    )
    thumbnail = models.ImageField(
        upload_to="thumbnail_images/",
        default="thumbnail_images/thumbnail.png",
        null=True,
        blank=True,
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(Course, self).save(*args, **kwargs)

    def can_change(self, user):
        return user == self.instructor or user.is_superuser

    def __str__(self):
        return self.title

    class Meta:
        db_table = "course"
        verbose_name_plural = "Courses"
        ordering = ["-created_at"]


class Section(models.Model):
    title = models.CharField(max_length=150)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="sections"
    )
    order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} :: {self.course.title}"

    def can_change(self, user):
        return self.course.can_change(user)

    class Meta:
        db_table = "section"
        verbose_name_plural = "Sections"
        ordering = ["order"]
        unique_together = ["course", "title"]


class Module(models.Model):
    title = models.CharField(max_length=150)
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="modules"
    )
    order = models.PositiveIntegerField()
    video = models.FileField(upload_to="videos/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} :: {self.section.title}"

    def can_change(self, user):
        return self.section.can_change(user)

    class Meta:
        db_table = "module"
        verbose_name_plural = "Modules"
        ordering = ["order"]
        unique_together = ["section", "title"]
