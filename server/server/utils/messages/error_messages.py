def error_code_e2000():
    return {
        "errorCode": "e2000",
        "errorMsg": "email is required",
    }


def error_code_e2001():
    return {
        "errorCode": "e2001",
        "errorMsg": "password is required",
    }


def error_code_e2002():
    return {
        "errorCode": "e2002",
        "errorMsg": "Invalid email",
    }


def error_code_e2003():
    return {
        "errorCode": "e2003",
        "errorMsg": "Invalid password",
    }


def error_code_e2004():
    return {
        "errorCode": "e2004",
        "errorMsg": "Invalid login credentials",
    }


def error_code_e2010():
    return {
        "errorCode": "e2010",
        "errorMsg": "passwords do not match",
    }


def error_code_e2011():
    return {
        "errorCode": "e2011",
        "errorMsg": "new password is required",
    }


def error_code_e2012():
    return {
        "errorCode": "e2012",
        "errorMsg": "confirm password is required",
    }


def error_code_e2013():
    return {
        "errorCode": "e2013",
        "errorMsg": "Invalid new password",
    }


def error_code_e2014():
    return {
        "errorCode": "e2014",
        "errorMsg": "Invalid confirm password",
    }


def error_code_e2015():
    return {
        "errorCode": "e2015",
        "errorMsg": "user not found",
    }


def error_code_e2016():
    return {
        "errorCode": "e2016",
        "errorMsg": "name is required",
    }


def error_code_e2017():
    return {
        "errorCode": "e2017",
        "errorMsg": "Invalid name",
    }


def error_code_e2018():
    return {
        "errorCode": "e2018",
        "errorMsg": "phone number is required",
    }


def error_code_e2019():
    return {
        "errorCode": "e2019",
        "errorMsg": "Invalid phone number",
    }


def error_code_e2020():
    return {
        "errorCode": "e2020",
        "errorMsg": "passout year is required",
    }


def error_code_e2021():
    return {
        "errorCode": "e2021",
        "errorMsg": "Invalid passout year",
    }


def error_code_e2022():
    return {
        "errorCode": "e2022",
        "errorMsg": "email already exists",
    }


def error_code_e2024():
    return {
        "errorCode": "e2024",
        "errorMsg": "Invalid exam id",
    }


def error_code_e2025():
    return {
        "errorCode": "e2025",
        "errorMsg": "Exam not found",
    }


def error_code_2026():
    return {
        "errorCode": "e2026",
        "errorMsg": "Institution id is required",
    }


def error_code_e2027():
    return {
        "errorCode": "e2027",
        "errorMsg": "Invalid institutionId",
    }


def error_code_e2028():
    return {
        "errorCode": "e2028",
        "errorMsg": "Institution not found",
    }


def error_code_e2029():
    return {
        "errorCode": "e2029",
        "errorMsg": "Student not found",
    }


def error_code_e2030():
    return {
        "errorCode": "e2030",
        "errorMsg": "student id is required",
    }


def error_code_e2031():
    return {
        "errorCode": "e2031",
        "errorMsg": "Invalid studentId",
    }


def error_code_e2032():
    return {
        "errorCode": "e2032",
        "errorMsg": "Invalid page ",
    }


def error_code_e2034():
    return {
        "errorCode": "e2034",
        "errorMsg": "Invalid file format",
    }


def error_code_e2035():
    return {
        "errorCode": "e2035",
        "errorMsg": "csv file is empty",
    }


def error_code_e2036():
    return {
        "errorCode": "e2036",
        "errorMsg": "No columns in the csv file",
    }


def error_code_e2037():
    return {
        "errorCode": "e2037",
        "errorMsg": "The uploaded csv file is improperly formatted",
    }


def error_code_e2038():
    return {
        "errorCode": "e2038",
        "errorMsg": "no more rows found in the csv file",
    }


def error_code_e2039(csv_max_size):
    return {
        "errorCode": "e2039",
        "errorMsg": f"File size exceeds the maximum limit of {csv_max_size} MB.",
    }


def error_code_e2040():
    return {
        "errorCode": "e2040",
        "errorMsg": "name length is too short",
    }


def error_code_e2041():
    return {
        "errorCode": "e2041",
        "errorMsg": "name length is too long",
    }


def error_code_e2042():
    return {
        "errorCode": "e2042",
        "errorMsg": "csv file is required",
    }


def error_code_e2043():
    return {
        "errorCode": "e2043",
        "errorMsg": "exam id is required",
    }


def error_code_e2044(category_id, available_count, required_count):
    return {
        "errorCode": "e2044",
        "errorMsg": "Not enough questions available",
        "categoryId": category_id,
        "requiredCount": required_count,
        "availableCount": available_count,
    }


def error_code_e2045():
    return {
        "errorCode": "e2045",
        "errorMsg": "Question paper already exists",
    }


def error_code_e2046():
    return {
        "errorCode": "e2046",
        "errorMsg": "csv row data is null",
    }


def error_code_e2047():
    return {
        "errorCode": "e2047",
        "errorMsg": "correct answer does not exist",
    }


def error_code_e2048():
    return {
        "errorCode": "e2048",
        "errorMsg": "option does not exist",
    }


def error_code_e2049():
    return {
        "errorCode": "e2049",
        "errorMsg": "Exam time is exceeded",
    }


def error_code_e401():
    return {
        "errorCode": "e401",
        "errorMsg": "access-token is required",
    }


def error_code_e2070():
    return {
        "errorCode": "e2070",
        "errorMsg": "question id is required",
    }


def error_code_e2071(index):
    return {
        "errorCode": "e2071",
        "errorMsg": f"Invalid question id at index : {index}",
    }


def error_code_e2072():
    return {
        "errorCode": "e2072",
        "errorMsg": "student is not added in the exam",
    }


def error_code_e2073():
    return {
        "errorCode": "e2073",
        "errorMsg": "exam is not started yet",
    }


# def error_code_e2074():
#     return {
#         "errorCode": "e2074",
#         "errorMsg": "exam id mismatching in assigned exam",
#     }


def error_code_e2075():
    return {
        "errorCode": "e2075",
        "errorMsg": "exam already completed",
    }


