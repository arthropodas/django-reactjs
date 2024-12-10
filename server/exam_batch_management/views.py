from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from server.utils.permissions.permission import CustomIsAuthenticated
from server.utils.util_functions.functions import (
    remove_square_brackets,
    generate_uuid_for_batch,
)
from server.utils.messages.error_messages import (
    error_code_e1010,
    error_code_e1105,
    error_code_e1106,
    error_code_e1107,
    error_code_e1108,
    error_code_e1109,
    error_code_e4803,
    error_code_e1127
)
from decouple import config
from .validators import validate_batch_name, validate_exam_id, validate_batch_status
from .models import Batch
from rest_framework import status
from django.core.exceptions import ValidationError
from .models import StudentBatchMapping
from exam_management.models import Exam
from django.db.models import Q


# Create your views here.


class BatchsView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        try:
            batch_name = request.data.get("batchName")
            exam_id = request.data.get("examId")
            count_of_students = 0
            if Batch.objects.filter(exam_id=exam_id,batch_name=batch_name,status=True).exists():
                return Response(error_code_e1127(),status=status.HTTP_400_BAD_REQUEST)
            validate_batch_name(batch_name)
            validate_exam_id(exam_id)
            batch_uuid = generate_uuid_for_batch()
            new_batch = Batch.objects.create(
                batch_name=batch_name,
                exam_id=exam_id,
                uuid=batch_uuid,
                count_of_students=count_of_students,
            )

            response_data = {
                "batch_name": new_batch.batch_name,
                "exam_id": new_batch.exam_id,
                "count_of_students": new_batch.count_of_students,
                "status": new_batch.status,
                "uuid": new_batch.uuid,
                "created_at": new_batch.created_at,
                "updated_at": new_batch.updated_at,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class BatchView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def delete(self, request, pk):
        try:
            batch = Batch.objects.get(id=pk, status=True)
            exam_id = batch.exam.pk
            exam = Exam.objects.filter(
                id=exam_id, status_of_exam__in=[Exam.SCHEDULED, Exam.STARTED]
            ).first()
            if exam:
                if batch:
                    batch_mapping = StudentBatchMapping.objects.filter(batch=pk)
                    if batch_mapping.exists():
                        return Response(
                            error_code_e1105(), status=status.HTTP_400_BAD_REQUEST
                        )
                    else:
                        batch.status = False
                        batch.save()
                        return Response(status=status.HTTP_200_OK)
                else:
                    return Response(
                        error_code_e1106(), status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(error_code_e1107(), status=status.HTTP_400_BAD_REQUEST)

        except Exam.DoesNotExist:
            return Response(error_code_e1107(), status=status.HTTP_400_BAD_REQUEST)
        except Batch.DoesNotExist:
            return Response(error_code_e1106(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        batch_status = request.data.get("batchStatus")
        try:
            validate_batch_status(batch_status)
            batch = Batch.objects.get(id=pk, status=True)
            if batch.batch_status == 1:

                Exam.objects.get(
                    id=batch.exam_id, status_of_exam__in=[Exam.SCHEDULED, Exam.STARTED]
                )

                batch.batch_status = batch_status
                batch.save()

                return Response(
                    {"msg": "Batch closed successfully"}, status=status.HTTP_200_OK
                )
            else:
                return Response(error_code_e4803(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:

            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Batch.DoesNotExist:
            return Response(error_code_e1106(), status=status.HTTP_400_BAD_REQUEST)

        except Exam.DoesNotExist:
            return Response(error_code_e1107(), status=status.HTTP_400_BAD_REQUEST)


class BatchStudentsView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, pk):
        try:
            search_key = request.query_params.get("search")
            Batch.objects.get(id=pk, status=True)
            batch_mapping = StudentBatchMapping.objects.filter(batch=pk)

            if search_key:
                batch_mapping = batch_mapping.filter(
                    Q(student__name__icontains=search_key)
                    | Q(student__email__icontains=search_key)
                )

            response_data = [
                {
                    "student_id": mapping.student.id,
                    "student_name": mapping.student.name,
                    "student_email": mapping.student.email,
                    "student_phone": mapping.student.phone,
                    "pass_out_year": mapping.student.pass_out_year,
                    "cgpa": mapping.student.cgpa,
                    "no_of_backlogs": mapping.student.no_of_backlogs,
                    "student_status": mapping.student.status,  # Student status
                    "batch_mapping_status": mapping.student_status,  # Status from the batch mapping
                    "institution": mapping.student.institution.institution_name,
                }
                for mapping in batch_mapping
            ]

            return Response(response_data, status=status.HTTP_200_OK)

        except Batch.DoesNotExist:
            return Response(error_code_e1106(), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            student_id = request.query_params.get("studentId")
            batch = Batch.objects.get(id=pk, status=True)
            exam_id = batch.exam.pk
            exam = Exam.objects.filter(
                id=exam_id, status_of_exam__in=[Exam.SCHEDULED, Exam.STARTED]
            ).first()
            if batch and exam:
                StudentBatchMapping.objects.filter(
                    student=student_id, batch=pk
                ).first().delete()
                batch.count_of_students = batch.count_of_students - 1
                batch.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(error_code_e1108(), status=status.HTTP_400_BAD_REQUEST)
        except Batch.DoesNotExist:
            return Response(error_code_e1106(), status=status.HTTP_400_BAD_REQUEST)
        except Exam.DoesNotExist:
            return Response(error_code_e1107(), status=status.HTTP_400_BAD_REQUEST)
        except StudentBatchMapping.DoesNotExist:
            return Response(error_code_e1109(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


# Create your views here.
