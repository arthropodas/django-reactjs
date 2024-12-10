export const adminExamBatchErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e1097":
      errorMessage = "Batch name is required";
      break;
    case "e1098":
      errorMessage = "Batch name is invalid";
      break;
    case "e1099":
      errorMessage = "Batch name too small";
      break;
    case "e1100":
      errorMessage = "Batch name too large";
      break;
    case "e1101":
      errorMessage = "Batch name should not have space at the beginning or end";
      break;
    case "e1102":
      errorMessage = "No exam id is provided";
      break;
    case "e1103":
      errorMessage = "Invalid exam";
      break;
    case "e1104":
      errorMessage = "No exam found with such id";
      break;
    case "e1105":
      errorMessage = "Unable to delete the batch since students are allocated";
      break;
    case "e1106":
      errorMessage = "No batch found";
      break;
    case "e1107":
      errorMessage = "Exam is not available to edit as it is cancelled or completed";
      break;
    case "e1108":
      errorMessage = "exam or batch not available";
      break;
    case "e1109":
      errorMessage = "Student mapping table not exist";
      break;
    case "e4803":
      errorMessage = "Batch is already closed";
      break;
    case "e1127":
      errorMessage = "A batch with this name already exists for the selected exam. Please choose a different name.";
      break;
    default :
        errorMessage = "Unknown error";
        break;
  }
  return errorMessage;
};