def error_code_e2076():
    return {
        "errorCode": "e2076",
        "errorMsg": "question is not found in the questionnaire",
    }


def error_code_e2077(question_id):
    return {
        "errorCode": "e2077",
        "errorMsg": f"Invalid respond for the question : {question_id}",
    }


def error_code_e2078(question_id):
    return {
        "errorCode": "e2078",
        "errorMsg": f"respond not found for the questionId : {question_id}",
    }


def error_code_e2079():
    return {
        "errorCode": "e2079",
        "errorMsg": "student mark is already stored",
    }


def error_code_e2080():
    return {
        "errorCode": "e2080",
        "errorMsg": "exam date should not be past",
    }


def error_code_e2081():
    return {
        "errorCode": "e2081",
        "errorMsg": "exam time should not be in the past",
    }


def error_code_e2082():
    return {
        "errorCode": "e2082",
        "errorMsg": "valuation failed",
    }


def error_code_e2090(current_year):
    return {
        "errorCode": "e2090",
        "errorMsg": f"passout year should not be earlier than {current_year-1}",
    }


def error_code_e2091(current_year):
    return {
        "errorCode": "e2091",
        "errorMsg": f"passout year should not be future than {current_year+1}",
    }


def error_code_e2092():
    return {
        "errorCode": "e2092",
        "errorMsg": "student already submitted answers",
    }


def error_code_e2093():
    return {
        "errorCode": "e2093",
        "errorMsg": "Response not found",
    }


def error_code_e2094():
    return {
        "errorCode": "e2094",
        "errorMsg": "email is too long",
    }


def error_code_e2200():
    return {
        "errorCode": "e2200",
        "errorMsg": "Invalid questionnaireName",
    }


def error_code_e2201():
    return {
        "errorCode": "e2201",
        "errorMsg": "questionnaireName is required",
    }


def error_code_e2202():
    return {
        "errorCode": "e2202",
        "errorMsg": "questionnaireName is too long",
    }


def error_code_e2203():
    return {
        "errorCode": "e2203",
        "errorMsg": "questionnaireName is too short",
    }


def error_code_e2204(index):
    return {
        "errorCode": "e2204",
        "errorMsg": f"category not found in index : {index} in examCategories array",
    }


def error_code_e2205(index):
    return {
        "errorCode": "e2205",
        "errorMsg": f"categoryId is missing in examCategories array in index : {index}",
    }


def error_code_e2216(index):
    return {
        "errorCode": "e2216",
        "errorMsg": f"Invalid categoryId in index : {index} in examCategories",
    }


def error_code_e2206():
    return {"errorCode": "e2206", "errorMsg": "questionCategories array is required"}


def error_code_e2207():
    return {"errorCode": "e2207", "errorMsg": "Invalid questionCategories array"}


def error_code_e2208(category_id):
    return {
        "errorCode": "e2208",
        "errorMsg": f"levels array is required for categoryId : {category_id}",
    }


def error_code_e2209(category_id):
    return {
        "errorCode": "e2209",
        "errorMsg": f"Invalid levels for categoryId : {category_id}",
    }


def error_code_e2210(category_id):
    return {
        "errorCode": "e2210",
        "errorMsg": f"levels should not be null for categoryId : {category_id}",
    }


def error_code_e2211(category_id):
    return {
        "errorCode": "e2211",
        "errorMsg": f"level is required for the categoryId : {category_id}",
    }


def error_code_e2212(category_id):
    return {
        "errorCode": "e2212",
        "errorMsg": f"Invalid level for the categoryId : {category_id}",
    }


def error_code_e2213(category_id, level):
    return {
        "errorCode": "e2213",
        "errorMsg": f"noOfQuestions is required for the level : {level} for categoryId :{category_id}",
    }


def error_code_e2214(category_id, level):
    return {
        "errorCode": "e2214",
        "errorMsg": f"Invalid noOfQuestions for the level : {level} categoryId :{category_id}",
    }


def error_code_e2217(category_id, level, no_of_questions):
    return {
        "errorCode": "e2217",
        "errorMsg": f" noOfQuestions :{no_of_questions} for the level : {level} categoryId :{category_id} is not available",
    }


def error_code_e2218(category_id):
    return {
        "errorCode": "e2218",
        "errorMsg": f"score is required for the categoryId :{category_id}",
    }


def error_code_e2219(category_id):
    return {
        "errorCode": "e2219",
        "errorMsg": f"Invalid score for the categoryId :{category_id}",
    }


def error_code_e2220(category_id):
    return {
        "errorCode": "e2219",
        "errorMsg": f"score is too high for the categoryId :{category_id}",
    }


def error_code_e2221():
    return {"errorCode": "e2221", "errorMsg": "questionsArray is required"}


def error_code_e2222():
    return {"errorCode": "e2222", "errorMsg": "Invalid questionsArray."}


def error_code_e2223():
    return {"errorCode": "e2223", "errorMsg": "duplicate questionId found."}


def error_code_e2224():
    return {"errorCode": "e2224", "errorMsg": "duplicate questionId found."}


def error_code_e2225():
    return {"errorCode": "e2225", "errorMsg": "questionnaireId is required"}


def error_code_e2226():
    return {"errorCode": "e2226", "errorMsg": "invalid questionnaireId"}


def error_code_e2227():
    return {"errorCode": "e2227", "errorMsg": "questionnaire not found"}


def error_code_e2228(category_id, level):
    return {
        "errorCode": "e2228",
        "errorMsg": f"Duplicate combination of questionCategoryId: {category_id} and level: {level} found.",
    }


def error_code_e2229():
    return {"errorCode": "e2229", "errorMsg": "questionnaire name is already in use"}


def error_code_e2230(question_id):
    return {
        "errorCode": "e2230",
        "errorMsg": f"options list required for {question_id}",
    }


def error_code_e2231(question_id):
    return {"errorCode": "e2231", "errorMsg": f"Invalid options list for {question_id}"}


def error_code_e2232(question_id):

    return {
        "errorCode": "e2232",
        "errorMsg": f" options repeating for questionId {question_id}",
    }


def error_code_e2233(question_id):
    return {"errorCode": "e2233", "errorMsg": f"Invalid option found in {question_id}"}


