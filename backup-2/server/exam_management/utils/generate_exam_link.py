from student_management.models import Student
from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.core.exceptions import ValidationError
from server.utils.messages.error_messages import error_code_e4011


def send_exam_link(exam_student):
    recipients_data = []

    for exam in exam_student:
        student_data = Student.objects.get(id=exam.student_id.id)
        student_token = student_data.token
        if not student_token:
            raise ValidationError(error_code_e4011())
        exam.link_sent = 1
        exam.save()
        exam_link = f"{settings.BASE_URL}/examPortal?token={student_token}"
        subject = "Greetings from Recruit Labs Pvt Ltd"

        context = {
            "student_name": student_data.name,
            "exam_link": exam_link,
        }

        # Append email and message for bulk sending
        email_content = render_to_string("exam_management/student-link.html", context)
        email = EmailMessage(
            subject,
            email_content,
            f"HR Support <{settings.EMAIL_HOST_USER}>",
            [student_data.email],
        )

        email.content_subtype = "html"

        recipients_data.append(email)

    return recipients_data
		