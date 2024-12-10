from rest_framework.views import APIView
from rest_framework.response import Response
from .validators import validate_question_category_name, validate_unique_name
from django.core.exceptions import ValidationError
from rest_framework import status
from server.utils.messages.error_messages import (
    error_code_e1010,
    error_code_e1006,
    error_code_e1008,
    error_code_e1024,
    error_code_e1124
)
from server.utils.util_functions.functions import remove_square_brackets
from .models import QuestionCategory
from .serializer import QuestionCategoryManagementSerializer
from rest_framework.pagination import PageNumberPagination
from server.utils.permissions.permission import CustomIsAuthenticated
from question_management.models import QuestionData


# Create your views here.
class CreateAndListQuestionCategory(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        print(request.data)
        # Create a new question category
        try:
            category_name = request.data.get("categoryName")
            validate_question_category_name(category_name)
            validate_unique_name(category_name)
            category = QuestionCategory(question_category_name=category_name)

            # Save the instance to the database
            category.save()

            # Prepare response data
            response_data = {
                "id": category.id,
                "question_category_name": category.question_category_name,
                "status": category.status,
                "created_at": category.created_at,
                "updated_at": category.updated_at,
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # List all question categories
        try:
            
                search_term = request.query_params.get("search")
                if search_term:
                    categories = QuestionCategory.objects.filter(
                        question_category_name__icontains=search_term,
                        status=True
                    )
                else:
                    categories = QuestionCategory.objects.filter(status=True)

            
                serializer = QuestionCategoryManagementSerializer(
                    categories, many=True
                )

                # Return the  response
                return Response(serializer.data,status=status.HTTP_200_OK)

        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
       
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


class EditAndDeleteQuestionCategoryDetails(APIView):

    authentication_classes = (CustomIsAuthenticated,)

    def put(self, request, pk):
        try:
            questions_category_id = pk
            category_name = request.data.get("categoryName")
            validate_question_category_name(category_name)
            category = QuestionCategory.objects.get(id=questions_category_id,status=True)
            if category.question_category_name != category_name:
                validate_unique_name(category_name)
            category.question_category_name = category_name
            category.save()
            response_data = {
                "id": category.id,
                "question_category_name": category.question_category_name,
                "status": category.status,
                "created_at": category.created_at,
                "updated_at": category.updated_at,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            questions_category_id = pk
            category = QuestionCategory.objects.get(id=questions_category_id)
            question = QuestionData.objects.filter(question_category_id=pk,status=True).first()
            if question:
                return Response(error_code_e1124(), status=status.HTTP_400_BAD_REQUEST)

            if category.status == True:
                category.status = False
                category.save()
                response_data = {
                    "id": category.id,
                    "question_category_name": category.question_category_name,
                    "status": category.status,
                    "created_at": category.created_at,
                    "updated_at": category.updated_at,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(error_code_e1008(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)
        
    def get(self,request,pk):
        try:
            questions_category_id = pk
            category = QuestionCategory.objects.get(id=questions_category_id,status=True)
            serializer = QuestionCategoryManagementSerializer(category)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)
