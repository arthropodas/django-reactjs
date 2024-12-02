from django.shortcuts import render
from rest_framework.views import APIView
from .models import Questionnaire
from question_category_management.models import QuestionCategory
from rest_framework import status
from django.db.models import Count
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ParseError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Questionnaire
from exam_management.models import Exam
from .serializers import QuestionnaireSerializer
from server.utils.messages.error_messages import (
    error_code_e408,
    error_code_e2238,
    error_code_e2239,
    error_code_e3008,
)
from .validators import (
    validate_questionnaire_name,
    validate_question_category,
    validate_questions,
    validate_exam_categories_array,
    validate_question_array,
    validate_question_id,
    validate_questionnaire_id,
    validate_is_assigned,
)
from question_management.models import QuestionData, Options
from server.utils.util_functions.functions import remove_square_brackets
from rest_framework.pagination import PageNumberPagination
from server.utils.permissions.permission import CustomIsAuthenticated
from .serializers import QuestionnaireSerializer
from .models import Questionnaire, QuestionnaireQuestions
from question_management.models import QuestionImage


def get_question_with_options_and_answers(question, request):

    question_type = question.question_type
    options_data = []
    question_image = QuestionImage.objects.filter(question_id_id=question.id)
    question_image_url = None
    if len(question_image) > 0:
        question_image_url = question_image[0].question_image.url

    if question_type == 0:
        try:
            options = Options.objects.filter(
                question_id=question.id, status=True, is_correct=0
            ).order_by("?")[:3]
            correct_answer = Options.objects.get(
                question_id=question.id, status=True, is_correct=1
            )

            print("correct answer", correct_answer)
            options_data = [
                {
                    "id": option.id,
                    "value": option.option,
                    "isCorrect": (option.id == correct_answer.id),
                }
                for option in options
            ]
            if correct_answer.id not in [option["id"] for option in options_data]:

                options_data.append(
                    {
                        "id": correct_answer.id,
                        "value": correct_answer.option,
                        "isCorrect": True,
                    }
                )
        except Options.DoesNotExist:
            raise ValidationError(error_code_e2238(question.id))

    elif question_type == 1:  # True or False (Single Option)
        options = Options.objects.filter(
            question_id=question.id, status=True, is_correct=0
        ).order_by("?")[:1]
        correct_answer = Options.objects.get(
            question_id=question.id, status=True, is_correct=1
        )

        if options:
            options_data.append(
                {
                    "id": options[0].id,
                    "value": options[0].option,
                    "isCorrect": (options[0].id == correct_answer.id),
                }
            )

            if options[0].id != correct_answer.id:
                options_data.append(
                    {
                        "id": correct_answer.id,
                        "value": correct_answer.option,
                        "isCorrect": True,
                    }
                )

    elif question_type == 2:
        correct_answers_list = Options.objects.filter(
            question_id=question.id, status=True, is_correct=1
        )
        correct_answers = [
            {"id": answer.id, "value": answer.option, "isCorrect": True}
            for answer in correct_answers_list
        ]

        options_data.extend(correct_answers)
        additional_options = (
            Options.objects.filter(question_id=question.id, status=True, is_correct=0)
            .exclude(id__in=[answer.id for answer in correct_answers_list])
            .order_by("?")[: (4 - len(correct_answers))]
        )
        options_data.extend(
            [
                {"id": option.id, "value": option.option, "isCorrect": False}
                for option in additional_options
            ]
        )
    return {
        "id": question.id,
        "value": question.question,
        "type": question.question_type,
        "questionImage": (
            request.build_absolute_uri(question_image_url)
            if question_image_url is not None
            else None
        ),
        "options": (options_data),
    }


