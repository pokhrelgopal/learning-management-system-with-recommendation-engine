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
    title = models.CharField(max_length=150, unique=True)
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
        default="thumbnail_images/default.png",
        null=True,
        blank=True,
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(Course, self).save(*args, **kwargs)
        Enrollment.objects.get_or_create(user=self.instructor, course=self)

    def can_change(self, user):
        return user == self.instructor or user.is_superuser

    def __str__(self):
        return self.title

    class Meta:
        db_table = "course"
        verbose_name_plural = "Courses"
        ordering = ["-created_at"]
        unique_together = ["title", "instructor"]


class Section(models.Model):
    title = models.CharField(max_length=150)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="sections"
    )
    order = models.PositiveIntegerField()
    is_free = models.BooleanField(default=False)
    video = models.FileField(upload_to="videos/", null=True, blank=True)
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


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="carts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.course.title}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    class Meta:
        db_table = "cart"
        verbose_name_plural = "Carts"
        unique_together = ["user", "course"]


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.course.title}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    def save(self, *args, **kwargs):
        Cart.objects.filter(user=self.user, course=self.course).delete()
        super(Enrollment, self).save(*args, **kwargs)

    class Meta:
        db_table = "enrollment"
        verbose_name_plural = "Enrollments"
        unique_together = ["user", "course"]


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="payments"
    )
    pidx = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.course.title} :: {self.amount}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    def save(self, *args, **kwargs):
        enrollment = Enrollment(user=self.user, course=self.course)
        enrollment.save()
        super(Payment, self).save(*args, **kwargs)

    class Meta:
        db_table = "payment"
        verbose_name_plural = "Payments"
        unique_together = ["user", "course"]


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveIntegerField()
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.course.title}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    class Meta:
        db_table = "review"
        verbose_name_plural = "Reviews"
        unique_together = ["user", "course"]


class Discussion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="discussions")
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="discussions"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.section.title}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    class Meta:
        db_table = "discussion"
        verbose_name_plural = "Discussions"
        ordering = ["-created_at"]
        unique_together = ["user", "section", "message"]


class Reply(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="replies")
    discussion = models.ForeignKey(
        Discussion, on_delete=models.CASCADE, related_name="replies"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.discussion.section.title}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    class Meta:
        db_table = "reply"
        verbose_name_plural = "Replies"


class Progress(models.Model):
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="progresses"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progresses")
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_change(self, user):
        return user == self.user

    def __str__(self):
        return f"{self.user.full_name} :: {self.section.title} :: Progress"

    class Meta:
        verbose_name_plural = "Progress Report"
        ordering = ["-created_at"]
        db_table = "progress"
        unique_together = ["section", "user"]


class Attachment(models.Model):
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="attachments"
    )
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to="attachments/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.section.title} :: {self.file}"

    def can_change(self, user):
        return self.section.can_change(user)

    class Meta:
        db_table = "attachment"
        verbose_name_plural = "Attachments"


class Certificate(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="certificates"
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="certificates"
    )
    file = models.FileField(upload_to="certificates/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} :: {self.course.title}"

    def can_change(self, user):
        return user == self.user or user.is_superuser

    class Meta:
        db_table = "certificate"
        verbose_name_plural = "Certificates"
        unique_together = ["user", "course"]
