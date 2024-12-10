const adminQuestionErrorCodes = (errorCode) => {
    let errorMessage = "";

    switch (errorCode) {
        case "e3000":
            errorMessage = "Question required";
            break;
        case "e3001":
            errorMessage = "Question cannot be empty";
            break;
        case "e3002":
            errorMessage = "Question cannot contains leading or trailing spaces";
            break;
        case "e3003":
            errorMessage = "Question contains minimum 10 characters";
            break;
        case "e3004":
            errorMessage = "Question should be less than 1000 characters";
            break;
        case "e3006":
            errorMessage = "Question already exists";
            break;
        case "e3007":
            errorMessage = "Question already deleted";
            break;
        case "e3008":
            errorMessage = "Question not found";
            break;
        case "e3011":
            errorMessage = "Question already exists in the questionnaire. Unable to delete";
            break;
        case "e3100":
            errorMessage = "section Required";
            break;
        case "e3101":
            errorMessage = "Please choose a question section";
            break;
        case "e3102":
            errorMessage = "section Id should be an integer";
            break;
        case "e3103":
            errorMessage = "section not found";
            break;
        case "e3200":
            errorMessage = "Options are required";
            break;
        case "e3201":
            errorMessage = "Options cannot be empty";
            break;
        case "e3202":
            errorMessage = "Exactly 4 options are required for this question type.  ";
            break;
        case "e3203":
            errorMessage = "Maximum options length is 100";
            break;
        case "e3204":
            errorMessage = "Duplicate options found";
            break;
        case "e3206":
            errorMessage = "Option list cannot be empty";
            break;
        case "e3300":
            errorMessage = "Correct answer is required";
            break;
        case "e3301":
            errorMessage = "Correct answer cannot be empty";
            break;
        case "e3302":
            errorMessage = "Correct answer should less than 100 characters";
            break;
        case "e3304":
            errorMessage = "Please select correct answer";
            break;
        case "e4203":
            errorMessage = "Invalid Csv file headers";
            break;
        case "e3400":
            errorMessage = "Invalid file format";
            break;
        case "e3401":
            errorMessage = "File size should be less than 2 MB";
            break;
        case "e4200":
            errorMessage = "CSV file is required";
            break;
        case "e4201":
            errorMessage = "Please upload a valid csv file";
            break;
        case "e4204":
            errorMessage = "csv file is empty";
            break;
        case "e3500":
            errorMessage = "Question type is required";
            break;
        case "e3501":
            errorMessage = "Please choose question type";
            break;
        case "e4101":
            errorMessage = "Please choose question difficulty level";
            break;
        case "e3305":
            errorMessage = "Only one correct answer is allowed for this question type";
            break;
        case "e3207":
            errorMessage = "Please enter 2 options";
            break;

        default:
            errorMessage = "Unknown error occurred";
            break;
    }

    return errorMessage;
};

export default adminQuestionErrorCodes;