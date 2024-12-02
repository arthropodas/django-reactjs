from rest_framework import status
from .models import Student, Exam, Institution
from unittest.mock import patch
from admin_management.models import Admin
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from datetime import datetime, time
from django.test import TestCase, Client
from decouple import config
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from unittest.mock import patch
from .models import Institution, Exam, Student, ExamStudents
from .views import CsvUploadView, validate_institution_id_csv
import io
from django.utils import timezone

from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient, APITestCase
from .models import Student, ExamStudents
from admin_management.models import Admin
from server.utils.messages.error_messages import error_code_e2029, error_code_e2030
CSV_MAX_SIZE_MB = config("CSV_MAX_SIZE_MB")
max_size = int(CSV_MAX_SIZE_MB) * 1024 * 1024

# Reusable Input Data
def create_valid_student_data():
    return {
        "name": "John Doe",
        "email": "asif@gmail.com",
        "phone": "1234567890",
        "passOutYear": 2023,
        "institutionId": None, 
        "cgpa":"10",
        "noOfBacklogs": "1",
    }


def create_student_name_long():
    return {
        "name": "dddddddddJohnDoeJohnDoeJohnDoeJohdddddddddddddddddddddddddddddddddd ddddddd ddddddddddddddddddddddd dddddddddd ddddddnDoeJohnDoe",
        "email": "af@gmail.com",
        "phone": "1234567891",
        "passOutYear": 2025,
        "institutionId": None, 
        "cgpa": "3.8",
         "noOfBacklogs": "1",
    }


def create_invalid_student_data():
    return {
        "name": "Jo",  
        "email": "invalid-email",  
        "phone": "123",  
        "passOutYear": 2005,  
        "institutionId": None,  # Set later
    }
def create_invalid_student_name():
    return {
        "name": "23456789op",  # Invalid name, too short
        "email": "i-email",  # Invalid email
        "phone": "13",  # Invalid phone
        "passOutYear": 2013,  # Invalid year
        "institutionId": None,  # Set later
    }


def create_patch_data(student_ids):
    return {"student_ids": student_ids}


def create_valid_student_data_without_institution():
    return {
        "name": "John Doe",
        "email": "asif@gmail.com",
        "phone": "1234567890",
        "passOutYear": 2023,
        "cgpa":"10",
        "noOfBacklogs": "1",
        "institutionName":"Test institution"
    }


class StudentAPIViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse(
            "create_list_update_student"
        )  # Adjust the URL name based on your urlpatterns

        # Create an Institution with a unique code
        self.institution = Institution.objects.create(
            institution_name="Test Institution", institution_code="INST001", status=True
        )

        # Create an Exam with the relevant attributes
        self.exam = Exam.objects.create(
            exam_name="Test Exam",
            exam_date="2024-01-01",
            exam_time="10:00:00",
            total_questions=100,
            institution=self.institution,
        )

        # Create an Admin for authentication
        self.admin = Admin.objects.create(
            email="test@gmail.com",
            password="test@password.com",  # Ensure the password is hashed if using AbstractBaseUser
            status=True,
        )
        self.client.force_authenticate(
            user=self.admin
        )  # Force authentication for all requests

        # Create a valid student for patch tests
        self.valid_student = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution,
            cgpa = "1",
            no_of_backlogs = "1",
            status=1,
        )

    def test_post_valid_data(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Student.objects.filter(email="johndoe@example.com").exists())
        
    def test_post_null_cgpa(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["cgpa"] = ""
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2101")
        
    def test_post_null_backlogs(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["noOfBacklogs"] = ""
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2102")
      
    def test_post_invalid_cgpa(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["cgpa"] = "dfas"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2103")
        
    def test_post_invalid_backlogs(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["noOfBacklogs"] = "dfas"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2104")
    

    def test_post_invalid_data(self):
        data = create_invalid_student_data()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2040")
        self.assertFalse(Student.objects.filter(email="invalid-email").exists())

    def test_post_long_name(self):
        data = create_student_name_long()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2041")
        response.data["errorCode"]
        self.assertFalse(Student.objects.filter(email="invalid-email").exists())
    def test_post_invalid_name(self):
        data = create_invalid_student_name()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2017")
        response.data["errorCode"]
        self.assertFalse(Student.objects.filter(email="invalid-email").exists())

    def test_post_missing_required_fields(self):
        data = create_valid_student_data()
        del data["phone"]  # Remove a required field
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_students(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]), 1
        )  # Adjust if multiple students are created

    def test_get_students_with_filters(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        self.client.post(self.url, data, format="json")

        response = self.client.get(
            self.url, {"institutionId": self.institution.id}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["email"], "asif@gmail.com")

    def test_get_with_students_passout(self):
        data = create_valid_student_data()
        data["examId"] = self.exam.id
        data["passOutYear"] = 2023
        self.client.post(self.url, data, format="json")
        response = self.client.get(
            self.url,
            {"institutionId": self.institution.id, "pageSize": "2"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["email"], "asif@gmail.com")

    def test_get_with_page_size(self):
        data = create_valid_student_data()
        data["passOutYear"] = 2023
        data["pageSize"] = 1
        self.client.post(self.url, data, format="json")
        response = self.client.get(
            self.url,
            {"institutionId": self.institution.id, "passOutYear": "2023"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["results"][0]["email"], "asif@gmail.com")

    def test_patch_valid_data(self):
        data = create_patch_data([self.valid_student.id])
        response = self.client.patch(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.valid_student.refresh_from_db()
        self.assertEqual(self.valid_student.status, 0)
        
    def test_patch_no_id(self):
        data = create_patch_data([])
        response = self.client.patch(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2030")

    def test_patch_invalid_student_id(self):
        data = create_patch_data([999])  # Non-existing student ID
        response = self.client.patch(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, error_code_e2029())

    def test_patch_empty_student_ids(self):
        data = create_patch_data([])
        response = self.client.patch(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, error_code_e2030())


class StudentGetUpdateAPIViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = lambda pk: reverse("get_update_student", kwargs={"pk": pk})

        # Create an Institution with a unique code
        self.institution = Institution.objects.create(
            institution_name="Test Institution", institution_code="INST001", status=True
        )

        # Create an Exam with the relevant attributes
        self.exam = Exam.objects.create(
            exam_name="Test Exam",
            exam_date="2024-01-01",
            exam_time="10:00:00",
            total_questions=100,
            institution=self.institution,
        )

        # Create an Admin for authentication
        self.admin = Admin.objects.create(
            email="admin@example.com", password="adminpassword", status=True
        )
        self.client.force_authenticate(
            user=self.admin
        )  # Force authentication for all requests

        # Create a student for testing
        self.student = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution,
            cgpa = "2",
            no_of_backlogs="4",
            status=1,
        )

    def test_get_valid_student(self):
        response = self.client.get(self.url(self.student.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.student.id)
        self.assertEqual(response.data["email"], self.student.email)

    def test_get_invalid_student(self):
        response = self.client.get(self.url(999))  # Non-existing student ID
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_valid_data(self):
        data = {
            "name": "Jane Doe",
            "email": "janedoe@example.com",
            "phone": "0987654321",
            "passOutYear": 2024,
            "examId": self.exam.id,
            "institutionId": self.institution.id,
            "cgpa":"1",
            "noOfBacklogs":"0"
        }
        response = self.client.put(self.url(self.student.id), data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.name, "Jane Doe")
        self.assertEqual(self.student.email, "janedoe@example.com")

    def test_put_invalid_data(self):
        data = {
            "name": "",  # Invalid data
            "email": "invalid-email",
            "phone": "not-a-phone",
            "passOutYear": "invalid-year",
            "examId": 999, 
            "institutionId": 999,  
        }
        response = self.client.put(self.url(self.student.id), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_non_existing_student(self):
        data = {
            "name": "Jane Doe",
            "email": "janedoe@example.com",
            "phone": "0987654321",
            "passOutYear": "2024",
            "examId": self.exam.id,
            "institutionId": self.institution.id,
            "cgpa":"1",
            "backlogs":"0"
        }
        response = self.client.put(
            self.url(999), data, format="json"
        )  # Non-existing student ID
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CsvUploadViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("upload_students_csv")

        # Create test institutions and exams
        self.institution = Institution.objects.create(
            id=1, institution_name="Test Institution", status=1
        )
        self.exam = Exam.objects.create(
            exam_name="Mock Exam",
            exam_date=timezone.now().date(),
            exam_time=timezone.now(),  
            student_status=1, 
            total_questions=50,  
            status=1, 
            created_at=timezone.now(),
            updated_at=timezone.now(),
            institution_id=self.institution.id,  
        )
        self.admin = Admin.objects.create(
            email="test@gmail.com",
            password="test@password.com", 
            status=True,
        )
        self.client.force_authenticate(
            user=self.admin
        )  # Force authentication for all requests

    def test_csv_upload_view_missing_required_fields(self):
        csv_content = """name,email,phone
                         John Doe,johndoe@example.com,1234567890"""
        csv_file = SimpleUploadedFile(
            "students.csv", csv_content.encode("utf-8"), content_type="text/csv"
        )

        response = self.client.post(
            self.url,
            {
                "studentsList": csv_file,
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "errorCode", response.data
        )  # Validate that an appropriate error code is returned

    def test_csv_upload_view_invalid_email_format(self):
        csv_content = """name,email,phone,pass_out_year
                         John Doe,johndoe_at_example.com,1234567890,2020"""  # Invalid email format
        csv_file = SimpleUploadedFile(
            "students.csv", csv_content.encode("utf-8"), content_type="text/csv"
        )

        response = self.client.post(
            self.url,
            {
                "studentsList": csv_file,
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)
        # self.assertIn("email", response.data)

    def test_csv_upload_view_invalid_phone_number(self):
        csv_content = """name,email,phone,pass_out_year
                         John Doe,johndoe@example.com,abcd1234,2020""" 
        csv_file = SimpleUploadedFile(
            "students.csv", csv_content.encode("utf-8"), content_type="text/csv"
        )

        response = self.client.post(
            self.url,
            {
                "studentsList": csv_file,
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)

    def test_csv_upload_view_successful_upload(self):
        csv_content = """name,email,phone,pass_out_year,cgpa,no_of_backlogs
                         John Doe,johndoe@example.com,1234567890,2023,5,0"""
        csv_file = SimpleUploadedFile(
            "students.csv", csv_content.encode("utf-8"), content_type="text/csv"
        )

        response = self.client.post(
            self.url,
            {
                "studentsList": csv_file,
                "institutionId": str(self.institution.id),
            },
        )
        print("response: " ,response.data)
        

        self.assertEqual(response.status_code, 200)

    def test_csv_upload_view_empty_csv_file(self):
        csv_file = SimpleUploadedFile("students.csv", b"", content_type="text/csv")

        response = self.client.post(
            self.url,
            {
                "studentsList": csv_file,
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "errorCode", response.data
        )  
    
    def test_csv_upload_view_missing_csv_file(self):
        response = self.client.post(
            self.url,
            {
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e2042")  

    def test_csv_upload_view_csv_file_too_large(self):
        # Generate a large CSV content exceeding CSV_MAX_SIZE_MB
        large_csv_content = "name,email,phone,pass_out_year\n" + ("John Doe,johndoe@example.com,1234567890,2020\n" * 1000000)
        large_csv_file = SimpleUploadedFile(
            "large_students.csv", large_csv_content.encode("utf-8"), content_type="text/csv"
        )

        response = self.client.post(
            self.url,
            {
                "studentsList": large_csv_file,
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e2039")  
        
    def test_csv_upload_invalid_format(self):
    # Generate an empty CSV content with only the header row
        empty_csv_content = "name,email,phone,pass_out_year\n"
        empty_csv_file = SimpleUploadedFile(
            "empty_students.jpg", empty_csv_content.encode("utf-8"), content_type="text/csv"
        )

        response = self.client.post(
            self.url,
            {
                "studentsList": empty_csv_file,
                "institutionId": str(self.institution.id),
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e2034")  



class SelfRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("student_self_registration")
        self.institution = Institution.objects.create(
                institution_name="institution_name",institution_email="",institution_phone="",coordinator_name="",coordinator_email="",coordinator_phone="",
            )
        

    def test_200_ok_with_institution_id(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_ok_new_institution(self):
        data = create_valid_student_data_without_institution()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_null_cgpa(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["cgpa"] = ""
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2101")
        
    def test_post_null_backlogs(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["noOfBacklogs"] = ""
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2102")
      
    def test_post_invalid_cgpa(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["cgpa"] = "dfas"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2103")
        
    def test_post_invalid_backlogs(self):
        data = create_valid_student_data()
        data["institutionId"] = self.institution.id
        data["noOfBacklogs"] = "dfas"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2104")
    

    def test_post_invalid_data(self):
        data = create_invalid_student_data()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2040")
        self.assertFalse(Student.objects.filter(email="invalid-email").exists())

    def test_post_long_name(self):
        data = create_student_name_long()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2041")
        response.data["errorCode"]
        self.assertFalse(Student.objects.filter(email="invalid-email").exists())
    def test_post_invalid_name(self):
        data = create_invalid_student_name()
        data["institutionId"] = self.institution.id
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2017")
        response.data["errorCode"]
        self.assertFalse(Student.objects.filter(email="invalid-email").exists())

    def test_post_missing_required_fields(self):
        data = create_valid_student_data()
        del data["phone"]  # Remove a required field
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_institution_name(self):
        data = create_valid_student_data_without_institution()
        data["institutionName"] = 432
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    @patch("student_management.views.Institution.objects.filter")
    def test_forced_exception(self,mock_filter):
        mock_filter.side_effect = Exception("Forced Exception")
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("student_management.views.Institution.objects.filter")
    def test_institution_not_found(self,mock_filter):
        mock_filter.side_effect = Institution.DoesNotExist("Forced DoesNotExist")
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




    