def error_code_e2234(option, question_id):
    return {
        "errorCode": "e2234",
        "errorMsg": f"option {option} not found in {question_id}",
    }


def error_code_e2235(question_type, no_of_options):
    return {
        "errorCode": "e2235",
        "errorMsg": f"question type {question_type} need exactly {no_of_options} options ",
    }


def error_code_e2236(question_type):
    return {
        "errorCode": "e2235",
        "errorMsg": f"question type {question_type} need either 2 or 3 options ",
    }


def error_code_e2237(question_id):
    return {
        "errorCode": "e2235",
        "errorMsg": f"correct answer not found for questionId {question_id} ",
    }


def error_code_e2238(question_id):
    return {
        "errorCode": "e2238",
        "errorMsg": f"not enough correct answers for questionId {question_id} ",
    }


def error_code_e2239(category_id, level):
    return {
        "errorCode": "e2239",
        "errorMsg": f"Duplicate combination of questionCategoryId: {category_id} and level: {level} found.",
    }


def error_code_e2240():
    return {
        "errorCode": "e2240",
        "errorMsg": "questionnaire is already assigned to exam",
    }


def error_code_e2241():
    return {"errorCode": "e2241", "errorMsg": "student not enrolled to this exam"}


def error_code_e2242():
    return {"errorCode": "e2242", "errorMsg": "The exam is completed"}


def error_code_e2243():
    return {"errorCode": "e2243", "errorMsg": "The exam is cancelled"}


def error_code_e2244():
    return {"errorCode": "e2244", "errorMsg": "student not started the exam"}


def error_code_e2245():
    return {"errorCode": "e2245", "errorMsg": "student already submitted the response"}


def error_code_e2246():
    return {"errorCode": "e2246", "errorMsg": "student terminated from the exam"}


def error_code_e2247():
    return {"errorCode": "e2247", "errorMsg": "student rejected from the exam"}


def error_code_e2248():
    return {"errorCode": "e2247", "errorMsg": "action is required"}


def error_code_e2249():
    return {
        "errorCode": "e2249",
        "errorMsg": "action field only allow terminate or submit",
    }


def error_code_e2250():
    return {"errorCode": "e2250", "errorMsg": "Invalid response array"}


def error_code_e2251():
    return {"errorCode": "e2251", "errorMsg": "student already started the exam"}


def error_code_e2252(question_id):
    return {
        "errorCode": "e2252",
        "errorMsg": f"Invalid input for questionId :{question_id}",
    }


def error_code_e2253(question_id):
    return {
        "errorCode": "e2253",
        "errorMsg": f"studentInput id for questionId :{question_id} is not exist.",
    }


def error_code_e2254():
    return {
        "errorCode": "e2254",
        "errorMsg": "no need response array for terminate action",
    }


def error_code_e2255():
    return {
        "errorCode": "e2255",
        "errorMsg": "valuation in processing",
    }


def error_code_e402():
    return {
        "errorCode": "e402",
        "errorMsg": "access-token expired",
    }


def error_code_e2101():
    return {
        "errorCode": "e2101",
        "errorMsg": "cgpa is required",
    }


def error_code_e2102():
    return {
        "errorCode": "e2102",
        "errorMsg": "number of backlogs is required",
    }


def error_code_e2103():
    return {
        "errorCode": "e2103",
        "errorMsg": "invalid cgpa",
    }


def error_code_e2104():
    return {
        "errorCode": "e2104",
        "errorMsg": "invalid number of backlogs",
    }


def error_code_e2300():
    return {
        "errorCode": "e2300",
        "errorMsg": "course id is required",
    }


def error_code_e2301():
    return {
        "errorCode": "e2301",
        "errorMsg": "Invalid course id.",
    }


def error_code_e2302():
    return {
        "errorCode": "e2302",
        "errorMsg": "Invalid course",
    }


def error_code_e403():
    return {
        "errorCode": "e403",
        "errorMsg": "access-token is invalid",
    }


def error_code_e404():
    return {
        "errorCode": "e404",
        "errorMsg": "refresh-token is required",
    }


def error_code_e405():
    return {
        "errorCode": "e405",
        "errorMsg": "refresh-token is invalid or expired",
    }


def error_code_e406():
    return {
        "errorCode": "e406",
        "errorMsg": "Invalid token",
    }


def error_code_e407():
    return {
        "errorCode": "e407",
        "errorMsg": "token expired",
    }


def error_code_e408():
    return {"errorCode": "e408", "errorMsg": "Invalid json format"}


def error_code_e409():
    return {
        "errorCode": "e409",
        "errorMsg": "This use has no permission to perform this operation",
    }


def error_code_e1000():
    return {
        "errorCode": "e1000",
        "errorMsg": "The question category name must be a string instance",
    }


def error_code_e1002():
    return {"errorCode": "e1002", "errorMsg": "Question category name is required"}


def error_code_e1003():
    return {"errorCode": "e1003", "errorMsg": "Question category name is too long"}


def error_code_e1004():
    return {"errorCode": "e1004", "errorMsg": "Question category name is too short"}


def error_code_e1005():
    return {
        "errorCode": "e1005",
        "errorMsg": "Dont add space as the first or last letter for category name",
    }


def error_code_e1006():
    return {"errorCode": "e1006", "errorMsg": "Category not available"}


def error_code_e1008():
    return {"errorCode": "e1008", "errorMsg": "Already deleted"}


def error_code_e1010():
    return {
        "errorCode": "e1010",
        "errorMsg": "Unable to process the request",
    }


def error_code_e1011():
    return {
        "errorCode": "e1011",
        "errorMsg": "Institution name required",
    }


def error_code_e1012():
    return {
        "errorCode": "e1012",
        "errorMsg": "Institution name is too long",
    }


def error_code_e1013():
    return {
        "errorCode": "e1013",
        "errorMsg": "Institution name is too short",
    }


def error_code_e1014():
    return {
        "errorCode": "e1014",
        "errorMsg": "Institution name is not a valid string",
    }


def error_code_e1015():
    return {
        "errorCode": "e1015",
        "errorMsg": "Institution code is required",
    }


def error_code_e1016():
    return {
        "errorCode": "e1016",
        "errorMsg": "Institution code is too short",
    }


