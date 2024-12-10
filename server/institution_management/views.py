from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework import status
from server.utils.util_functions.functions import remove_square_brackets
from server.utils.messages.error_messages import (
    error_code_e1010,
    error_code_e1022,
    error_code_e1023,
    error_code_e1025,
    error_code_e1125,
)
from server.utils.permissions.permission import CustomIsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .validators import (
    validate_institution_code,
    validate_institution_name,
    validate_unique_code,
    validate_institution_email,
    validate_unique_email,
    validate_institution_phone,
    # validate_coordinator_name,
    # validate_coordinator_email,
    # validate_coordinator_phone,
    # validate_unique_validate_coordinator_email
)
from .models import Institution
from .serializer import InstitutionSerializer
from student_management.models import Student


class CreateAndListInstitution(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        try:
            institution_name = request.data.get("institutionName")
            institution_code = request.data.get("institutionCode")
            institution_email = request.data.get("institutionEmail")
            institution_phone = request.data.get("institutionPhone")
            coordinator_name = request.data.get("coordinatorName")
            coordinator_email = request.data.get("coordinatorEmail")
            coordinator_phone = request.data.get("coordinatorPhone")
            validate_institution_name(institution_name)
            validate_institution_code(institution_code)
            validate_institution_email(institution_email)
            validate_unique_email(institution_email)
            validate_institution_phone(institution_phone)
            # validate_coordinator_name(coordinator_name)
            # validate_coordinator_email(coordinator_email)
            # validate_coordinator_phone(coordinator_phone)
            # validate_unique_validate_coordinator_email(coordinator_email)
            validate_unique_code(institution_code)
            institution = Institution(
                institution_name=institution_name,
                institution_code=institution_code,
                institution_email=institution_email,
                institution_phone=institution_phone,
                coordinator_name=coordinator_name,
                coordinator_email=coordinator_email,
                coordinator_phone=coordinator_phone,
            )
            institution.save()
            response_data = {
                "id": institution.id,
                "institution_name": institution.institution_name,
                "institution_code": institution.institution_code,
                "institution_email": institution.institution_email,
                "institution_phone": institution.institution_phone,
                "status": institution.status,
                "created_at": institution.created_at,
                "updated_at": institution.updated_at,
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:

            search = request.query_params.get("search")
            if search:
                institutions = Institution.objects.filter(
                    institution_name__icontains=search, status=True
                )
            else:
                institutions = Institution.objects.filter(status=True).order_by(
                    "-created_at"
                )

            paginator = PageNumberPagination()
            result_page = paginator.paginate_queryset(institutions, request)
            serializer = InstitutionSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Institution.DoesNotExist:
            return Response(error_code_e1022(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


class EditDeleteInstitute(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def put(self, request, pk):
        try:
            institute_id = pk
            institution_name = request.data.get("institutionName")
            institution_code = request.data.get("institutionCode")
            institution_email = request.data.get("institutionEmail")
            institution_phone = request.data.get("institutionPhone")
            # coordinator_name = request.data.get("coordinatorName")
            # coordinator_email = request.data.get("coordinatorEmail")
            # coordinator_phone = request.data.get("coordinatorPhone")

            validate_institution_email(institution_email)
            validate_institution_name(institution_name)
            validate_institution_code(institution_code)
            validate_institution_phone(institution_phone)
            # validate_coordinator_name(coordinator_name)
            # validate_coordinator_email(coordinator_email)
            # validate_coordinator_phone(coordinator_phone)

            institution = Institution.objects.get(id=institute_id, status=True)
            if institution.institution_code != institution_code:
                validate_unique_code(institution_code)
            if institution_email != institution.institution_email:
                validate_unique_email(institution_email)
            # if institution.coordinator_email != coordinator_email:
            #     validate_unique_validate_coordinator_email(coordinator_email)
            institution.institution_name = institution_name
            institution.institution_code = institution_code
            institution.institution_email = institution_email
            institution.institution_phone = institution_phone
            # institution.coordinator_name=coordinator_name
            # institution.coordinator_email=coordinator_email
            # institution.coordinator_phone=coordinator_phone
            institution.save()
            response_data = {
                "id": institution.id,
                "institution_name": institution.institution_name,
                "institution_code": institution.institution_code,
                "institution_email": institution.institution_email,
                "institution_phone": institution.institution_phone,
                # "coordinator_email":institution.coordinator_email,
                # "coordinator_phone":institution.coordinator_phone,
                # "coordinator_name":institution.coordinator_name,
                "status": institution.status,
                "created_at": institution.created_at,
                "updated_at": institution.updated_at,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Institution.DoesNotExist:
            return Response(error_code_e1022(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            institute_id = pk
            institution = Institution.objects.get(id=institute_id)
            student = Student.objects.filter(
                institution=institution, status=True
            ).first()
            if student:
                return Response(error_code_e1125(), status=status.HTTP_400_BAD_REQUEST)
            if institution.status == True:
                institution.status = False
                institution.save()
                response_data = {
                    "id": institution.id,
                    "institution_name": institution.institution_name,
                    "institution_code": institution.institution_code,
                    # "coordinator_email":institution.coordinator_email,
                    # "coordinator_phone":institution.coordinator_phone,
                    # "coordinator_name":institution.coordinator_name,
                    "status": institution.status,
                    "created_at": institution.created_at,
                    "updated_at": institution.updated_at,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(error_code_e1023(), status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response(error_code_e1022(), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        try:
            institute_id = pk
            institution = Institution.objects.get(id=institute_id)
            serializer = InstitutionSerializer(institution)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Institution.DoesNotExist:
            return Response(error_code_e1022(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)
