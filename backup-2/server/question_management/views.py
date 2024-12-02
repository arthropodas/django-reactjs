from django.db import transaction
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from .models import QuestionData, Options, QuestionImage
from server.utils.permissions.permission import CustomIsAuthenticated
import json
from django.conf import settings
from decouple import config
from .validator.validations import (
    validate_input_question,
    validate_question_type,
    validate_question_category,
    validate_question_category_type,
    validate_correct_answer,
    validate_options,
    validate_question_image,
    validate_question_difficulty_level,
    validate_csv_file,
    validate_csv_headers,
    extract_csv_content,
    validate_duplicate_question,
    validate_difficulty_level,
    validate_question_type_field,
    validate_questionanire,
    validate_multiple_answer_option_question,
)
from question_category_management.models import QuestionCategory
from questionnaire_management.models import (
    Questionnaire,
    # QuestionnaireCategories,
    QuestionnaireQuestions,
)
from server.utils.messages.error_messages import (
    error_code_e3006,
    error_code_e3007,
    error_code_e3008,
    error_code_e3011,
    error_code_e3101,
    error_code_e3103,
    error_code_e4210,
    error_code_e4204,
    error_code_e4500,
)


# Add new question


class QuestionCreateListView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):

        question = request.data.get("question")
        category_id = request.data.get("category_id")
        options = request.data.get("options")
        question_type = request.data.get("question_type")
        correct_answer = request.data.get("correct_answer")
        question_difficulty_level = request.data.get("difficulty_level")
        question_image = request.FILES.get("question_image")

        try:
            validate_input_question(question)
            question_type = validate_question_type(question_type)
            validate_question_category(category_id)
            category_id = validate_question_category_type(category_id)

            validate_options(options, question_type)
            validate_correct_answer(correct_answer, question_type)

            validate_multiple_answer_option_question(
                question_type, options, correct_answer
            )
            validate_question_difficulty_level(question_difficulty_level)
            if question_image:
                validate_question_image(question_image)

            question_category_instance = QuestionCategory.objects.get(
                id=category_id, status=1
            )

            question_exist = QuestionData.objects.filter(
                question=question,
                question_category_id=question_category_instance,
                status=1,
            )
            if question_exist:
                return Response(error_code_e3006(), status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():

                question_instance = QuestionData.objects.create(
                    question=question,
                    question_category_id=question_category_instance,
                    question_type=question_type,
                    question_difficulty_level=question_difficulty_level,
                )
                if question_instance:
                    options = json.loads(options)
                    answer = json.loads(correct_answer)
                    create_options_correct_answers(options, answer, question_instance)
                    if question_image:
                        QuestionImage.objects.create(
                            question_image=question_image, question_id=question_instance
                        )
                question_added_response = {
                    "question_id": question_instance.id,
                    "question": question_instance.question,
                    "category_id": question_instance.question_category_id_id,
                }
                return Response(
                    {
                        "message": "Question added successfully",
                        "data": question_added_response,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        except QuestionCategory.DoesNotExist:
            return Response(error_code_e3103(), status=status.HTTP_400_BAD_REQUEST)

        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)

    # List question details

    def get(self, request):

        category_id = request.GET.get("category_id")
        if category_id:
            return self.question_by_category(category_id, request)
        else:
            return self.get_question_details(request)

    # List all questions

    def get_question_details(self, request):
        search_term = request.query_params.get('searchTerm')
        questions = []

        question_data = QuestionData.objects.filter(status=1).order_by("-created_at")

    # If a search term is provided, filter the questions based on it
        if search_term:
            question_data = question_data.filter(question__icontains=search_term)

        for question in question_data:
            category_data = QuestionCategory.objects.get(
                id=question.question_category_id_id
            )
            if category_data.status == 0:
                continue
            options_data = Options.objects.filter(question_id_id=question.id, status=1)
            options = self.option_type_checking(options_data)

            correct_answer_instance = Options.objects.filter(
                question_id_id=question.id, status=1, is_correct=1
            )

            correct_answer = self.correct_answer_type_checking(correct_answer_instance)
            question_image = QuestionImage.objects.filter(
                question_id=question.id, status=1
            ).first()

            image_url = None
            if question_image and question_image.question_image:
                image_url = (
                    f"{settings.BACKEND_BASE_URL}{question_image.question_image.url}"
                )

            question_info = self.get_question_info(
                question, category_data, options, correct_answer, image_url
            )

            questions.append(question_info)

        return self.paginate_question_details(questions, request)

    def get_question_info(
        self, question, category_data, options, correct_answer, question_image
    ):

        question_info = {
            "question_id": question.id,
            "question": question.question,
            "question_type": question.question_type,
            "question_difficulty_level": question.question_difficulty_level,
            "category_name": category_data.question_category_name,
            "category_id": category_data.id,
            "options": options,
            "correct_answer": correct_answer,
            "question_image": question_image,
            "created_at": question.created_at,
        }
        return question_info

    # List questions category wise

    def question_by_category(self, category_id, request):

        questions = []

        try:

            category_data = QuestionCategory.objects.get(id=category_id, status=1)
            question_data = QuestionData.objects.filter(
                question_category_id=category_data, status=1
            ).order_by("-created_at")
            if not question_data.exists():
                return self.paginate_question_details(question_data, request)
            for question in question_data:
                options_data = Options.objects.filter(question_id=question.id, status=1)
                options = self.option_type_checking(options_data)
                correct_answer_instance = Options.objects.filter(
                    question_id=question.id, status=1, is_correct=1
                )
                question_image = QuestionImage.objects.filter(
                    question_id=question.id, status=1
                ).first()

                image_url = None
                if question_image:
                    image_url = f"{settings.BACKEND_BASE_URL}{question_image.question_image.url}"

                correct_answer = self.correct_answer_type_checking(
                    correct_answer_instance
                )
                question_info = self.get_question_info(
                    question, category_data, options, correct_answer, image_url
                )

                questions.append(question_info)

            return self.paginate_question_details(questions, request)

        except QuestionCategory.DoesNotExist:
            return Response(error_code_e3103(), status=status.HTTP_400_BAD_REQUEST)

    # paginate the question details

    def paginate_question_details(self, data, request):

        paginator = PageNumberPagination()
        paginator.page_size = config("ADMIN_DATA_PER_PAGE_PAGINATION")
        result_page = paginator.paginate_queryset(data, request)

        print("result page", result_page)

        response_data = {
            "count": paginator.page.paginator.count,
            "num_pages": paginator.page.paginator.num_pages,
            "current_page": paginator.page.number,
            "next_page": paginator.get_next_link(),
            "previous_page": paginator.get_previous_link(),
            "results": result_page,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def option_type_checking(self, options_data):

        options = [
            (
                int(option.option)
                if isinstance(option.option, str) and option.option.isdigit()
                else option.option
            )
            for option in options_data
        ]
        return options

    def correct_answer_type_checking(self, correct_answer_instance):

        correct_answer = [
            (
                int(answer.option)
                if isinstance(answer.option, str) and answer.option.isdigit()
                else answer.option
            )
            for answer in correct_answer_instance
        ]

        return correct_answer


# Delete question
class QuestionDeleteUpdateView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def delete(self, request, question_id):

        try:

            question_data = QuestionData.objects.get(id=question_id)

            question_paper = QuestionnaireQuestions.objects.filter(
                question_id=question_data
            )
            print("question paper", question_paper)
            if question_paper.exists():
                return Response(error_code_e3011(), status=status.HTTP_400_BAD_REQUEST)

            if question_data.status == 0:
                return Response(error_code_e3007(), status=status.HTTP_400_BAD_REQUEST)
            question_data.status = 0
            question_data.save()
            question_deleted_response = {
                "id": question_data.id,
                "question": question_data.question,
            }
            return Response(
                {
                    "message": "Question deleted successfully",
                    "data": question_deleted_response,
                },
                status=status.HTTP_200_OK,
            )
        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)

    # update question

    def put(self, request, question_id):

        question = request.data.get("question")
        question_type = request.data.get("question_type")
        category_id = request.data.get("category_id")
        options = request.data.get("options")
        correct_answer = request.data.get("correct_answer")
        question_difficulty_level = request.data.get("difficulty_level")
        question_image = request.FILES.get("question_image")

        try:
            with transaction.atomic():
                question_data = QuestionData.objects.get(id=question_id, status=1)

                validate_input_question(question)
                question_data.question = question

                question_type = validate_question_type(question_type)
                question_data.question_type = question_type

                self.update_question_category(category_id, question_data)

                validate_question_difficulty_level(question_difficulty_level)
                question_data.question_difficulty_level = question_difficulty_level

                validate_multiple_answer_option_question(
                    question_type, options, correct_answer
                )

                validate_options(options, question_type)
                validate_correct_answer(correct_answer, question_type)

                option_updated = self.update_options_answer(
                    options, correct_answer, question_data
                )

                if question_image:
                    validate_question_image(question_image)
                    question_image_instance = QuestionImage.objects.filter(
                        question_id=question_data
                    )
                    if question_image_instance.exists():
                        question_image_instance = question_image_instance.first()
                        question_image_instance.question_image = question_image
                        question_image_instance.save()
                    else:
                        question_image_instance = QuestionImage.objects.create(
                            question_image=question_image, question_id=question_data
                        )

                question_data.save()

                return self.generate_response(question_data, option_updated)

        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)

    # update category details

    def update_question_category(self, category_id, question_data):
        validate_question_category(category_id)
        category_id = validate_question_category_type(category_id)
        question_category_instance = QuestionCategory.objects.get(
            id=category_id, status=1
        )
        question_data.question_category_id = question_category_instance

    # update options and answers

    def update_options_answer(self, options, correct_answer, question_data):
        options = json.loads(options)
        correct_answer = json.loads(correct_answer)

        options_correct_instance = Options.objects.filter(question_id=question_data)
        existing_options = list(
            options_correct_instance.values_list("option", flat=True)
        )

        option_updated = False

        # Update existing options and their correctness
        updated = self.update_existing_options(
            options, correct_answer, options_correct_instance
        )
        if updated:
            option_updated = True

        # Update remaining options to not correct
        updated = self.reset_remaining_options(
            len(options), existing_options, options_correct_instance
        )
        if updated:
            option_updated = True

        return option_updated

    def update_existing_options(
        self, options, correct_answer, options_correct_instance
    ):
        updated = False
        for i, new_option in enumerate(options):
            if i < len(options_correct_instance):
                existing_option = options_correct_instance[i]
                is_correct = 1 if new_option in correct_answer else 0
                if (
                    existing_option.option != new_option
                    or existing_option.is_correct != is_correct
                ):
                    existing_option.option = new_option
                    existing_option.is_correct = is_correct
                    existing_option.save()
                    updated = True
        return updated

    def reset_remaining_options(
        self, new_options_count, existing_options, options_correct_instance
    ):
        updated = False
        for i in range(new_options_count, len(existing_options)):
            existing_option = options_correct_instance[i]
            if existing_option.is_correct != 0:
                existing_option.is_correct = 0
                existing_option.save()
                updated = True
        return updated

    def generate_response(self, question_data, option_updated):
        return Response(
            {
                "message": "Question updated successfully",
                "option_answer_updated": (
                    "updated successfully" if option_updated else "Not updated"
                ),
                "data": {
                    "question_id": question_data.id,
                    "question": question_data.question,
                    "category_id": question_data.question_category_id_id,
                },
            },
            status=status.HTTP_200_OK,
        )

    # List questions by id

    def get(self, request, question_id):

        try:
            question_data = QuestionData.objects.get(id=question_id, status=1)
            print("question", question_data.question_category_id.question_category_name)

            options_data = Options.objects.filter(
                question_id_id=question_data.id, status=1, is_correct=0
            )
            options = [option.option for option in options_data]

            options = [
                (
                    int(option.option)
                    if isinstance(option.option, str) and option.option.isdigit()
                    else option.option
                )
                for option in options_data
            ]

            correct_answer_instance = Options.objects.filter(
                question_id_id=question_data.id, status=1, is_correct=1
            )

            correct_answer = [
                (
                    int(answer.option)
                    if isinstance(answer.option, str) and answer.option.isdigit()
                    else answer.option
                )
                for answer in correct_answer_instance
            ]
            image_url = None
            question_image = QuestionImage.objects.filter(
                question_id=question_data.id
            ).first()

            if question_image and question_image.question_image:
                image_url = request.build_absolute_uri(
                    question_image.question_image.url
                )

            question_response_data = {
                "question_id": question_data.id,
                "question": question_data.question,
                "question_type": question_data.question_type,
                "question_difficulty_level": question_data.question_difficulty_level,
                "category_name": question_data.question_category_id.question_category_name,
                "category_id": question_data.question_category_id.id,
                "options": options,
                "correct_answer": correct_answer,
                "question_image": image_url,
                "created_at": question_data.created_at,
            }

            return Response(question_response_data, status=status.HTTP_200_OK)

        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)


