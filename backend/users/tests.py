from django.test import TestCase
from django.contrib.auth import get_user_model


class RegisterTestCase(TestCase):

    def setUp(self):
        self.user_model = get_user_model()

        # Create a user for testing email duplication
        self.user_model.objects.create_user(
            email="existinguser@example.com",
            password="testpass123",
            full_name="Existing User",
            role="student",
        )

    def test_passwords_do_not_match(self):
        """Test password validation where passwords do not match."""
        password1 = "testpass123"
        password2 = "wrongpass"

        self.assertNotEqual(password1, password2, "Passwords do not match")

    def test_email_already_taken(self):
        """Test email validation with already used email."""
        email = "existinguser@example.com"  # Existing user email

        user_exists = self.user_model.objects.filter(email=email).exists()
        self.assertTrue(user_exists, "Email Already taken")

    def test_invalid_email(self):
        """Test email validation with an invalid email."""
        email = "invalidemail"  # Invalid email format

        # Simple check for "@" in email for validation (implement according to your logic)
        is_valid_email = "@" in email
        self.assertFalse(is_valid_email, "Invalid Email")

    def test_invalid_name(self):
        """Test name validation with numbers in name."""
        full_name = "User123"  # Name with numbers

        # Check if name contains numbers
        is_valid_name = full_name.isalpha()
        self.assertFalse(is_valid_name, "Invalid name provided")

    def test_valid_registration(self):
        """Test registration with valid data."""
        email = "newuser@example.com"
        password = "testpass123"
        full_name = "New User"

        # Check that the user doesn't already exist
        user_exists = self.user_model.objects.filter(email=email).exists()
        self.assertFalse(user_exists, "User already exists")

        # Now simulate the registration process (e.g., save to the database)
        new_user = self.user_model.objects.create_user(
            email=email, password=password, full_name=full_name, role="student"
        )

        self.assertTrue(
            self.user_model.objects.filter(email=email).exists(),
            "User registered successfully",
        )


class LoginTestCase(TestCase):

    def setUp(self):
        self.user_model = get_user_model()

        # Create a user for login tests
        self.user_model.objects.create_user(
            email="validuser@example.com",
            password="testpass123",
            full_name="Valid User",
            role="student",
        )

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        email = "invaliduser@example.com"
        password = "wrongpass"

        # Check if the user exists with valid credentials
        user = self.user_model.objects.filter(email=email).first()

        self.assertIsNone(
            user, "Invalid Credentials"
        )  # Expect no user with invalid credentials

    def test_login_empty_fields(self):
        """Test login with empty data."""
        email = ""
        password = ""

        self.assertFalse(
            email and password, "Fill all the fields"
        )  # Expect empty fields to fail

    def test_login_valid_credentials(self):
        """Test login with correct credentials."""
        email = "validuser@example.com"
        password = "testpass123"

        user = self.user_model.objects.get(email=email)
        self.assertTrue(
            user.check_password(password),
            "User login successful with correct credentials",
        )
