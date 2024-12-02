const institutionErrorCodes = (errorCode) => {
    let errorMessage = "";
  
    switch (errorCode) {
      case "e1010":
        errorMessage = "Exception";
        break;
      case "e1011":
        errorMessage = "Institution name is required";
        break;
      case "e1014":
        errorMessage = "Institution name must be string";
        break;
      case "e1013":
        errorMessage = "Institution name  length less than 3";
        break;
      case "e1012":
        errorMessage = "Institution name  length greater than 100";
        break;
      case "e1019":
        errorMessage = "Added space as first or last character of  name";
        break;
      case "e1015":
        errorMessage = "code required";
        break;
      case "e1018":
        errorMessage = "code should be string ";
        break;
      case "e1016":
        errorMessage = "code less than 6 in length";
        break;
      case "e1017":
        errorMessage = "code greater than 10 in length";
        break;
      case "e1020":
        errorMessage = "avoid spaces in search";
        break;
      case "e1021":
        errorMessage = "Institute with same code exists";
        break;
      case "e1022":
        errorMessage = "No institute";
        break;
      case "e1023":
        errorMessage = "Already deleted";
        break;
      case "e1037":
        errorMessage = "Institution already exist with the given mail id";
        break;
      case "e1036":
        errorMessage = "Entered an Invalid mail id";
        break;
      case "e2028":
        errorMessage = "Institution not found";
        break;
      case "e1086":
        errorMessage = "Cannot display the list as the path param is invalid";
        break;
  
      case "e1087":
        errorMessage = "Coordinator name is required";
        break;
      case "e1088":
        errorMessage = "Coordinator name is invalid";
        break;
      case "e1089":
        errorMessage = "Coordinator name too short";
        break;
      case "e1090":
        errorMessage = "Coordinator name too long";
        break;
      case "e1091":
        errorMessage = "Coordinator name should not have space";
        break;
      case "e1092":
        errorMessage = "Coordinator email is not required";
        break;
      case "e1093":
        errorMessage = "Coordinator email is invalid";
        break;
      case "e1094":
        errorMessage = "Coordinator phone number is not given";
        break;
      case "e1095":
        errorMessage = "Coordinator phone number is invalid";
        break;
      
      case "e1096":
        errorMessage = "Coordinator email is not unique";
        break;
  
  
      default:
        errorMessage = "Unknown error occurred";
        break;
    }
  
    return errorMessage;
  };
  
  export default institutionErrorCodes;