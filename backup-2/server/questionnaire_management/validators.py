from django.core.exceptions import ValidationError
from server.utils.messages.error_messages import (error_code_e2070, error_code_e2071, error_code_e2200, error_code_e2201, error_code_e2202, error_code_e2203,error_code_e2204,error_code_e2205, error_code_e2206,
                                                error_code_e2207,error_code_e2208,error_code_e2209,error_code_e2209, error_code_e2210, error_code_e2211, error_code_e2212, error_code_e2213,error_code_e2214,error_code_e2216,error_code_e2217,
                                                error_code_e2218,error_code_e2219,error_code_e2220,error_code_e2221,error_code_e2222,error_code_e2223,error_code_e2225,error_code_e2226,error_code_e2227,error_code_e2229, error_code_e2240,error_code_e3008)
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData
from .models import Questionnaire, QuestionCategory
from exam_management.models import Exam
from re import match

NAME_REGEX = '^[a-zA-Z0-9\s]+$'

def validate_questionnaire_name(questionnaire_name, questionnaire_id):
    # If questionnaire_id is present, questionnaire_name is not required
    if questionnaire_id is None and (not questionnaire_name or questionnaire_name.strip() == ""):
        raise ValidationError(error_code_e2201())
    
    if questionnaire_name is not None:
        if not isinstance(questionnaire_name, str):
            raise ValidationError(error_code_e2200())
        name = questionnaire_name.strip()
        
        if not match(NAME_REGEX, questionnaire_name):
            raise ValidationError(error_code_e2200())
            
        if len(name) > 200:
            raise ValidationError(error_code_e2202())
        if len(name) < 3:
            raise ValidationError(error_code_e2203())
        
        # Check for existing questionnaire names when creating a new one
        if questionnaire_id is None:
            if Questionnaire.objects.filter(questionnaire_name=name, status=1).exists():
                raise ValidationError(error_code_e2229())
        else:
            # Check for existing questionnaire names when editing
            if Questionnaire.objects.exclude(id=questionnaire_id).filter(questionnaire_name=name, status=1).exists():
                raise ValidationError(error_code_e2229())
    
    return name.strip() if questionnaire_name else None

    
    
    
    
def validate_question_category(category_id, index):
    try:
        # Validate if category_id is empty
        if category_id == "" or category_id is None:
            raise ValidationError(error_code_e2205(index))

        # Validate if category_id is an integer
        if not isinstance(category_id, int):
            raise ValidationError(error_code_e2216(index))

        # Attempt to retrieve the QuestionCategory object
        question_category = QuestionCategory.objects.get(id=category_id, status=1)
        print("Question Category:", question_category)
        return question_category

    except QuestionCategory.DoesNotExist:
        # Handle case where the QuestionCategory doesn't exist
        raise ValidationError(error_code_e2204(index))

    

def validate_exam_categories_array(category_array):
    if category_array is None or category_array == "":
        raise ValidationError(error_code_e2206())
    if not isinstance(category_array,list):
        raise ValidationError(error_code_e2207())
        

def validate_levels_array(levels, category_id):
    if levels is None or levels == "":
        raise ValidationError(error_code_e2208(category_id))
    if not isinstance(levels,list):
        raise ValidationError(error_code_e2209(category_id))
    if len(levels) ==0:
        raise ValidationError(error_code_e2210(category_id))
    
def validate_level_questions(levels, category_id,):
    if levels is None or levels == "":
        raise ValidationError(error_code_e2208(category_id))
    if not isinstance(levels,list):
        raise ValidationError(error_code_e2209(category_id))
    if len(levels) ==0:
        raise ValidationError(error_code_e2210(category_id))

def validate_questions(category_id, level, no_of_questions):
    print("insidethe validate questions")
    try:
        if level is None or level == "":
            raise ValidationError(error_code_e2211(category_id))
        if not isinstance(level, int) :
            raise ValidationError(error_code_e2212(category_id))
        if level < 0 or level >3:
            raise ValidationError(error_code_e2212(category_id))
        if no_of_questions is None or no_of_questions == "":
            raise ValidationError(error_code_e2213(category_id, level))
        if not isinstance(no_of_questions, int):
            raise ValidationError(error_code_e2214(category_id, level))
            
        # Fetch questions and shuffle the order
        questions = QuestionData.objects.filter(
            question_category_id_id=category_id,
            status=1,
            question_difficulty_level=level
        ).order_by('?')[:no_of_questions]
        
        if len(questions) < no_of_questions:
            raise ValidationError(error_code_e2217(category_id, level, no_of_questions))
        
        return questions
    except QuestionData.DoesNotExist:
        raise ValidationError({"errorMsg": "Not enough questions available in the category.", "errorCode": "2023"})




def validate_question_array(questions):
    
    if questions is None or questions == "" or len(questions)==0:
        raise ValidationError(error_code_e2221())
    if not isinstance(questions, list):
        raise ValidationError(error_code_e2222())
    if len(questions) != len(set(questions)):
        raise ValidationError(error_code_e2223())


def validate_question_id(question_id, index):
    if question_id is None or question_id == "":
        raise ValidationError(error_code_e2070())
    if not isinstance(question_id, int):
        raise ValidationError(error_code_e2071(index))
    
    try:
        question = QuestionData.objects.get(id=question_id, status=1)
        # category = QuestionCategory.objects.get(id=question.question_category_id)
        return question
    except QuestionData.DoesNotExist:
        raise ValidationError(error_code_e3008())
    

def validate_questionnaire_id(question_id):
    print("question id: ", question_id)
    if question_id is None or question_id == "":
        raise ValidationError(error_code_e2225())
    if not isinstance(question_id, int):
        raise ValidationError(error_code_e2226())
    
    try:
        questionnaire = Questionnaire.objects.get(id=question_id, status=1)
        return questionnaire
    except Questionnaire.DoesNotExist:
        raise ValidationError(error_code_e2227())

def validate_is_assigned(questionnaire_id):
    print("questionnaire id: ", questionnaire_id)
 
    exam = Exam.objects.filter(questionnaire_id=questionnaire_id)
    if exam.exists():
        print("exam existing")
        raise ValidationError(error_code_e2240())
