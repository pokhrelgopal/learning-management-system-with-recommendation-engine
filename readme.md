# Learning Management System

## Developed By Gopal Pokhrel

This project is a Learning Management System (LMS) developed using Django for the backend and Next.js for the frontend. The system provides a comprehensive platform for managing courses, users, enrollments, payments, and more.

## Features

- **User Registration & Authentication**
- **Role-based Access Control**
- **Course and Category Management**
- **Section and Attachment Management**
- **Enrollment and Progress Tracking**
- **Payment Processing**
- **Course Reviews and Discussions**
- **Certificates**
- **Content based recommendation system**

## Getting Started

### Prerequisites

- Python 3.x
- Node.js
- PostgreSQL
- Django
- Next.js

### Backend Setup (Django)

1. **Clone the Repository**

   ```sh
   git clone https://github.com/pokhrelgopal/learning-management-system-with-recommendation-engine
   ```

2. **Create a Virtual Environment**

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**

   ```sh
   pip install -r requirements.txt
   ```

4. **Configure the Database**

   - Create a PostgreSQL database and update the `DATABASES` setting in `settings.py`.

5. **Run Migrations**

   ```sh
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a Superuser**

   ```sh
   python manage.py createsuperuser
   ```

7. **Run the Development Server**
   ```sh
   python manage.py runserver
   ```

### Frontend Setup (Next.js)

1. **Navigate to the Frontend Directory**

   ```sh
   cd ../frontend
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Run the Development Server**
   ```sh
   npm run dev
   ```

## Usage

### Accessing the Application

- **Admin Interface**: Navigate to `http://localhost:8000/admin` and log in with the superuser credentials to manage the backend.
- **Frontend Application**: Navigate to `http://localhost:3000` to access the frontend.

### Managing Content

- **Categories & Courses**: Admins and instructors can create and manage course categories and courses.
- **Sections & Attachments**: Add sections and attachments to courses to structure the learning material.
- **Enrollment**: Students can enroll in courses after making payments.
- **Progress Tracking**: Students can track their progress through the course sections.

### Payments

- **Initiate Payment**: Students can add courses to their cart and proceed to payment.
- **Payment Status**: Admins can view and manage payment statuses.

### Reviews & Discussions

- **Course Reviews**: Students can leave reviews and ratings for courses.
- **Discussions**: Students can participate in section-specific discussions.

### Certificates

- **Course Completion**: Upon completing a course, students receive a certificate of completion.
