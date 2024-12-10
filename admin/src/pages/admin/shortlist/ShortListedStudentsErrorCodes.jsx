const adminShortlistErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e1010":
      errorMessage = "Please enter a valid number";
      break;
    case "e1079":
      errorMessage = "Please enter a cutoff mark which is valid";
      break;
    case "e1080":
      errorMessage = "Please do not enter alphabets";
      break;
    case "e4020":
      errorMessage = "No students shortlisted";
      break;
    case "e3900":
      errorMessage = "Exam not found";
      break;
    case "e4600":
      errorMessage = "Can't shortlist students. Exam is not completed";
      break;
    case "e4601":
      errorMessage = "No students met the criteria";
      break;
    case "e4602":
      errorMessage = "Cut off mark and category criteria not met";
      break;
    case "e4702":
      errorMessage = "Invalid input. Provide either cut-off mark or categories";
      break;
    case "e4703":
      errorMessage = "No students met the cut-off mark";
      break;
    case "e4006":
      errorMessage = "No students found";
      break;

    case "e4704":
      errorMessage = "No students met both cut-off and category criteria";
      break;
    
    case "e4718":
        errorMessage = "Some emails failed to send";
        break;

    default:
      errorMessage = "Unknown error occurred";
      break;
  }
  return errorMessage;
};

export default adminShortlistErrorCodes;
