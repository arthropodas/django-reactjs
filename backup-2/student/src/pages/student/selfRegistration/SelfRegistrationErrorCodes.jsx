
const selfRegistrationErrorCodes = (errorCode) => {
        let errorMessage = "";


        switch (errorCode) {
                case "e1110":
                        errorMessage = "No batch id";
                        break;
                case "e1111":
                        errorMessage = "Batch code you entered isn’t valid. ";
                        break;
                case "e1112":
                        errorMessage = "No student found";
                        break;
                case "e1113":
                        errorMessage = "No batch found";
                        break;
                // Student is already mapped with an exam
                case "e1114":
                        errorMessage = "You’re already enrolled in this exam. If you need assistance, please let us know!";
                        break;
                case "e1117":
                        errorMessage = "Please ensure that there is a valid exam which is started";
                        break;
                case "e2022":
                        errorMessage = "Email already registered";
                        break;

                case "e2040":
                        errorMessage = "Name length is too short";
                        break;
                case "e2041":
                        errorMessage = "Name length is too long";
                        break;
                case "e2017":
                        errorMessage = "Invalid name";
                        break;
                case "e2016":
                        errorMessage = "Name is required";
                        break;

                case "e2000":
                        errorMessage = "Email is required";
                        break;

                case "e2094":
                        errorMessage = "Email is too long";
                        break;
                case "e2002":
                        errorMessage = "Invalid email";
                        break;
                case "e2019":
                        errorMessage = "Invalid phone number";
                        break;
                case "e2020":
                        errorMessage = "Passout year is required";
                        break;
                case "e2021":
                        errorMessage = "Invalid passout year";
                        break;
                case "e2028":
                        errorMessage = "Institution not found";
                        break;
                case "e2103":
                        errorMessage = "Invalid cgpa";
                        break;
                case "e2104":
                        errorMessage = "Invalid number of backlogs";
                        break;
                default:
                        errorMessage = "Something went wrong. Please contact support.";
                        break;
        }

        return errorMessage;
};

export default selfRegistrationErrorCodes;