const adminInstitutionErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e1010":
      errorMessage = "An unexpected error occurred. Please try again.";
      break;
    case "e1011":
      errorMessage = "Institution name is required.";
      break;
    case "e1014":
      errorMessage = "Institution name must be a valid text.";
      break;
    case "e1013":
      errorMessage = "Institution name must be at least 3 characters long.";
      break;
    case "e1012":
      errorMessage = "Institution name cannot be longer than 100 characters.";
      break;
    case "e1019":
      errorMessage = "Please remove spaces at the beginning or end of the name.";
      break;
    case "e1015":
      errorMessage = "Institution code is required.";
      break;
    case "e1018":
      errorMessage = "Institution code must be a valid text.";
      break;
    case "e1016":
      errorMessage = "Institution code must be at least 6 characters long.";
      break;
    case "e1017":
      errorMessage = "Institution code cannot be longer than 10 characters.";
      break;
    case "e1020":
      errorMessage = "Please avoid using spaces in search.";
      break;
    case "e1021":
      errorMessage = "An institution with this code already exists.";
      break;
    case "e1022":
      errorMessage = "Institution not found.";
      break;
    case "e1023":
      errorMessage = "This institution has already been deleted.";
      break;
    case "e1037":
      errorMessage = "An institution with this email already exists.";
      break;
    case "e1036":
      errorMessage = "Email address provided is invalid.";
      break;
    case "e2028":
      errorMessage = "Institution not found.";
      break;
    case "e1086":
      errorMessage = "Unable to display the list due to an invalid parameter.";
      break;
    case "e1087":
      errorMessage = "Coordinator name is required.";
      break;
    case "e1088":
      errorMessage = "Please provide a valid coordinator name.";
      break;
    case "e1089":
      errorMessage = "Coordinator name is too short.";
      break;
    case "e1090":
      errorMessage = "Coordinator name is too long.";
      break;
    case "e1091":
      errorMessage = "Coordinator name should not contain spaces.";
      break;
    case "e1092":
      errorMessage = "Coordinator email is not required.";
      break;
    case "e1093":
      errorMessage = "Coordinator email is invalid.";
      break;
    case "e1094":
      errorMessage = "Coordinator phone number is required.";
      break;
    case "e1095":
      errorMessage = "Coordinator phone number is invalid.";
      break;
    case "e1096":
      errorMessage = "Coordinator email must be unique.";
      break;
    case "e1125":
      errorMessage = "Cannot delete the institution as it still has mapped students.";
      break;
      
    default:
      errorMessage = "Something went wrong. Please try again later.";
      break;
  }

  return errorMessage;
};

export default adminInstitutionErrorCodes;
