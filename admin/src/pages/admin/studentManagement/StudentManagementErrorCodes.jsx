export const StudentManagementErrorCodes = (errorCode) => {
  let errorMessage = "";

  switch (errorCode) {
    case "e2002":
      errorMessage = "Invalid email";
      break;
    case "e2016":
      errorMessage = "Name is required";
      break;
    case "e2017":
      errorMessage = "Invalid name";
      break;

    case "e2018":
      errorMessage = "Phone number is required";
      break;
    case "e2019":
      errorMessage = "Invalid phone number";
      break;
    case "e2020":
      errorMessage = "passout year is required";
      break;
    case "e2021":
      errorMessage = "Invalid passout year";
      break;
    case "e2022":
      errorMessage = "Email already exists";
      break;
    case "e2025":
      errorMessage = "Exam not found";
      break;
    case "e2026":
      errorMessage = "Instiution id is required";
      break;
    case "e2027":
      errorMessage = "Invalid institutionId";
      break;
    case "e2028":
      errorMessage = "Institution not found";
      break;
    case "e2029":
      errorMessage = "Student not found";
      break;
    case "e2030":
      errorMessage = "Phone number is required";
      break;
    case "e2031":
      errorMessage = "Invalid student id";
      break;
    case "e2032":
      errorMessage = "Invalid page size";
      break;
    case "e2034":
      errorMessage = "Invalid file format";
      break;
    case "e2035":
      errorMessage = "CSV file is empty";
      break;
    case "e2036":
      errorMessage = "No columns found in csv file";
      break;
    case "e2037":
      errorMessage = "Please ensure the CSV file is properly formatted and try again";
      break;
    case "e2038":
      errorMessage = "No data found in the CSV file";
      break;
    case "e2039":
      errorMessage = "CSV file exceeds the maximum limit size";
      break;
    case "e2040":
      errorMessage = "name length is too short";
      break;
    case "e2041":
      errorMessage = "name length is too long";
      break;
    case "e2043":
      errorMessage = "exam id is required";
      break;
    case "e2046":
      errorMessage = "csv row data is null";
      break;
    case "e2051":
      errorMessage = "Student data was only partially uploaded";
      break;
    case "e2050":
      errorMessage = "invalid data in csv file";
      break;
    case "e2101":
      errorMessage = "cgpa is required";
      break;
    case "e2102":
      errorMessage = "number of backlogs is required";
      break;
    case "e2103":
      errorMessage = "invalid cgpa";
      break;
    case "e2104":
      errorMessage = "invalid number of backlogs";
      break;
    case "e2300":
      errorMessage = "course id is required";
      break;
    case "e2301":
        errorMessage = "Invalid course id.";
        break;
    case "e2302":
        errorMessage = "Invalid course";
        break;
    default:
      errorMessage = "Unknown error occurred";
      break;

  }
  return errorMessage;
};