def create_questionnaire(request, questionnaire_id=None):
    # Get the questionnaire name from the request
    questionnaire_name = request.data.get("questionnaireName")

    # Validate the questionnaire name only if it's being created or provided for editing
    if questionnaire_id is None:
        # Validate for creation
        validated_name = validate_questionnaire_name(questionnaire_name, questionnaire_id)
    else:
        # When editing, the name can be optional; ensure it's valid if provided
        if questionnaire_name is not None:
            validated_name = validate_questionnaire_name(questionnaire_name, questionnaire_id)
        else:
            # If the name is not provided, fetch the existing questionnaire to keep the name
            existing_questionnaire = Questionnaire.objects.get(id=questionnaire_id)
            validated_name = existing_questionnaire.questionnaire_name

    # Initialize question data array and category count
    question_data_array = []
    category_count = {}

    # Only validate question array if creating a new questionnaire
    if questionnaire_id is None:
        # Get and validate the question array
        question_array = request.data.get("questionArray")
        validate_question_array(question_array)

        # Validate each question ID and collect question data
        for index, question_id in enumerate(question_array):
            question_data = validate_question_id(question_id, index)
            question_data_array.append(question_data)

        print("This is creating a new questionnaire.")
        # Create a new Questionnaire object
        questionnaire = Questionnaire.objects.create(
            questionnaire_name=validated_name
        )
    else:
        print("This is editing an existing questionnaire.")
        

        # Get the existing questionnaire
        questionnaire = Questionnaire.objects.get(id=questionnaire_id)
        questionnaire.questionnaire_name = validated_name
        questionnaire.save()

        # Optionally handle the question data
        question_array = request.data.get("questionArray")
        
        if question_array:
            validate_is_assigned(questionnaire_id)
            # Validate question array for editing if provided
            validate_question_array(question_array)

            # Clear existing questions for this questionnaire
            QuestionnaireQuestions.objects.filter(
                questionnaire_id=questionnaire_id
            ).delete()

            # Validate each question ID and collect question data
            for index, question_id in enumerate(question_array):
                question_data = validate_question_id(question_id, index)
                question_data_array.append(question_data)

    # Process each question and prepare to save
    for question in question_data_array:
        category = question.question_category_id

        if category.id in category_count:
            category_count[category.id]["count"] += 1
        else:
            category_count[category.id] = {
                "category": category,
                "count": 1,
            }

        # Create a new QuestionnaireQuestions object
        questionnaire_question = QuestionnaireQuestions(
            questionnaire=questionnaire, question=question
        )

        # Save the QuestionnaireQuestions object to the database
        questionnaire_question.save()

    return questionnaire


