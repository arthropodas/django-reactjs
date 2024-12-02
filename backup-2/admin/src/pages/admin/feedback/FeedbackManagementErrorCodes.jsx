const adminFeedbackErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e1068":
      errorMessage = "Token is required";
      break;
    case "e1069":
      errorMessage = "Token is invalid";
      break;
    case "e1070":
      errorMessage = "Comment is required";
      break;
    case "e1071":
      errorMessage = "Invalid comment";
      break;
    case "e1072":
      errorMessage = "The comment should be greater than 3 characters";
      break;
    case "e1073":
      errorMessage = "The comment should be less than 1000 characters";
      break;
    case "e1074":
      errorMessage = "Do not add blank spaces as the first and last characters";
      break;
    case "e1075":
      errorMessage = "The student does not have a completed exam";
      break;
    case "e1076":
      errorMessage = "Token is incorrect"; //mismatch
      break;

    default:
      errorMessage = "Unknown error occurred";
      break;
  };
  return errorMessage;
};

export default adminFeedbackErrorCodes;
