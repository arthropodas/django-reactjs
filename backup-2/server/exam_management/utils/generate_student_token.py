from django.conf import settings
import uuid
import jwt


def generate_token(self, exam_id, student_id):
    jti = str(uuid.uuid4())

    payload = {"student_id": student_id, "exam_id": exam_id, "jti": jti}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token
