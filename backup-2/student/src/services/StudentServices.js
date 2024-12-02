import axios from "axios";

const apiEndPoint = process.env.REACT_APP_BASE_URL;

const studentTokenValidation = (token) => {
    return axios.get(apiEndPoint + `student/exam-management/question-paper?token=${token}`);
};

const answerSubmission = (token, answer) => {
    return axios.post(apiEndPoint + `student/valuation?token=${encodeURIComponent(token)}`, answer)
};

const selfRegistration = (data) => {
    return axios.post(apiEndPoint + `student/self-registration`,data)
};

const studentVerification = (data) => {
    return axios.post(apiEndPoint + `student/verification`,data)
};
const studentDropdownLists = (required) => {
    return axios.get(apiEndPoint +`student/dropdown-list/${required}`);
  };

const studentServices = {
    studentTokenValidation,
    answerSubmission,
    selfRegistration,
    studentVerification,
    studentDropdownLists
};

export { studentServices };