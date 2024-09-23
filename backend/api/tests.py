from django.test import TestCase
from users.models import User
from .models import (
    Category,
    Course,
    Section,
    Cart,
    Enrollment,
    Payment,
    Review,
    Discussion,
    Reply,
    Progress,
    Attachment,
    Certificate,
)  # Adjust 'your_app' to the actual app name where the models are defined


class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Development")

    def test_category_creation(self):
        self.assertEqual(self.category.name, "Development")

    def test_category_update(self):
        self.category.name = "Programming"
        self.category.save()
        self.assertEqual(self.category.name, "Programming")

    def test_category_deletion(self):
        self.category.delete()
        self.assertFalse(Category.objects.filter(name="Development").exists())


class CourseModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="instructor@test.com", password="test123", role="instructor"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )

    def test_course_creation(self):
        self.assertEqual(self.course.title, "Django Course")
        self.assertEqual(self.course.instructor, self.user)

    def test_course_update(self):
        self.course.title = "Advanced Django Course"
        self.course.save()
        self.assertEqual(self.course.title, "Advanced Django Course")

    def test_course_deletion(self):
        self.course.delete()
        self.assertFalse(Course.objects.filter(title="Django Course").exists())


class SectionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="instructor@test.com", password="test123", role="instructor"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.section = Section.objects.create(
            title="Introduction", course=self.course, order=1
        )

    def test_section_creation(self):
        self.assertEqual(self.section.title, "Introduction")

    def test_section_update(self):
        self.section.title = "Introduction to Django"
        self.section.save()
        self.assertEqual(self.section.title, "Introduction to Django")

    def test_section_deletion(self):
        self.section.delete()
        self.assertFalse(Section.objects.filter(title="Introduction").exists())


class CartModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="student@test.com", password="test123", role="student"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.cart = Cart.objects.create(user=self.user, course=self.course)

    def test_cart_creation(self):
        self.assertEqual(self.cart.user, self.user)

    def test_cart_update(self):
        new_course = Course.objects.create(
            title="Python Course", instructor=self.user, category=self.category
        )
        self.cart.course = new_course
        self.cart.save()
        self.assertEqual(self.cart.course.title, "Python Course")

    def test_cart_deletion(self):
        self.cart.delete()
        self.assertFalse(Cart.objects.filter(user=self.user).exists())


class ReviewModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="student@test.com", password="test123", role="student"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.review = Review.objects.create(
            user=self.user, course=self.course, rating=5, review="Great course!"
        )

    def test_review_creation(self):
        self.assertEqual(self.review.review, "Great course!")
        self.assertEqual(self.review.rating, 5)

    def test_review_update(self):
        self.review.review = "Excellent course!"
        self.review.rating = 4
        self.review.save()
        self.assertEqual(self.review.review, "Excellent course!")
        self.assertEqual(self.review.rating, 4)

    def test_review_deletion(self):
        self.review.delete()
        self.assertFalse(
            Review.objects.filter(user=self.user, course=self.course).exists()
        )


class DiscussionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="student@test.com", password="test123", role="student"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.section = Section.objects.create(
            title="Introduction", course=self.course, order=1
        )
        self.discussion = Discussion.objects.create(
            user=self.user, section=self.section, message="This is a discussion"
        )

    def test_discussion_creation(self):
        self.assertEqual(self.discussion.message, "This is a discussion")

    def test_discussion_update(self):
        self.discussion.message = "Updated discussion message"
        self.discussion.save()
        self.assertEqual(self.discussion.message, "Updated discussion message")

    def test_discussion_deletion(self):
        self.discussion.delete()
        self.assertFalse(
            Discussion.objects.filter(user=self.user, section=self.section).exists()
        )


class ReplyModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="student@test.com", password="test123", role="student"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.section = Section.objects.create(
            title="Introduction", course=self.course, order=1
        )
        self.discussion = Discussion.objects.create(
            user=self.user, section=self.section, message="This is a discussion"
        )
        self.reply = Reply.objects.create(
            user=self.user, discussion=self.discussion, message="This is a reply"
        )

    def test_reply_creation(self):
        self.assertEqual(self.reply.message, "This is a reply")

    def test_reply_update(self):
        self.reply.message = "Updated reply message"
        self.reply.save()
        self.assertEqual(self.reply.message, "Updated reply message")

    def test_reply_deletion(self):
        self.reply.delete()
        self.assertFalse(
            Reply.objects.filter(user=self.user, discussion=self.discussion).exists()
        )


class ProgressModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="student@test.com", password="test123", role="student"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.section = Section.objects.create(
            title="Introduction", course=self.course, order=1
        )
        self.progress = Progress.objects.create(
            user=self.user, section=self.section, completed=True
        )

    def test_progress_creation(self):
        self.assertTrue(self.progress.completed)

    def test_progress_update(self):
        self.progress.completed = False
        self.progress.save()
        self.assertFalse(self.progress.completed)

    def test_progress_deletion(self):
        self.progress.delete()
        self.assertFalse(
            Progress.objects.filter(user=self.user, section=self.section).exists()
        )


class AttachmentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="instructor@test.com", password="test123", role="instructor"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )
        self.section = Section.objects.create(
            title="Introduction", course=self.course, order=1
        )
        self.attachment = Attachment.objects.create(
            section=self.section, name="Syllabus", file="path/to/syllabus.pdf"
        )

    def test_attachment_creation(self):
        self.assertEqual(self.attachment.name, "Syllabus")
        self.assertEqual(self.attachment.file, "path/to/syllabus.pdf")

    def test_attachment_update(self):
        self.attachment.name = "Updated Syllabus"
        self.attachment.file = "path/to/updated_syllabus.pdf"
        self.attachment.save()
        self.assertEqual(self.attachment.name, "Updated Syllabus")
        self.assertEqual(self.attachment.file, "path/to/updated_syllabus.pdf")

    def test_attachment_deletion(self):
        self.attachment.delete()
        self.assertFalse(Attachment.objects.filter(section=self.section).exists())