class QuestionCSVUploadView(APIView):

    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        questionnaire_name = request.data.get("questionnaireName")
        question_csv = request.FILES.get("csvFileUpload")

        try:

            validate_csv_file(question_csv)
            data, headers = extract_csv_content(question_csv)
            validate_csv_headers(headers)

            data = self.validate_csv_data(data)
            if questionnaire_name is None:
                self.process_question(data)
                success_msg = "CSV file added successfully"

            else:
                validate_questionanire(questionnaire_name)
                self.process_csv_questionnaire_data(data, questionnaire_name)
                success_msg = "CSV file and questionnaire created successfully"
            return Response({"msg": success_msg}, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response(error_code_e4500(), status=status.HTTP_400_BAD_REQUEST)

    def process_csv_questionnaire_data(self, data, questionnaire_name):

        with transaction.atomic():

            questionnaire_instance = Questionnaire.objects.filter(
                questionnaire_name=questionnaire_name, status=1
            )
            if questionnaire_instance.exists():
                raise ValidationError(error_code_e4210())

            questionnaire_instance = Questionnaire.objects.create(
                questionnaire_name=questionnaire_name
            )

            self.process_question(data)
            for question_data in data:
                question_instance = QuestionData.objects.get(
                    question=question_data["question"], status=1
                )

                QuestionnaireQuestions.objects.create(
                    questionnaire=questionnaire_instance,
                    question=question_instance,
                )

    def validate_csv_data(self, data):
        error_messages = {
            "errorCode": "e4300",
            "errorMsg": {
                "errors": {},
                "invalidCount": 0,
            },
        }
        seen_questions = []
        valid_data = []
        invalid_count = 0

        if len(data) == 0:
            raise ValidationError(error_code_e4204())

        for index, row in enumerate(data):
            question, question_type, category_name, difficulty_level = map(
                str.strip, row[:4]
            )
            options = [str.strip(option) for option in row[4:8]]
            answers = [str.strip(answer) for answer in row[8:12] if answer]

            answer_json = json.dumps(answers)
            options_json = json.dumps([option for option in options if option])
            row_errors, category_id, question_type_value, difficulty_level_id = (
                self.validate_row(
                    question,
                    question_type,
                    category_name,
                    difficulty_level,
                    options_json,
                    answer_json,
                    seen_questions,
                )
            )

            if row_errors:
                invalid_count += 1
                error_messages["errorMsg"]["errors"][index + 2] = row_errors

            else:

                valid_data.append(
                    {
                        "question": question,
                        "category_id": category_id,
                        "difficulty_level_id": difficulty_level_id,
                        "question_type_value": question_type_value,
                        "options": options,
                        "answers": answers,
                    }
                )
        error_messages["errorMsg"]["invalidCount"] = invalid_count
        if error_messages["errorMsg"]["errors"]:
            raise ValidationError(error_messages)
        else:
            return valid_data

    def validate_row(
        self,
        question,
        question_type,
        category_name,
        difficulty_level,
        options_json,
        answer_json,
        seen_questions,
    ):
        row_errors = {}
        category_id = question_type_value = difficulty_level_id = None

        try:
            question = validate_input_question(question)

        except ValidationError as e:
            row_errors["question"] = e.detail

        try:
            question_type_value = validate_question_type_field(question_type)
        except ValidationError as e:
            row_errors["question_type"] = e.detail
        try:
            category_id = self.validate_category_instance(category_name)

        except ValidationError as e:
            row_errors["category_id"] = e.detail
        try:
            difficulty_level_id = validate_difficulty_level(difficulty_level)
        except ValidationError as e:
            row_errors["difficulty_level"] = e.detail
        try:
            validate_options(options_json, question_type_value)
        except ValidationError as e:
            row_errors["options"] = e.detail

        try:
            validate_correct_answer(answer_json, question_type_value)
        except ValidationError as e:
            row_errors["correct_answer"] = e.detail

        try:
            validate_multiple_answer_option_question(
                question_type_value, options_json, answer_json
            )
        except ValidationError as e:
            row_errors["multiple_answer"] = e.detail

        try:
            validate_duplicate_question(question, seen_questions)
        except ValidationError as e:
            row_errors["duplicate_question"] = e.detail

        try:
            question_category_instance = self.get_question_category(category_id)
            self.check_existing_question(
                question,
                question_category_instance,
                question_type_value,
            )
        except ValidationError as e:
            if e.detail["errorCode"] == "e3006":
                row_errors["question"] = e.detail

        return row_errors, category_id, question_type_value, difficulty_level_id

    def get_question_category(self, category_id):

        try:
            return QuestionCategory.objects.get(id=category_id, status=1)
        except QuestionCategory.DoesNotExist:
            raise ValidationError(error_code_e3103())

    def check_existing_question(self, question, category_instance, question_type_value):
        existing_question = QuestionData.objects.filter(
            question=question,
            question_category_id=category_instance,
            question_type=question_type_value,
            status=1,
        ).first()
        if existing_question:
            raise ValidationError(error_code_e3006())

    # validate category instance from db

    def validate_category_instance(self, category_name):
        if not category_name:
            raise ValidationError(error_code_e3101())
        try:
            category_instance = QuestionCategory.objects.get(
                question_category_name=category_name, status=1
            )
            return category_instance.id
        except QuestionCategory.DoesNotExist:
            raise ValidationError(
                {
                    "errorCode": "e3103",
                    "errorMsg": f"Category '{category_name}' not found.",
                }
            )

    def process_question(self, valid_data):
        error_messages = {"errorCode": "e4300", "errorMsg": {"errors": {}}}

        for index, data in enumerate(valid_data):

            try:
                with transaction.atomic():
                    question_category_instance = self.get_question_category(
                        data["category_id"]
                    )

                    created_question = QuestionData.objects.create(
                        question=data["question"],
                        question_category_id=question_category_instance,
                        question_type=data["question_type_value"],
                        question_difficulty_level=data["difficulty_level_id"],
                    )

                    create_options_correct_answers(
                        data["options"], data["answers"], created_question
                    )

            except ValidationError as e:

                error_messages["errorMsg"]["errors"][index + 2] = e.detail
                return Response(error_messages, status=status.HTTP_400_BAD_REQUEST)


def create_options_correct_answers(options, correct_answers, question_instance):
    filtered_options = [option for option in options if option]
    filtered_correct_answers = [answer for answer in correct_answers if answer]
    for option in filtered_options:

        if option not in correct_answers:
            Options.objects.create(
                question_id=question_instance, option=option, is_correct=False
            )

    for answer in filtered_correct_answers:

        if answer in options:
            Options.objects.create(
                question_id=question_instance, option=answer, is_correct=True
            )
