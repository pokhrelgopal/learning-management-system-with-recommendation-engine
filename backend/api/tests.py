import django.contrib.auth
from django.test import TestCase
import requests
from users.models import User
from .models import (
    Category,
    Course,
    Section,
    Cart,
    Review,
    Discussion,
    Reply,
    Progress,
    Attachment,
)


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
        """Test course is created correctly."""
        self.assertEqual(self.course.title, "Django Course")
        self.assertEqual(self.course.instructor, self.user)
        self.assertEqual(self.course.category, self.category)

    def test_read_course(self):
        """Test reading the course details."""
        course = Course.objects.get(title="Django Course")
        self.assertEqual(course.title, "Django Course")
        self.assertEqual(course.instructor, self.user)
        self.assertEqual(course.category, self.category)

    def test_update_course(self):
        """Test updating course details."""
        self.course.title = "Updated Django Course"
        self.course.save()
        updated_course = Course.objects.get(title="Updated Django Course")
        self.assertEqual(updated_course.title, "Updated Django Course")

    def test_delete_course(self):
        """Test deleting a course."""
        course_id = self.course.id
        self.course.delete()
        self.assertFalse(Course.objects.filter(id=course_id).exists())

    def test_create_duplicate_course(self):
        """Test creating a course with the same title (optional)."""
        with self.assertRaises(
            Exception
        ):  # Adjust if your model has unique constraints
            Course.objects.create(
                title="Django Course", instructor=self.user, category=self.category
            )


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
        """Test section is created correctly."""
        self.assertEqual(self.section.title, "Introduction")
        self.assertEqual(self.section.course, self.course)

    def test_read_section(self):
        """Test reading the section details."""
        section = Section.objects.get(title="Introduction")
        self.assertEqual(section.title, "Introduction")
        self.assertEqual(section.course, self.course)

    def test_update_section(self):
        """Test updating section details."""
        self.section.title = "Introduction to Django"
        self.section.save()
        updated_section = Section.objects.get(title="Introduction to Django")
        self.assertEqual(updated_section.title, "Introduction to Django")

    def test_delete_section(self):
        """Test deleting a section."""
        section_id = self.section.id
        self.section.delete()
        self.assertFalse(Section.objects.filter(id=section_id).exists())

    def test_create_duplicate_section(self):
        """Test creating a section with the same title in the same course (optional)."""
        with self.assertRaises(
            Exception
        ):  # Adjust if your model has unique constraints
            Section.objects.create(title="Introduction", course=self.course, order=2)


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
        """Test cart is created correctly."""
        self.assertEqual(self.cart.user, self.user)
        self.assertEqual(self.cart.course, self.course)

    def test_read_cart(self):
        """Test reading the cart details."""
        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.course, self.course)

    def test_delete_cart(self):
        """Test deleting the cart."""
        cart_id = self.cart.id
        self.cart.delete()
        self.assertFalse(Cart.objects.filter(id=cart_id).exists())

    def test_add_course_to_cart(self):
        """Test adding a new course to the cart."""
        new_course = Course.objects.create(
            title="Java Course", instructor=self.user, category=self.category
        )
        Cart.objects.create(user=self.user, course=new_course)
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 2)

    def test_remove_course_from_cart(self):
        """Test removing a course from the cart."""
        self.cart.delete()  # Remove the initial course from the cart
        self.assertFalse(
            Cart.objects.filter(user=self.user, course=self.course).exists()
        )


class PaymentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="student@test.com", password="test123", role="student"
        )
        self.category = Category.objects.create(name="Development")
        self.course = Course.objects.create(
            title="Django Course", instructor=self.user, category=self.category
        )

    def test_initiate_payment_with_missing_fields(self):
        """Test initiating payment with missing fields."""
        payload = {
            "amount": 1000,
            "purchase_order_id": "PO123",
            "purchase_order_name": "Test Order",
            # Missing return_url and website_url
        }

        response = requests.post(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            json=payload,
            headers={"Authorization": "Key dbf107a9c72548468029bdf82a8335de"},
        )

        self.assertEqual(response.status_code, 400)  # Assuming bad request status code
        self.assertNotIn(
            "pidx", response.json()
        )  # pidx should not be present in error responses

    def test_initiate_payment_success(self):
        """Test initiating payment with all required fields."""
        payload = {
            "return_url": "https://example.com/return/",
            "website_url": "https://example.com/",
            "amount": 1000,
            "purchase_order_id": "PO123",
            "purchase_order_name": "Test Order",
        }

        response = requests.post(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            json=payload,
            headers={"Authorization": "Key dbf107a9c72548468029bdf82a8335de"},
        )

        self.assertEqual(response.status_code, 200)  # Assuming success status code
        self.assertIn(
            "pidx", response.json()
        )  # pidx should be present in successful responses

    def test_initiate_payment_with_invalid_amount(self):
        """Test initiating payment with invalid amount."""
        payload = {
            "return_url": "https://example.com/return/",
            "website_url": "https://example.com/",
            "amount": -100,  # Invalid amount
            "purchase_order_id": "PO123",
            "purchase_order_name": "Test Order",
        }

        response = requests.post(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            json=payload,
            headers={"Authorization": "Key dbf107a9c72548468029bdf82a8335de"},
        )

        self.assertEqual(response.status_code, 400)  # Assuming bad request status code
        self.assertNotIn("pidx", response.json())


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

    def test_duplicate_review_not_allowed(self):
        with self.assertRaises(Exception):  # You can specify IntegrityError if needed
            Review.objects.create(
                user=self.user, course=self.course, rating=5, review="Another review!"
            )


from django.test import TestCase
from .models import Discussion, Section, Course, Category
from users.models import User


class DiscussionModelTest(TestCase):
    def setUp(self):
        # Create a Course instance
        self.category = Category.objects.create(name="Development")
        self.instructor = User.objects.create_user(
            email="instructor@example.com",
            password="password",
            full_name="Instructor Name",
            role="instructor",
        )
        self.course = Course.objects.create(
            title="Test Course",
            description="Description of the test course",
            category=self.category,
            instructor=self.instructor,
        )

        # Create a Section instance associated with the created Course
        self.section = Section.objects.create(
            title="Test Section", course=self.course, order=1
        )

        # Create a User instance for the discussion
        self.user = User.objects.create_user(
            email="student@example.com",
            password="password",
            full_name="Student Name",
            role="student",
        )

    def test_create_discussion(self):
        # Create a Discussion instance associated with the Section
        discussion = Discussion.objects.create(
            user=self.user, section=self.section, message="Test Discussion Message"
        )
        self.assertEqual(discussion.message, "Test Discussion Message")

    def test_read_discussion(self):
        # Create a Discussion first
        discussion = Discussion.objects.create(
            user=self.user, section=self.section, message="Test Discussion Message"
        )
        retrieved_discussion = Discussion.objects.get(id=discussion.id)
        self.assertEqual(retrieved_discussion.message, "Test Discussion Message")

    def test_update_discussion(self):
        # Create a Discussion first
        discussion = Discussion.objects.create(
            user=self.user, section=self.section, message="Test Discussion Message"
        )
        discussion.message = "Updated Test Discussion Message"
        discussion.save()
        self.assertEqual(discussion.message, "Updated Test Discussion Message")

    def test_delete_discussion(self):
        # Create a Discussion first
        discussion = Discussion.objects.create(
            user=self.user, section=self.section, message="Test Discussion Message"
        )
        discussion_id = discussion.id
        discussion.delete()
        with self.assertRaises(Discussion.DoesNotExist):
            Discussion.objects.get(id=discussion_id)
