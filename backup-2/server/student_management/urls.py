from django.urls import path
from .views import (
    StudentAPIView,
    StudentGetUpdateAPIView,
    CsvUploadView,
    SelfRegistration,
    StudentVerification,
    MarkListOfStudent
)


urlpatterns = [
    path("admin/students", StudentAPIView.as_view(), name="create_list_update_student"),
    path(
        "admin/students/<int:pk>",
        StudentGetUpdateAPIView.as_view(),
        name="get_update_student",
    ),
    path("admin/students/upload/", CsvUploadView.as_view(), name="upload_students_csv"),
    path(
        "student/self-registration",
        SelfRegistration.as_view(),
        name="student_self_registration",
    ),
    path(
        "student/verification",
        StudentVerification.as_view(),
        name="student_verification",
    ),
    path(
        "admin/student-response",
        MarkListOfStudent.as_view(),
        name="student_response_of_exam",
    )
]