def error_code_e1017():
    return {
        "errorCode": "e1017",
        "errorMsg": "Institution code is too long",
    }


def error_code_e1018():
    return {
        "errorCode": "e1018",
        "errorMsg": "Institution code is not valid should be string",
    }


def error_code_e1019():
    return {
        "errorCode": "e1019",
        "errorMsg": "Dont add space as the first or last letter for institution name",
    }


def error_code_e1020():
    return {
        "errorCode": "e1020",
        "errorMsg": "Dont add space as the first or last letter for institution code",
    }


def error_code_e1021():
    return {
        "errorCode": "e1021",
        "errorMsg": "Institute with same code exists",
    }


def error_code_e1022():
    return {"errorCode": "e1022", "errorMsg": "No such institute"}


def error_code_e1023():
    return {
        "errorCode": "e1023",
        "errorMsg": "Institute already deleted",
    }


def error_code_e1036():
    return {"errorCode": "e1036", "errorMsg": "Invalid institution email"}


def error_code_e1037():
    return {"errorCode": "e1037", "errorMsg": "Duplicate institution email"}


def error_code_e1038():
    return {"errorCode": "e1038", "errorMsg": "Email required"}


def error_code_e1039():
    return {"errorCode": "e1039", "errorMsg": "Institution phone number required"}


def error_code_e1058():
    return {"errorCode": "e1040", "errorMsg": "Institution phone number is invalid"}


def error_code_e1024():
    return {
        "errorCode": "e1024",
        "errorMsg": "Invalid question category id given",
    }


def error_code_e1025():
    return {
        "errorCode": "e1025",
        "errorMsg": "Invalid institution id given",
    }


def error_code_e1026():
    return {
        "errorCode": "e1026",
        "errorMsg": "Institution Id is required",
    }


def error_code_e1027():
    return {
        "errorCode": "e1027",
        "errorMsg": "Institution Id is invalid",
    }


def error_code_e1028():
    return {
        "errorCode": "e1028",
        "errorMsg": "Institution not found",
    }


def error_code_e1029():
    return {"errorCode": "e1029", "errorMsg": "Exam name is required"}


def error_code_e1030():
    return {"errorCode": "e1030", "errorMsg": "Exam name is invalid"}


def error_code_e1031():
    return {"errorCode": "e1031", "errorMsg": "Exam name contains minimum 3 characters"}


def error_code_e1032():
    return {
        "errorCode": "e1032",
        "errorMsg": "Exam name cantains maximum 100 characters",
    }


def error_code_e1033():
    return {
        "errorCode": "e1033",
        "errorMsg": "Exam name not conatins leading or trailing spaces",
    }


def error_code_e1034():
    return {
        "errorCode": "e1034",
        "errorMsg": "Exam date is invalid and it should be in the format yyyy-mm-dd",
    }


def error_code_e1035():
    return {"errorCode": "e1035", "errorMsg": "Invalid! Future year cannot be used"}


def error_code_e1040():
    return {
        "errorCode": "e1040",
        "errorMsg": "Exam date is required",
    }


def error_code_e1041():
    return {"errorCode": "e1041", "errorMsg": "Exam time is required"}


def error_code_e1042():
    return {
        "errorCode": "e1042",
        "errorMsg": "Exam time is invalid should be in HH:MM:SS format",
    }


def error_code_e1043():
    return {"errorCode": "e1043", "errorMsg": "Total number of questions is required"}


def error_code_e1044():
    return {"errorCode": "e1044", "errorMsg": "Invalid total number of questions"}


def error_code_e1045():
    return {"errorCode": "e1045", "errorMsg": "Exam duration is required"}


def error_code_e1046():
    return {"errorCode": "e1046", "errorMsg": "Exam duration cannot be string"}


def error_code_e1047():
    return {"errorCode": "e1047", "errorMsg": "Question categories are required"}


def error_code_e1048():
    return {"errorCode": "e1048", "errorMsg": "Invalid question categories data"}


def error_code_e1049():
    return {
        "errorCode": "e1049",
        "errorMsg": "There is a missmatch in the total questions and sum of total questions in the category",
    }


def error_code_e1050():
    return {"errorCode": "e1050", "errorMsg": "Exam date should not be past year"}


def error_code_e1051():
    return {"errorCode": "e1051", "errorMsg": "Invalid question category"}


def error_code_e1052():
    return {
        "errorCode": "e1052",
        "errorMsg": "The total number of questions in each category should be an instance of integer",
    }


def error_code_e1053():
    return {
        "errorCode": "e1053",
        "errorMsg": "The weightage for each category should be an instance of float",
    }


def error_code_e1054():
    return {
        "errorCode": "e1054",
        "errorMsg": "Question category id must not be repeated",
    }


# 1058 is up


def error_code_e1055():
    return {"errorCode": "e1055", "errorMsg": "Exam not found"}


def error_code_e1056():
    return {
        "errorCode": "e1056",
        "errorMsg": "Unable to edit exam since it is started",
    }


def error_code_e1057():
    return {"errorCode": "e1057", "errorMsg": "Give proper exam date and exam time"}


# 1058 is up


def error_code_e1060():
    return {"errorCode": "e1060", "errorMsg": "status of exam is required"}


def error_code_e1061():
    return {"errorCode": "e1061", "errorMsg": "Invalid status for exam"}


def error_code_e1062():
    return {
        "errorCode": "e1062",
        "errorMsg": "Unable to cancel the exam since it is already completed",
    }


def error_code_e1063():
    return {
        "errorCode": "e1063",
        "errorMsg": "Year should be valid and in the format yyyy",
    }


def error_code_e1064():
    return {
        "errorCode": "e1064",
        "errorMsg": "enrolledStudents query param is required",
    }


def error_code_e1065():
    return {
        "errorCode": "e1065",
        "errorMsg": "enrolledStudents param must be eigther 0 or 1",
    }


def error_code_e1066():
    return {"errorCode": "e1066", "errorMsg": "Invalid enrolledStudents param"}


def error_code_e1067():
    return {"errorCode": "e1067", "errorMsg": "Feedback not found"}


def error_code_e1068():
    return {"errorCode": "e1068", "errorMsg": "token required"}


