const adminQuestionSectionErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (String(errorCode)) {
    case "e1010":
      errorMessage = "Something went wrong. Please try again later";
      break;
    case "e1002":
      errorMessage = "Section name is required";
      break;
    case "e1000":
      errorMessage = "Section name must be a valid text";
      break;
    case "e1003":
      errorMessage = "Section name cannot be longer than 100 characters";
      break;
    case "e1004":
      errorMessage = "Section name must be at least 2 characters long";
      break;
    case "e1005":
      errorMessage = "Please remove spaces at the beginning or end of the section name";
      break;
    case "e1006":
      errorMessage = "Section not found";
      break;
    case "e1008":
      errorMessage = "This section has already been deleted";
      break;
    case "e1082":
      errorMessage = "Section with this name already exists";
      break;
    case "e1086":
      errorMessage = "Unable to display the list due to an invalid parameter";
      break;
    case "e1124":
      errorMessage = "Cannot delete the section because it contains a question";
      break;

    default:
      errorMessage = "Something went wrong. Please try again later";
      break;
  }
  return errorMessage;
};

export default adminQuestionSectionErrorCodes;
