# from student_management.models import Student
# from django.conf import settings
# from django.core.mail import EmailMessage
# from django.template.loader import render_to_string


# def send_exam_link(email_list, institution_instance):
#     recipients_data = []

#     institution_email = institution_instance.institution_email
#     institution_subject = "Greetings from Recruit Labs Pvt Ltd"

#     shortlisted_students = Student.objects.filter(email__in=email_list)

#     institution_context = {
#         "institution_name": institution_instance.institution_name,
#         "shortlisted_students": shortlisted_students,
#     }

#     institution_email_content = render_to_string(
#         "valuation_management/institution-email.html", institution_context
#     )

#     institution_email_message = EmailMessage(
#         institution_subject,
#         institution_email_content,
#         f"HR Support <{settings.EMAIL_HOST_USER}>",
#         [institution_email],
#     )
#     institution_email_message.content_subtype = "html"

#     recipients_data.append(institution_email_message)

#     # Sending email to students

#     for student in shortlisted_students:
#         subject = "Greetings from Recruit Labs Pvt Ltd"
#         context = {
#             "student_name": student.name,
#         }
#         student_instance = Student.objects.get(id=student.id)
#         exam_student_instance = ExamStudents.objects.get(student_id=student_instance)
#         exam_student_instance.is_shortlisted = 1
#         exam_student_instance.save()

#         email_content = render_to_string(
#             "valuation_management/student-email.html", context
#         )

#         student_email_message = EmailMessage(
#             subject,
#             email_content,
#             f"HR Support <{settings.EMAIL_HOST_USER}>",
#             [student.email],
#         )
#         student_email_message.content_subtype = "html"

#         recipients_data.append(student_email_message)

#     return recipients_data
