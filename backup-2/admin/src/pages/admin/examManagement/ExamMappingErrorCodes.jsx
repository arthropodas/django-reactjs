const adminExamMappingErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e3700":
    case "e3701":
      errorMessage = "Exam Id required or cannot be null";
      break;
    case "e3702":
      errorMessage = "Exam Id cannot be string";
      break;
    case "e3800":
    case "e3801":
      errorMessage = "Student Id required or cannot be null";
      break;
    case "e3802":
      errorMessage = "Student Id should be a list";
      break;
    case "e3803":
    case "e3809":
      errorMessage = "Student Id should be integer";
      break;
    case "e3805":
      errorMessage = "Student with Id [] not found";
      break;
    case "e3806":
    case "e3807":
      errorMessage = "Remove student Id required or cannot be null";
      break;
    case "e3808":
      errorMessage = "Remove student Id should be list";
      break;
    case "e3811":
      errorMessage = "Provide values in either student Id or remove student Id";
      break;
    case "e3900":
      errorMessage = "Exam with Id not found";
      break;
    case "e3901":
      errorMessage = "Exam completed or cancelled. Please try again later";
      break;
    case "e4000":
      errorMessage = "No students registered with exam";
      break;
    case "e4001":
      errorMessage = "Already exam link is shared to registered students";
      break;
    case "e4002":
      errorMessage = "Invalid student Ids found []";
      break;
    case "e4003":
      errorMessage = "Student already registered";
      break;
    case "e4004":
      errorMessage = "Student with Id already registered with other exam []";
      break;
    case "e4005":
      errorMessage = "Some emails failed to send";
      break;
    case "e4006":
    case "e4007":
      errorMessage = "No students found to send or resend exam link";
      break;
    case "e4008":
      errorMessage = "Cannot add and remove students simultaneously";
      break;
    case "e4009":
      errorMessage = "Student not registered with exam";
      break;
    case "e4010":
      errorMessage = "Students registered in other exams cannot be removed";
      break;
    case "e4011":
      errorMessage = "Student token required";
      break;
    case "e4012":
    case "e4014":
      errorMessage = "Type 0 and Type 2 questions need exactly 4 options";
      break;
    case "e4013":
      errorMessage = "Type 1 questions need exactly 2 options";
      break;
    case "e4015":
      errorMessage = "Error in sending email";
      break;
    case "e4016":
      errorMessage = "No students were removed. Check if they are registered";
      break;
    case "e4017":
      errorMessage = "No enough questions found to send question paper";
      break;
    case "e4018":
      errorMessage = "Student already attended the exam";
      break;
    default:
      errorMessage = "Unknown error occurred";
      break;
  }

  return errorMessage;
};

export default adminExamMappingErrorCodes;
