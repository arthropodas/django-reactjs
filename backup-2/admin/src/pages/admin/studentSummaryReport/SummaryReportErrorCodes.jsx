
export const SummaryReportErrorCodes=(errorCode)=>{
    let errorMessage="";
    switch(errorCode){
        case "e1111":
            errorMessage = "Invalid batch id";
            break;
        case "e1112":
            errorMessage = "No student found";
            break;
        
        case "e1113":
            errorMessage = "No batch found";
            break;
        case "e1114":
            errorMessage = "Student is already mapped with an exam";
            break;
        case "e1115":
            errorMessage = "No batch id";
            break;
        case "e1116":
            errorMessage = "Invalid batch id";
            break;
        case "e1117":
            errorMessage = "Please ensure that there is a valid exam which is started";
            break;
        case "e1118":
            errorMessage = "Exam is cancelled";
            break;
        case "e1119":
            errorMessage = "The student hasn't completed the exam";
            break;
        case "e1120":
            errorMessage = "Student not found";
            break;
        case "e1121":
            errorMessage = "Batch not found";
            break;
        default:
            errorMessage = "Unknown error";
            break;
    }
    return errorMessage;
};