def error_code_e1069():
    return {"errorCode": "e1069", "errorMsg": "Invalid token"}


def error_code_e1070():
    return {"errorCode": "e1070", "errorMsg": "Invalid comment"}


def error_code_e1070():
    return {"errorCode": "e1070", "errorMsg": "Comment required"}


def error_code_e1071():
    return {"errorCode": "e1071", "errorMsg": "Invalid comment"}


def error_code_e1072():
    return {
        "errorCode": "e1072",
        "errorMsg": "The comment should be greater than 3 characters",
    }


def error_code_e1073():
    return {
        "errorCode": "e1073",
        "errorMsg": "The comment should be less than 1000 characters",
    }


def error_code_e1074():
    return {
        "errorCode": "e1074",
        "errorMsg": "Do not add blank spaces as the first and last characters",
    }


def error_code_e1075():
    return {
        "errorCode": "e1075",
        "errorMsg": "The student does not have a completed exam",
    }


def error_code_e1076():
    return {"errorCode": "e1076", "errorMsg": "Token missmatch"}


def error_code_e1079():
    return {"errorCode": "e1079", "errorMsg": "please provide a mark greater than 0"}


def error_code_e1077():
    return {"errorCode": "e1077", "errorMsg": "No marks found"}


def error_code_e1078():
    return {
        "errorCode": "e1078",
        "errorMsg": "The total number of questions available is less than the given number of questions",
    }


def error_code_e1079():
    return {"errorCode": "e1079", "errorMsg": "please provide a mark greater than 0"}


def error_code_e1080():
    return {"errorCode": "e1080", "errorMsg": "Mark invalid"}


def error_code_e1081():
    return {"errorCode": "e1081", "errorMsg": "Exam not completed"}


def error_code_e1082():
    return {"errorCode": "e1082", "errorMsg": "Category name already exists"}


def error_code_e1083():
    return {"errorCode": "e1083", "errorMsg": "Rating is required"}


def error_code_e1084():
    return {"errorCode": "e1084", "errorMsg": "Rating is invalid"}


def error_code_e1085():
    return {"errorCode": "e1085", "errorMsg": "Rating should be between 1 and 5"}


def error_code_e1086():
    return {
        "errorCode": "e1086",
        "errorMsg": "Cannot display the list as the path param is invalid",
    }


def error_code_e1087():
    return {"errorCode": "e1087", "errorMsg": "Coordinator name is required"}


def error_code_e1088():
    return {"errorCode": "e1088", "errorMsg": "Coordinator name is invalid"}


def error_code_e1089():
    return {"errorCode": "e1089", "errorMsg": "Coordinator name too small"}


def error_code_e1090():
    return {"errorCode": "e1090", "errorMsg": "Coordinator name too large"}


def error_code_e1091():
    return {
        "errorCode": "e1091",
        "errorMsg": "Coordinator name should not have space as first and last characters",
    }


def error_code_e1092():
    return {"errorCode": "e1092", "errorMsg": "Coordinator email is not given"}


def error_code_e1093():
    return {"errorCode": "e1093", "errorMsg": "Coordinator email is invalid"}


def error_code_e1094():
    return {"errorCode": "e1094", "errorMsg": "Coordinator phone number is not given"}


def error_code_e1095():
    return {"errorCode": "e1095", "errorMsg": "Coordinator phone number is invalid"}


def error_code_e1096():
    return {"errorCode": "e1096", "errorMsg": "Coordinator email is not unique"}


def error_code_e1097():
    return {"errorCode": "e1097", "errorMsg": "Batch name is required"}


def error_code_e1098():
    return {"errorCode": "e1098", "errorMsg": "Batch name is invalid"}


def error_code_e1099():
    return {"errorCode": "e1099", "errorMsg": "Batch name too small"}


def error_code_e1100():
    return {"errorCode": "e1100", "errorMsg": "Batch name too large"}


def error_code_e1101():
    return {
        "errorCode": "e1101",
        "errorMsg": "Batch name should not have space at the beginning or end",
    }


def error_code_e1102():
    return {"errorCode": "e1102", "errorMsg": "No exam id is provided"}


def error_code_e1103():
    return {"errorCode": "e1103", "errorMsg": "Invalid exam id"}


def error_code_e1104():
    return {"errorCode": "e1104", "errorMsg": "No exam found with such id"}


def error_code_e1105():
    return {
        "errorCode": "e1105",
        "errorMsg": "Unable to delete the batch since students are allocated",
    }


def error_code_e1106():
    return {"errorCode": "e1106", "errorMsg": "No batch found"}


def error_code_e1107():
    return {
        "errorCode": "e1107",
        "errorMsg": "Exam is not available to edit as it is cancelled or completed",
    }


def error_code_e1108():
    return {"errorCode": "e1108", "errorMsg": "exam or batch not available"}


def error_code_e1109():
    return {"errorCode": "e1109", "errorMsg": "Student mapping table not exist"}


def error_code_e1097():
    return {"errorCode": "e1097", "errorMsg": "Batch name is required"}


def error_code_e1098():
    return {"errorCode": "e1098", "errorMsg": "Batch name is invalid"}


def error_code_e1099():
    return {"errorCode": "e1099", "errorMsg": "Batch name too small"}


def error_code_e1100():
    return {"errorCode": "e1100", "errorMsg": "Batch name too large"}


def error_code_e1101():
    return {
        "errorCode": "e1101",
        "errorMsg": "Batch name should not have space at the beginning or end",
    }


def error_code_e1102():
    return {"errorCode": "e1102", "errorMsg": "No exam id is provided"}


def error_code_e1103():
    return {"errorCode": "e1103", "errorMsg": "Invalid exam id"}


def error_code_e1104():
    return {"errorCode": "e1104", "errorMsg": "No exam found with such id"}


def error_code_e1105():
    return {
        "errorCode": "e1105",
        "errorMsg": "Unable to delete the batch since students are allocated",
    }


def error_code_e1106():
    return {"errorCode": "e1106", "errorMsg": "No batch found"}


def error_code_e1107():
    return {
        "errorCode": "e1107",
        "errorMsg": "Exam is not available to edit as it is cancelled or completed",
    }


