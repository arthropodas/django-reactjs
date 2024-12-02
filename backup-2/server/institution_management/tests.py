from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from .models import Institution
from django.core.exceptions import ValidationError
from admin_management.models import Admin
from student_management.models import Student


valid_data = {
    "institutionName": "valid Name",
    "institutionCode": "code123",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

invalid_data_missing_name = {
    "institutionName": "",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
    "institutionPhone": "1234567890",
}

invalid_data_short_name = {
    "institutionName": "a",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
invalid_data_long_name = {
    "institutionName": "a" * 200,
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

invalid_data_name_not_string = {
    "institutionName": 1234,
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

name_with_space_at_beginning = {
    "institutionName": " ValidName",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
name_with_space_at_end = {
    "institutionName": "ValidName ",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
invalid_data_missing_code = {
    "institutionName": "Test Institute",
    "instututionCode": "",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
invalid_data_short_code = {
    "institutionName": "Test Institute",
    "institutionCode": "T",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
invalid_data_long_code = {
    "institutionName": "Test Institute",
    "institutionCode": "T" * 100,
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
invalid_data_code_not_string = {
    "institutionName": "Test Institute",
    "institutionCode": 56789098,
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}
code_with_space_at_beginning = {
    "institutionName": "ValidName",
    "institutionCode": " TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

code_with_space_at_end = {
    "institutionName": "ValidName",
    "institutionCode": "TestCode ",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

duplicate_data_code = {
    "institutionName": "ValidName",
    "institutionCode": "Duplicate",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

data_with_no_coordinator_name = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
}

data_with_invalid_coordinator_name = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
    "coordinatorName":2345
}

data_with_invalid_coordinator_name_too_small = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
    "coordinatorName":"a"
}

data_with_invalid_coordinator_name_too_big = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
    "coordinatorName":"a"*150
}

data_with_invalid_coordinator_name_space_at_beginning = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
    "coordinatorName":" afdsdfgdsfg"
}

data_with_invalid_coordinator_name_space_at_end = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "1234567891",
    "coordinatorName":"afdsdfgdsfg "
}

data_with_no_coordinator_mail = {
     "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorPhone": "1234567891",
    "coordinatorName":"valid coordinator name"
}

data_with_invalid_coordinator_email = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "testmailgmailcom",
    "coordinatorPhone": "1234567891",
    "coordinatorName":"valid coordinator name"
}

data_with_duplicate_coordinator_email = {
    "institutionName": "1234",
    "institutionCode": "TestCode",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorEmail": "duplicate@gmail.com",
    "coordinatorPhone": "1234567891",
    "coordinatorName":"valid coordinator name"
}

data_with_no_coordinator_phone = {

    "institutionName": "valid Name",
    "institutionCode": "code123",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
}

data_with_invalid_coordinator_phone = {

    "institutionName": "valid Name",
    "institutionCode": "code123",
    "institutionEmail": "validmail@gmail.com",
    "institutionPhone": "1234567890",
    "coordinatorName": "test valid name",
    "coordinatorEmail": "testmail@gmail.com",
    "coordinatorPhone": "123452345678987654323456789"
}

exception_data = {"sasds"}


class CreateInstitutionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("institution_create_list")
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.institution = Institution.objects.create(
            id=1,
            institution_name="Dummy Institution",
            institution_code="Duplicate",
            coordinator_name="name one",
            coordinator_email="emailone@gmail.com",
            coordinator_phone="1234567892",
            status=True,
        )

        self.institution2 = Institution.objects.create(
            id=2,
            institution_name="Dummy Institution",
            institution_code="Duplicate2",
            coordinator_name="name one",
            coordinator_email="duplicate@gmail.com",
            coordinator_phone="1234567892",
            status=True,
        )

    def test_200_success_added_new_institution(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, valid_data)
        self.assertEqual(response.status_code, 201)

    def test_400_name_missing(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, invalid_data_missing_name)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1011")

    def test_400_short_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, invalid_data_short_name)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1013")

    def test_400_long_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, invalid_data_long_name)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1012")

    def test_400_name_not_string(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            self.url, invalid_data_name_not_string, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1014")

    def test_400_space_at_beginning_of_the_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, name_with_space_at_beginning)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1019")

    def test_400_space_at_end_of_the_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, name_with_space_at_end)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1019")

    def test_400_code_missing(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, invalid_data_missing_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1015")

    def test_400_code_too_short(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, invalid_data_short_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1016")

    def test_400_code_too_long(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, invalid_data_long_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1017")

    def test_400_code_not_string(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            self.url, invalid_data_code_not_string, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1018")

    def test_400_space_at_beginning_of_the_code(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, code_with_space_at_beginning)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1020")

    def test_400_space_at_end_of_the_code(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, code_with_space_at_end)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1020")

    def test_unique_code(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, duplicate_data_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1021")

    def test_exception(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, exception_data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_unauthorised(self):
        response = self.client.post(self.url, valid_data)
        self.assertEqual(response.status_code, 401)

    # def test_400_no_coordinator_name(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_no_coordinator_name, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_name, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_less_than_three(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_name_too_small, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_too_big(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_name_too_big, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_space_at_beginning(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_name_space_at_beginning,format='json')
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_space_at_end(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_name_space_at_end,format='json')
    #     self.assertEqual(response.status_code, 400)

    # def test_400_no_coordinator_email(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_no_coordinator_mail, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_email(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_email, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_duplicate_coordinator_email(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_duplicate_coordinator_email, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_no_coordinator_phone(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_no_coordinator_phone, format="json")
    #     self.assertEqual(response.status_code, 400)


    # def test_400_invalid_coordinator_phone(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.post(self.url, data_with_invalid_coordinator_phone, format="json")
    #     self.assertEqual(response.status_code, 400)


class EditInstituteTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.institution = Institution.objects.create(
            id=1,
            institution_email="validemail@gmail.com",
            institution_name="Dummy Institution",
            institution_code="Duplicate",
            institution_phone="1234567890",
            coordinator_name="name one",
            coordinator_email="emailone@gmail.com",
            coordinator_phone="1234567892",
            status=True,
        )
        self.institution2 = Institution.objects.create(
            id=2,
            institution_email="validemail2@gmail.com",
            institution_name="Dummy Institution",
            institution_code="Valid",
            coordinator_name="name two",
            coordinator_email="duplicate@gmail.com",
            coordinator_phone="1234567893",
            status=True,
        )
        self.url = reverse(
            "institution_edit_delete_get_by_id", kwargs={"pk": self.institution.id}
        )
        self.url_to_check_duplicate = reverse(
            "institution_edit_delete_get_by_id", kwargs={"pk": self.institution2.id}
        )
        self.invalid_url = reverse(
            "institution_edit_delete_get_by_id", kwargs={"pk": 99}
        )

    def test_200_success_edited_new_institution(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, valid_data)
        self.assertEqual(response.status_code, 200)

    def test_400_name_missing(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, invalid_data_missing_name)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1011")

    def test_400_short_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, invalid_data_short_name)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1013")

    def test_400_long_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, invalid_data_long_name)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1012")

    def test_400_name_not_string(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(
            self.url, invalid_data_name_not_string, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1014")

    def test_400_space_at_beginning_of_the_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, name_with_space_at_beginning)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1019")

    def test_400_space_at_end_of_the_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, name_with_space_at_end)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1019")

    def test_400_code_missing(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, invalid_data_missing_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1015")

    def test_400_code_too_short(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, invalid_data_short_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1016")

    def test_400_code_too_long(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, invalid_data_long_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1017")

    def test_400_code_not_string(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(
            self.url, invalid_data_code_not_string, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1018")

    def test_400_space_at_beginning_of_the_code(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, code_with_space_at_beginning)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1020")

    def test_400_space_at_end_of_the_code(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, code_with_space_at_end)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1020")

    def test_unique_code(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url_to_check_duplicate, duplicate_data_code)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1021")

    def test_invalid_institute_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.invalid_url, valid_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1022")

    def test_exception(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, exception_data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_unauthorised(self):
        response = self.client.put(self.url, valid_data)
        self.assertEqual(response.status_code, 401)


    # def test_400_no_coordinator_name(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_no_coordinator_name, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_name, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_less_than_three(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_name_too_small, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_too_big(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_name_too_big, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_space_at_beginning(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_name_space_at_beginning,format='json')
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_name_space_at_end(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_name_space_at_end,format='json')
    #     self.assertEqual(response.status_code, 400)

    # def test_400_no_coordinator_email(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_no_coordinator_mail, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_invalid_coordinator_email(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_email, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_duplicate_coordinator_email(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_duplicate_coordinator_email, format="json")
    #     self.assertEqual(response.status_code, 400)

    # def test_400_no_coordinator_phone(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_no_coordinator_phone, format="json")
    #     self.assertEqual(response.status_code, 400)


    # def test_400_invalid_coordinator_phone(self):
    #     self.client.force_authenticate(user=self.admin)
    #     response = self.client.put(self.url, data_with_invalid_coordinator_phone, format="json")
    #     self.assertEqual(response.status_code, 400)


class DeleteInstituteTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.institution_deleted = Institution.objects.create(
            id=1,
            institution_name="Deleted Institution",
            institution_code="Deleted12",
            coordinator_name="name one",
            coordinator_email="emailone@gmail.com",
            coordinator_phone="1234567892",
            status=False,
        )
        self.institution_active = Institution.objects.create(
            id=2,
            institution_name="Active Institution",
            institution_code="Active124",
            coordinator_name="name two",
            coordinator_email="emailtwo@gmail.com",
            coordinator_phone="1234567893",
            status=True,
        )
        
        self.institution_has_student = Institution.objects.create(
            id=3,
            institution_name="Active Institution",
            institution_code="Active123",
            coordinator_name="name two",
            coordinator_email="emailthree@gmail.com",
            coordinator_phone="1234567893",
            status=True,
        )
        self.student = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_has_student,
            cgpa = "2",
            no_of_backlogs="4",
            course=Student.BTECH_CSE,
            status=1,
        )
        self.url = self.url = reverse(
            "institution_edit_delete_get_by_id",
            kwargs={"pk": self.institution_active.id},
        )
        self.invalid_url = reverse(
            "institution_edit_delete_get_by_id", kwargs={"pk": 9999}
        )
        self.already_deleted_url = reverse(
            "institution_edit_delete_get_by_id",
            kwargs={"pk": self.institution_deleted.id},
        )
        self.institution_has_student_url = reverse(
            "institution_edit_delete_get_by_id",
            kwargs={"pk": self.institution_has_student.id},
        )

    def test_200_deleted_successfully(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 200)

    def test_400_already_deleted(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.already_deleted_url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1023")

    def test_400_institute_not_found(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.invalid_url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["errorCode"], "e1022")
        
    def test_400_institute_has_student(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.institution_has_student_url)
        self.assertEqual(response.status_code, 400)

    @patch("institution_management.views.Institution.objects.get")
    def test_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Exception("Forced Exception")
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("institution_management.views.Institution.objects.get")
    def test_doesnotexist_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Institution.DoesNotExist("Forced DoesNotExist")
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1022")

    def test_unauthorised(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 401)


class ListInstitutionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="admin@test.com", password="test@password.com", status=True
        )

        self.url = reverse("institution_create_list")  # Adjust to your actual URL name

        # Create multiple institutions using a for loop
        institution_data = [
            {
                "id": 1,
                "institution_name": "Institution 1",
                "institution_code": "INST001",
                "coordinator_name": "name one",
                "coordinator_email": "email1@gmail.com",
                "coordinator_phone": "1234567892",
                "status": True,
            },
            {
                "id": 2,
                "institution_name": "Institution 2",
                "institution_code": "INST002",
                "coordinator_name": "name one",
                "coordinator_email": "email2@gmail.com",
                "coordinator_phone": "1234567892",
                "status": True,
            },
            {
                "id": 3,
                "institution_name": "Institution 3",
                "institution_code": "INST003",
                "coordinator_name": "name one",
                "coordinator_email": "email3@gmail.com",
                "coordinator_phone": "1234567892",
                "status": False,
            },  # This one is inactive
            {
                "id": 4,
                "institution_name": "Test Institution",
                "institution_code": "TST001",
                "coordinator_name": "name one",
                "coordinator_email": "email4@gmail.com",
                "coordinator_phone": "1234567892",
                "status": True,
            },
            {
                "id": 5,
                "institution_name": "Another Institution",
                "institution_code": "AN001",
                "coordinator_name": "name one",
                "coordinator_email": "email5@gmail.com",
                "coordinator_phone": "1234567892",
                "status": True,
            },
        ]

        for data in institution_data:
            Institution.objects.create(**data)

    def test_get_all_institutions(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 4)

    def test_get_institutions_with_search(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"search": "Test"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEquals(response.data["count"], 0)

    def test_get_institutions_no_results(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"search": "NonExistent"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    def test_pagination(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"page": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("results" in response.data)
        self.assertTrue("count" in response.data)
        self.assertTrue("next" in response.data or response.data["next"] is None)
        self.assertTrue(
            "previous" in response.data or response.data["previous"] is None
        )

    @patch("institution_management.views.Institution.objects.filter")
    def test_400_table_not_exist_in_search(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Institution.DoesNotExist
        response = self.client.get(self.url, {"search": "zzzzzz"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("institution_management.views.Institution.objects.filter")
    def test_list_category_with_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Exception("Forced Exception")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1010")


class DetailsOfInstitution(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.institution_active = Institution.objects.create(
            id=2,
            institution_name="Active Institution",
            institution_code="Active123",
            coordinator_name= "name one",
            coordinator_email= "emailone@gmail.com",
            coordinator_phone= "1234567892",
            status=True,
        )
        self.url = reverse(
            "institution_edit_delete_get_by_id",
            kwargs={"pk": self.institution_active.id},
        )
        self.invalid_url = reverse(
            "institution_edit_delete_get_by_id", kwargs={"pk": 890}
        )

        self.admin = Admin.objects.create(
            id=1, email="admin@test.com", password="test@password.com", status=True
        )

    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.invalid_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1022")

    @patch("institution_management.views.Institution.objects.get")
    def test_list_category_with_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Exception("Forced Exception")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1010")

    def test_unauthorised(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
