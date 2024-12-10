import jwt
from functools import wraps
from django.http import JsonResponse
from rest_framework import status
from django.conf import settings
from jwt.exceptions import InvalidTokenError
from rest_framework.response import Response
from exam_management.models import Exam
from exam_batch_management.models import StudentBatchMapping
from server.utils.messages.error_messages import (
    error_code_e2025,
    error_code_e406)
SECRET_KEY = settings.SECRET_KEY

def decode_token_from_query_params(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        try:
            # Access the real DRF request object (which contains query_params)
            token = request.query_params.get('token')
            decoded_data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            student_id = decoded_data.get('student_id')
            batch_id = decoded_data.get('batch_id')

            response = StudentBatchMapping.objects.get(
                student_id=student_id, batch_id=batch_id
            )
            exam = Exam.objects.get(id=response.exam_id)
            decoded_data['exam'] = exam
            decoded_data['response'] = response
            request.decoded_token = decoded_data

        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidTokenError:
            return Response(error_code_e406(), status=status.HTTP_400_BAD_REQUEST)
        except Exam.DoesNotExist:
            return Response(error_code_e2025(), status=status.HTTP_400_BAD_REQUEST)

        return view_func(self, request, *args, **kwargs)

    return _wrapped_view