def error_code_e1108():
    return {"errorCode": "e1108", "errorMsg": "exam or batch not available"}


def error_code_e1109():
    return {"errorCode": "e1109", "errorMsg": "Student mapping table not exist"}


def error_code_e1110():
    return {"errorCode": "e1110", "errorMsg": "No batch id"}


def error_code_e1111():
    return {"errorCode": "e1111", "errorMsg": "Invalid batch id"}


def error_code_e1112(is_pool):
    return {"errorCode": "e1112", "errorMsg": "No student found", "is_pool": is_pool}


def error_code_e1113():
    return {"errorCode": "e1113", "errorMsg": "No batch found"}


def error_code_e1114():
    return {"errorCode": "e1114", "errorMsg": "Student is already mapped with an exam"}


def error_code_e1115():
    return {"errorCode": "e1115", "errorMsg": "No batch id"}


def error_code_e1116():
    return {"errorCode": "e1116", "errorMsg": "Invalid batch id"}


def error_code_e1117():
    return {
        "errorCode": "e1117",
        "errorMsg": "Please ensure that there is a valid exam which is started",
    }


def error_code_e1118():
    return {"errorCode": "e1118", "errorMsg": "Exam is cancelled"}


def error_code_e1119():
    return {"errorCode": "e1119", "errorMsg": "The student hasn't completed the exam"}


def error_code_e1120():
    return {"errorCode": "e1120", "errorMsg": "Student not found"}


def error_code_e1121():
    return {"errorCode": "e1121", "errorMsg": "Batch not found"}


def error_code_e1122():
    return {
        "errorCode": "e1122",
        "errorMsg": "Sorry unable to send the feedback since the exam is not completed",
    }


def error_code_e1123():
    return {"errorCode": "e1123", "errorMsg": "No students are mapped in exam"}


def error_code_e1121():
    return {"errorCode": "e1121", "errorMsg": "Batch not found"}


def error_code_e1122():
    return {
        "errorCode": "e1122",
        "errorMsg": "Sorry unable to send the feedback since the exam is not completed",
    }


def error_code_e1124():
    return {
        "errorCode": "e1124",
        "errorMsg": "Unable to delete category since there is a question",
    }


def error_code_e1125():
    return {
        "errorCode": "e1125",
        "errorMsg": "Unable to delete the institution since the students are mapped in the institution",
    }


def error_code_e1126():
    return {
        "errorCode": "e1126",
        "errorMsg": "Batches are open",
    }
    
def error_code_e1127():
    return {
        "errorCode": "e1127",
        "errorMsg": "A batch with this name already exists for the selected exam.",
        }
def error_code_e1128():
    return {
        "errorCode": "e1128",
        "errorMsg": "Invalid date given",
        }
    
def error_code_e1129():
    return {
        "errorCode": "e1129",
        "errorMsg": "Invalid year given",
        }
    
def error_code_e1130():
    return {
        "errorCode": "e1130",
        "errorMsg": "start date cannot be greater than end date",
        }



def error_code_e410():
    return {
        "errorCode": "e410",
        "errorMsg": "API not found",
    }


#######################################################################

###################################################################


def error_code_e3000():
    return {"errorCode": "e3000", "errorMsg": "Question required"}


def error_code_e3001():
    return {"errorCode": "e3001", "errorMsg": "Question cannot be empty"}


def error_code_e3002():
    return {
        "errorCode": "e3002",
        "errorMsg": "Question cannot conatins leading or trailing spaces",
    }


def error_code_e3003():
    return {
        "errorCode": "e3003",
        "errorMsg": "Question contains minimum 10 characters",
    }


def error_code_e3004():
    return {
        "errorCode": "e3004",
        "errorMsg": "Question should be less than 1000 characters",
    }


def error_code_e3005():
    return {"errorCode": "e3005", "errorMsg": "No questions found for the category"}


def error_code_e3006():
    return {"errorCode": "e3006", "errorMsg": "Question already exists"}


def error_code_e3007():
    return {"errorCode": "e3007", "errorMsg": "Question already deleted"}


def error_code_e3008():
    return {"errorCode": "e3008", "errorMsg": "Question not found"}


def error_code_e3009():
    return {"errorCode": "e3009", "errorMsg": "No Questions exist"}


def error_code_e3010(questions):
    return {
        "errorCode": "e3010",
        "errorMsg": f"Duplicate question : {questions}",
    }


def error_code_e3011():
    return {
        "errorCode": "e3011",
        "errorMsg": "Question already exists in the questionnaire. Unable to delete",
    }


def error_code_e3012():
    return {
        "errorCode": "e3012",
        "errorMsg": "Invalid Question",
    }


def error_code_e3100():
    return {"errorCode": "e3100", "errorMsg": "Category Id required"}


def error_code_e3101():
    return {"errorCode": "e3101", "errorMsg": "Category cannot be empty"}


def error_code_e3102():
    return {"errorCode": "e3102", "errorMsg": "Category Id should be an integer"}


def error_code_e3103():
    return {"errorCode": "e3103", "errorMsg": "Category not found"}


def error_code_e3104(question_type, question_type_mapping):
    return {
        "errorCode": "e3104",
        "errorMsg": f"Invalid question type '{question_type}'. Valid types are: {', '.join(question_type_mapping.keys())}.",
    }


def error_code_e3105():
    return {"errorCode": "e3105", "errorMsg": "category should be a list"}


def error_code_e3106():
    return {"errorCode": "e3106", "errorMsg": "category list cannot be empty"}


def error_code_e3200():
    return {"errorCode": "e3200", "errorMsg": "options required"}


def error_code_e3201():
    return {"errorCode": "e3201", "errorMsg": "options cannot be empty"}


def error_code_e3202():
    return {
        "errorCode": "e3202",
        "errorMsg": "Exactly 4 options are required for this question type.",
    }


def error_code_e3203(invalid_options):
    return {
        "errorCode": "e3203",
        "errorMsg": f"Maximum options length is 1000. Invalid options: {', '.join(invalid_options)}",
    }


def error_code_e3204():
    return {"errorCode": "e3204", "errorMsg": "Duplicate options found"}


