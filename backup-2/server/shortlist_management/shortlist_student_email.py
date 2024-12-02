import threading
import logging

from django.core.mail import EmailMessage, get_connection
from django.template.loader import render_to_string
from django.conf import settings
from student_management.models import Student

logger = logging.getLogger(__name__)


def send_email(email):
    try:
        # Fetch students based on email
        students = Student.objects.filter(email=email)
        if not students.exists():
            logger.error(f"No student found with email {email}")
            return {"email": email, "status": "failed", "reason": "No student found"}

        email_messages = []
        for student in students:
            subject = "Greetings from Recruit Labs Pvt Ltd"
            context = {"student_name": student.name}
            email_content = render_to_string(
                "shortlist_management/student-email.html", context
            )

            email_message = EmailMessage(
                subject,
                email_content,
                f"HR Support <{settings.EMAIL_HOST_USER}>",
                [student.email],
            )
            email_message.content_subtype = "html"
            email_messages.append(email_message)

        # Send the email messages
        with get_connection() as connection:
            sent_count = connection.send_messages(email_messages)
            logger.info(f"Successfully sent {sent_count} emails to {email}.")

        return {"email": email, "status": "success"}

    except Exception as e:
        logger.error(f"Error sending email to {email}: {e}")
        return {"email": email, "status": "failed", "reason": str(e)}


def email_shortlisted_students(email_list):
    # Create and start a thread for each email
    for email in email_list:
        send_email(email)