class CreateListQuestionnaireView(APIView):
    pagination_class = PageNumberPagination
    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        try:
            questionnaire = create_questionnaire(
                request,
            )

            questionnaire_details = {
                "id": questionnaire.id,
                "questionnaireName": questionnaire.questionnaire_name,
            }

            return Response(
                {"questionnaire": questionnaire_details},
                status=status.HTTP_200_OK,
            )
        except ParseError:
            return Response(error_code_e408(), status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        search_term = request.query_params.get("searchTerm", "")
        year = request.query_params.get("year")
        questionnaires = (
            Questionnaire.objects.filter(
                status=True, questionnaire_name__icontains=search_term
            )
            .annotate(num_questions=Count("questions"))
            .order_by("-created_at")
        )
        
        if year:
            year_converted = int(year)
            questionnaires = questionnaires.filter(created_at__year=year_converted)
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(questionnaires, request)
        serializer = QuestionnaireSerializer(result_page, many=True)

        return paginator.get_paginated_response(
            serializer.data
        )  # Make sure to use the correct key


class QuestionnaireDetailsView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, pk):
        try:         
            questionnaire = validate_questionnaire_id(pk)
            questionnaire_questions = QuestionnaireQuestions.objects.filter(
                questionnaire_id=questionnaire
            )
            data = {"preview": []}
            category_dict = {}

            for q in questionnaire_questions:
                question_data = QuestionData.objects.get(id=q.question_id)
                category_id = question_data.question_category_id.id
                category_name = (
                    question_data.question_category_id.question_category_name
                )  # Directly accessing the name

                question_details = get_question_with_options_and_answers(
                    question_data, request
                )

                if category_id not in category_dict:
                    category_dict[category_id] = {
                        "category": category_name,
                        "categoryId": category_id,
                        "levels": {},
                    }

                level_name = question_data.get_question_difficulty_level_display()
                if level_name not in category_dict[category_id]["levels"]:
                    category_dict[category_id]["levels"][level_name] = {
                        "level": question_data.question_difficulty_level,
                        "questions": [],
                    }

                category_dict[category_id]["levels"][level_name]["questions"].append(
                    question_details
                )
            for category in category_dict.values():
                category["levels"] = list(category["levels"].values())
            is_assigned = False
            exam = Exam.objects.filter(questionnaire_id=pk)
            
            if exam.exists():
                is_assigned=True
            data["isAssigned"] = is_assigned
            data["preview"] = list(category_dict.values())
            return Response(data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except QuestionData.DoesNotExist as e:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def preview_questionnaire(request):

    # validate_questionnaire_name(questionnaire_name,mode)
    exam_categories = request.data.get("examCategories")
    validate_exam_categories_array(exam_categories)
    seen_combinations = set()
    preview_question_paper = []
    exam_categories_index = 0
    for category_data in exam_categories:
        category_id = category_data.get("questionCategoryId")
        level = category_data.get("level")
        no_of_questions = category_data.get("noOfQuestions")
        question_category = validate_question_category(
            category_id, exam_categories_index
        )
        combination = (category_id, level)
        if combination in seen_combinations:
            raise ValidationError(error_code_e2239(category_id, level))
        seen_combinations.add(combination)
        questions = validate_questions(category_id, level, no_of_questions)
        question_data = [
            get_question_with_options_and_answers(question, request)
            for question in questions
        ]
        preview_question_paper.append(
            {
                "category": question_category.question_category_name,
                "categoryId": question_category.id,
                "levels": [{"level": level, "questions": question_data}],
            }
        )
        exam_categories_index = exam_categories_index + 1
    return preview_question_paper


class PreviewQuestionnaireView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        try:
            preview_question_paper = preview_questionnaire(request=request)
            return Response(
                {"preview": preview_question_paper}, status=status.HTTP_200_OK
            )
        except ParseError:
            return Response(error_code_e408(), status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class QuestionnaireGetEditDeleteView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, pk):
        try:
            # Validate the questionnaire ID and fetch the associated questions
            questionnaire = validate_questionnaire_id(pk)
            questionnaire_questions = QuestionnaireQuestions.objects.filter(
                questionnaire=questionnaire
            )

            # Initialize the response structure
            response_data = {
                "questionnaireName": questionnaire.questionnaire_name,
                "examCategories": [],
            }

            category_level_count = {}

            # Iterate through all the questionnaire questions
            for questionnaire_question in questionnaire_questions:
                question = questionnaire_question.question
                question_category_id = question.question_category_id.id
                level = question.question_difficulty_level

                # If the category is not in the dictionary, add it with empty levels
                if question_category_id not in category_level_count:
                    
                    category_level_count[question_category_id] = {
                        "questionCategoryId": question_category_id,
                        "questionCategoryName": question.question_category_id.question_category_name,
                        "questionCount": 0,  # Total number of questions in the category
                        "levels": {
                            "1": {"noOfQuestions": 0},
                            "2": {"noOfQuestions": 0},
                            "3": {"noOfQuestions": 0},
                        },
                    }

                category_level_count[question_category_id]["levels"][str(level)][
                    "noOfQuestions"
                ] += 1

            response_data["examCategories"] = list(category_level_count.values())

            return Response(response_data, status=status.HTTP_200_OK)

        except ParseError:
            return Response(error_code_e408(), status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:

            questionnaire = validate_questionnaire_id(pk)
           
            questionnaire = create_questionnaire(request, questionnaire_id=pk)
            questionnaire_details = {
                "id": questionnaire.id,
                "questionnaireName": questionnaire.questionnaire_name,
            }

            return Response(
                {"questionnaire": questionnaire_details},
                status=status.HTTP_200_OK,
            )
        except ParseError:
            return Response(error_code_e408(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            questionnaire = validate_questionnaire_id(pk)
            validate_is_assigned(questionnaire.id)
            questionnaire.status = 0
            questionnaire.save()
            return Response(
                {"message": "Questionnaire deleted successfully!"},
                status=status.HTTP_200_OK,
            )
        except ParseError:
            return Response(error_code_e408(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