def error_code_e3205():
    return {
        "errorCode": "e3205",
        "errorMsg": "Invalid options format. Ensure the input is a properly formatted JSON list..",
    }


def error_code_e3206():
    return {
        "errorCode": "e3206",
        "errorMsg": "Option list cannot be empty",
    }


def error_code_e3207():
    return {
        "errorCode": "e3207",
        "errorMsg": "Exactly 2 options required for this question type",
    }


def error_code_e3209(invalid_options):
    return {
        "errorCode": "e3209",
        "errorMsg": f"Invalid option: {', '.join(invalid_options)}",
    }


def error_code_e3208(answer):
    return {
        "errorCode": "e3208",
        "errorMsg": f"Correct answer '{answer}' is not a valid option.",
    }


def error_code_e3300():
    return {"errorCode": "e3300", "errorMsg": "Correct answer is required"}


def error_code_e3301():
    return {"errorCode": "e3301", "errorMsg": "Correct answer cannot be empty"}


def error_code_e3302(invalid_answer):
    return {
        "errorCode": "e3302",
        "errorMsg": f"Maximum correct answer length is 1000. Invalid options: {', '.join(invalid_answer)}",
    }


def error_code_e3303():
    return {
        "errorCode": "e3303",
        "errorMsg": "Invalid answer format. Ensure the input is a properly formatted JSON list..",
    }


def error_code_e3304():
    return {
        "errorCode": "e3304",
        "errorMsg": "Answer list cannot be empty",
    }


def error_code_e3305():
    return {
        "errorCode": "e3305",
        "errorMsg": "Only one correct answer is allowed",
    }


def error_code_e3306(invalid_answer):
    return {
        "errorCode": "e3306",
        "errorMsg": f"Invalid answer: {', '.join(invalid_answer)}",
    }


def error_code_e3400():
    return {"errorCode": "e3400", "errorMsg": "Invalid file format"}


def error_code_e3401():
    return {"errorCode": "e3401", "errorMsg": "File size should be less than 2 MB"}


def error_code_e3500():
    return {"errorCode": "e3500", "errorMsg": "Question type is required"}


def error_code_e3501():
    return {"errorCode": "e3501", "errorMsg": "Question type cannot be empty"}


def error_code_e3502():
    return {"errorCode": "e3502", "errorMsg": "Question type should be an integer"}


def error_code_e3503():
    return {"errorCode": "e3503", "errorMsg": "Question type should be 1 or 2"}


def error_code_e3504():
    return {"errorCode": "e3504", "errorMsg": "Duplicate answers found"}


def error_code_e3700():
    return {
        "errorCode": "e3700",
        "errorMsg": "Exam Id required",
    }


def error_code_e3701():
    return {
        "errorCode": "e3701",
        "errorMsg": "Exam Id cannot be null",
    }


def error_code_e3702():
    return {
        "errorCode": "e3702",
        "errorMsg": "Exam Id cannot be string",
    }


def error_code_e3800():
    return {
        "errorCode": "e3800",
        "errorMsg": "Student Id required",
    }


def error_code_e3801():
    return {
        "errorCode": "e3801",
        "errorMsg": "Student Id cannot be null",
    }


def error_code_e3802():
    return {
        "errorCode": "e3802",
        "errorMsg": "Student Id should be a list",
    }


def error_code_e3803():
    return {
        "errorCode": "e3803",
        "errorMsg": "Student Id should be integer",
    }


def error_code_e3804():
    return {
        "errorCode": "e3804",
        "errorMsg": "Student Id list cannot be empty",
    }


def error_code_e3805(missing_ids):
    return {
        "errorCode": "e3805",
        "errorMsg": f"Student with ID {', '.join(map(str, missing_ids))} not found",
    }


def error_code_e3806():
    return {
        "errorCode": "e3806",
        "errorMsg": "Remove studnet Id required",
    }


def error_code_e3807():
    return {
        "errorCode": "e3807",
        "errorMsg": "Remove student Id cannot be null",
    }


def error_code_e3808():
    return {
        "errorCode": "e3808",
        "errorMsg": "Remove Student Id should be a list",
    }


def error_code_e3809():
    return {
        "errorCode": "e3809",
        "errorMsg": "Remove student Id should be integer",
    }


def error_code_e3810():
    return {
        "errorCode": "e3810",
        "errorMsg": "Remove student Id list cannot be empty",
    }


def error_code_e3811():
    return {
        "errorCode": "e3811",
        "errorMsg": "Provide values in either add or remove student id",
    }


def error_code_e3900():
    return {
        "errorCode": "e3900",
        "errorMsg": "Exam not found",
    }


def error_code_e4000():
    return {
        "errorCode": "e4000",
        "errorMsg": "No student registered with exam",
    }


def error_code_e4004(students_registered_in_other_exams):
    return {
        "errorCode": "e4004",
        "errorMsg": f"Student with IDs already registered in other exams: {students_registered_in_other_exams}",
    }


def error_code_e4006():
    return {
        "errorCode": "e4006",
        "errorMsg": "No students found",
    }


def error_code_e4011():
    return {
        "errorCode": "e4011",
        "errorMsg": "Student token required",
    }


def error_code_e4020():
    return {
        "errorCode": "e4020",
        "errorMsg": "Institution Id required",
    }


def error_code_e4021():
    return {
        "errorCode": "e4021",
        "errorMsg": "Institution Id cannot be empty",
    }


def error_code_e4022():
    return {
        "errorCode": "e4022",
        "errorMsg": "Institution Id should be an integer",
    }


def error_code_e4023(invalid_student_ids):
    return {
        "errorCode": "e4023",
        "errorMsg": f"Student not completed the exam : {invalid_student_ids}",
    }


def error_code_e4100():
    return {
        "errorCode": "e4100",
        "errorMsg": "Question difficulty level required",
    }


def error_code_e4101():
    return {
        "errorCode": "e4101",
        "errorMsg": "difficulty level cannot be empty",
    }


def error_code_e4102():
    return {"errorCode": "e4102", "errorMsg": "difficulty level should be 1,2 or 3"}


def error_code_e4103():
    return {"errorCode": "e4103", "errorMsg": "difficulty should be an integer"}


