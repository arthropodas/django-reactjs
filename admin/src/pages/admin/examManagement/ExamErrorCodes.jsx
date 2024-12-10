const adminExamErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e1026":
      errorMessage = "Institution Id is required";
      break;
    case "e1027":
      errorMessage = "Institution Id is invalid";
      break;
    case "e1028":
      errorMessage = "Institution not found";
      break;
    case "e1029":
      errorMessage = "Exam name is required";
      break;
    case "e1030":
      errorMessage = "Exam name is invalid";
      break;
    case "e1031":
      errorMessage = "Exam name is too small";
      break;
    case "e1032":
      errorMessage = "Exam name is too big";
      break;
    case "e1033":
      errorMessage = "Dont add space as the first or last letter for exam name";
      break;
    case "e1034":
      errorMessage = "Exam date is invalid and it should be in the format yyyy-mm-dd";
      break;
    case "e1040":
      errorMessage = "Exam date is required";
      break;
    case "e1041":
      errorMessage = "Exam time is required";
      break;
    case "e1042":
      errorMessage = "Exam time is invalid should be in HH:MM:SS format";
      break;
    case "e1043":
      errorMessage = "Total number of questions is required";
      break;
    case "e1044":
      errorMessage = "Invalid total number of questions";
      break;
    case "e1045":
      errorMessage = "Exam duration is required";
      break;
    case "e1046":
      errorMessage = "Invalid exam duration";
      break;
    case "e1047":
      errorMessage = "Question categories are required";
      break;
    case "e1048":
      errorMessage = "Invalid question categories data";
      break;
    case "e1049":
      errorMessage = "There is a missmatch in the total questions and sum of total questions in the section";
      break;
    case "e1050":
      errorMessage = "Exam date should be this year";
      break;
    case "e1051":
      errorMessage = "Invalid question section";
      break;
    case "e1052":
      errorMessage = "The total number of questions in each section should be an instance of integer";
      break;
    case "e1053":
      errorMessage = "The weightage for each section should be an instance of float";
      break;
    case "e1054":
      errorMessage = "Question section id must not be repeated";
      break;
    case "e1055":
      errorMessage = "Exam not found";
      break;
    case "e1056":
      errorMessage = "Unable to edit exam since it is started or";
      break;
    case "e1057":
      errorMessage = "Give proper exam date and exam time";
      break;

    case "e1060":
      errorMessage = "status of exam is required";
      break;
    case "e1061":
      errorMessage = "Invalid status for exam";
      break;
    case "e1062":
      errorMessage = "Unable to cancel the exam since it is already completed";
      break;
    case "e1063":
      errorMessage = "Year should be valid and in the format yyyy";
      break;
    case "e1064":
      errorMessage = "enrolledStudents query param is required";
      break;
    case "e1065":
      errorMessage = "enrolledStudents param must be eigther 0 or 1";
      break;
    case "e2045":
      errorMessage = "Question paper already exists";
      break;
    case "e2080":
      errorMessage = "exam date should not be past";
      break;
    case "e2081":
      errorMessage = "exam time should not be past";
      break;
    case "e1081":
      errorMessage = "Exam not completed";
      break;
    case "e1078":
      errorMessage = "The total number of questions available is less than the given number of questions";
      break;
    case "e1086":
      errorMessage = "Cannot display the list as the path param is invalid";
      break;
    case "e4303":
      errorMessage = "Exam already exist";
      break;
    case "e4304":
      errorMessage = "Exams not found";
      break;
    case "e1123":
      errorMessage = "No students are mapped in exam";
      break;
    case "e4305":
      errorMessage = "Unable to update the exam";
      break;
    case "e2226":
      errorMessage = "Invalid Questionnaire Id entered";
      break;
      
    default:
      errorMessage = "Unknown error occurred";
      break;
  }

  return errorMessage;
};

export default adminExamErrorCodes;