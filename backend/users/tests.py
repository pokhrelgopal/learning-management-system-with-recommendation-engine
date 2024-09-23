from django.test import TestCase
from django.contrib.auth import get_user_model


class UserModelTest(TestCase):

    def setUp(self):
        # Set up an initial user for testing creation and updates
        self.user = get_user_model().objects.create_user(
            email="user@example.com",
            password="testpass123",
            full_name="Test User",
            role="student",
        )

    def test_user_creation(self):
        """Test user is created correctly."""
        user = get_user_model().objects.get(email="user@example.com")
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("testpass123"))
        self.assertEqual(user.full_name, "Test User")

    def test_user_update(self):
        """Test user information is updated correctly."""
        self.user.full_name = "Updated Name"
        self.user.save()

        updated_user = get_user_model().objects.get(email="user@example.com")
        self.assertEqual(updated_user.full_name, "Updated Name")

    def test_user_delete(self):
        """Test user is deleted correctly."""
        user_count_before = get_user_model().objects.count()
        self.user.delete()
        user_count_after = get_user_model().objects.count()

        self.assertEqual(user_count_after, user_count_before - 1)