def error_code_e4104(difficulty_level, difficulty_level_mapping):
    return {
        "errorCode": "e4104",
        "errorMsg": f"Invalid difficulty level '{difficulty_level}'. Valid levels are: {', '.join(difficulty_level_mapping.keys())}.",
    }


def error_code_e4200():
    return {"errorCode": "e4200", "errorMsg": "CSV file is required"}


def error_code_e4201():
    return {"errorCode": "e4201", "errorMsg": "Please upload a valid CSV file"}


def error_code_e4202():
    return {"errorCode": "e4202", "errorMsg": "File size should be less than 2mb"}


def error_code_e4203(error_messages):
    return {"errorCode": "e4203", "errorMsg": error_messages}


def error_code_e4204():
    return {"errorCode": "e4204", "errorMsg": "Csv file is empty"}


def error_code_e4210():
    return {
        "errorCode": "e4210",
        "errorMsg": "Questionnaire with the name already exists",
    }


def error_code_e4212():
    return {"errorCode": "e4212", "errorMsg": "Questionnaire name cannot be empty"}


def error_code_e4213():
    return {
        "errorCode": "e4213",
        "errorMsg": "Questionnaire name contains maximum 200 characters",
    }


def error_code_e4300():
    return {
        "errorCode": "e4300",
        "errorMsg": "Exam location required",
    }


def error_code_e4301():
    return {
        "errorCode": "e4301",
        "errorMsg": "Exam location cannot be empty",
    }


def error_code_e4302():
    return {
        "errorCode": "e4302",
        "errorMsg": "Exam location contains maximum 100 characters",
    }


def error_code_e4303():
    return {
        "errorCode": "e4303",
        "errorMsg": "Exam with name already exist",
    }


def error_code_e4305():
    return {
        "errorCode": "e4305",
        "errorMsg": "Unable to update the exam",
    }


def error_code_e4306():
    return {
        "errorCode": "e4306",
        "errorMsg": "Invalid exam location",
    }


def error_code_e4400():
    return {
        "errorCode": "e4400",
        "errorMsg": "Questionnaire id required",
    }


def error_code_e4401():
    return {
        "errorCode": "e4401",
        "errorMsg": "Questionnaire id cannot be empty",
    }


def error_code_e4402():
    return {
        "errorCode": "e4402",
        "errorMsg": "Questionnaire id cannot be string",
    }


def error_code_e4500():
    return {
        "errorCode": "e4500",
        "errorMsg": "Value error",
    }


def error_code_e4600():
    return {
        "errorCode": "e4600",
        "errorMsg": "Can't shortlist students. Exam is not completed",
    }


def error_code_e4601():
    return {
        "errorCode": "e4601",
        "errorMsg": "No students met the category criteria",
    }


def error_code_e4602():
    return {
        "errorCode": "e4602",
        "errorMsg": "Total score and category criteria no met",
    }


def error_code_e4603():
    return {
        "errorCode": "e4603",
        "errorMsg": "Invalid action value.value should either 0 or 1",
    }


def error_code_e4604():
    return {
        "errorCode": "e4604",
        "errorMsg": "Action value should be an integer",
    }


def error_code_e4605():
    return {
        "errorCode": "e4605",
        "errorMsg": "Action value required",
    }


def error_code_e4606():
    return {
        "errorCode": "e4606",
        "errorMsg": "Action value cannot be empty",
    }


def error_code_e4607():
    return {
        "errorCode": "e4607",
        "errorMsg": "Can't shortlist students. Exam is not completed",
    }


def error_code_e4700():
    return {
        "errorCode": "e4700",
        "errorMsg": "cut_off is required",
    }


def error_code_e4701():
    return {
        "errorCode": "e4701",
        "errorMsg": "cut_off should be an integer",
    }


def error_code_e4702():
    return {
        "errorCode": "e4702",
        "errorMsg": "Invalid input. Provide either cut-off mark or categories",
    }


def error_code_e4703():
    return {
        "errorCode": "e4703",
        "errorMsg": "No students met the cut-off mark",
    }


def error_code_e4704():
    return {
        "errorCode": "e4704",
        "errorMsg": "No students matched both cut-off and categories",
    }


def error_code_e4705():
    return {
        "errorCode": "e4705",
        "errorMsg": "Exam date should be in string format",
    }


def error_code_e4706():
    return {
        "errorCode": "e4706",
        "errorMsg": "Exam time should be in string format",
    }


def error_code_e4708():
    return {
        "errorCode": "e4708",
        "errorMsg": "Exam location contains minimum 4 characters",
    }


def error_code_e4709():
    return {
        "errorCode": "e4709",
        "errorMsg": "Exam location not contains leading or trailing spaces",
    }


def error_code_e4710():
    return {
        "errorCode": "e4710",
        "errorMsg": "Exam already deleted",
    }


def error_code_e4711():
    return {
        "errorCode": "e4711",
        "errorMsg": "Exam status should be an integer",
    }


def error_code_e4712():
    return {"errorCode": "e4712", "errorMsg": "Exam not completed"}


def error_code_e4714():
    return {"errorCode": "e4714", "errorMsg": "Invalid year"}


def error_code_e4715(wrong_ids):
    return {
        "errorCode": "e4715",
        "errorMsg": "Categories with IDs not exist in questionnaire: {}".format(
            ", ".join(map(str, wrong_ids))
        ),
    }


def error_code_e4716():
    return {"errorCode": "e4716", "errorMsg": "Is pool required"}


def error_code_e4717():
    return {"errorCode": "e4717", "errorMsg": "Is pool should be boolean"}


def error_code_e4800():
    return {"errorCode": "e4800", "errorMsg": "Batch status required"}


def error_code_e4801():
    return {"errorCode": "e4801", "errorMsg": "Batch status should be an integer"}


def error_code_e4802():
    return {"errorCode": "e4802", "errorMsg": "Invalid batch status"}


def error_code_e4803():
    return {"errorCode": "e4803", "errorMsg": "Batch already closed"}


def error_code_e4804():
    return {
        "errorCode": "e4804",
        "errorMsg": "Institution code is invalid",
    }


def error_code_e4805():
    return {
        "errorCode": "e4805",
        "errorMsg": "Exam not completed",
    }
