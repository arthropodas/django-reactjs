from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import get_template
import jwt
from datetime import datetime, timedelta, timezone
from decouple import config
import uuid
from exam_batch_management.models import Batch


def remove_square_brackets(json_string):
    updated_data = {key: value[0] for key, value in json_string.items()}
    return updated_data


def send_email(mail, subject, template, url, data=None):
    final_url = config('BASE_URL_ADMIN') + url
    link_to_send = {"url": final_url}
    app_name = settings.APP_NAME
    token_expiry = settings.RESET_TOKEN_EXPIRY

    if data is not None:
        context = {
            **link_to_send,
            **data,
            "app_name": app_name,
            "token_expiry": token_expiry,
        }
    else:
        context = {**link_to_send, "app_name": app_name}

    from_email = f"<{settings.EMAIL_HOST}>"
    html = get_template(template)
    html_content = html.render(context)
    msg = EmailMultiAlternatives(subject, "", from_email, [mail])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


def generate_reset_token(email, user_id):
    token_expiry_minutes = int(config("RESET_TOKEN_EXPIRY", default=1))
    exp = datetime.now(timezone.utc) + timedelta(minutes=token_expiry_minutes)
    jti = str(uuid.uuid4())
    payload = {
        "email": email,
        "user_id": user_id,
        "exp": exp,
        "token_type": "reset_password",
        "jti": jti,
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


def convert_error(error_dict):
    value = {
        "errorCode": error_dict["errorCode"][0],
        "errorMsg": error_dict["errorMsg"][0],
    }
    return value


def generate_student_exam_token(exam_id, student_id):
    jti = str(uuid.uuid4())
    payload = {"student_id": student_id, "exam_id": exam_id, "jti": jti}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


def generate_uuid_for_batch():

    while True:
        text = config('UUID_PREFIX')
        length = config('UUID_LENGTH')
        total_length = int(length)
        print("type of text",type(len(text)))
        print("type of length",type(length))

        unique_part = uuid.uuid4().hex[:total_length - len(text)].upper()
        result = f"{text}{unique_part}"
        updated_with_zero =  result.ljust(total_length, '0') 
        if not Batch.objects.filter(uuid=updated_with_zero).exists():
            return updated_with_zero

import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

def create_access_token(user_id):
    """
    Create a JWT access token.

    Args:
        user_id (int): The ID of the user for whom the token is created.

    Returns:
        str: The generated access token.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),  # Token expires in 15 minutes
        "iat": datetime.now(timezone.utc),  # Issued at time
        "token_type": "access"
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


def create_refresh_token(user_id):
    """
    Create a JWT refresh token.

    Args:
        user_id (int): The ID of the user for whom the token is created.

    Returns:
        str: The generated refresh token.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),  # Token expires in 7 days
        "iat": datetime.now(timezone.utc),  # Issued at time
        "token_type": "refresh"
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token
