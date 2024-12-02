import axios from "axios";
import { axiosAdminPrivate } from "./interceptors";
const apiEndPoint = process.env.REACT_APP_BASE_URL;



const adminLogin = (data) => {
  return axiosAdminPrivate.post(`admin/auth/login`, { "token": data });
};

const adminForgotPassword = () => {
  return axios.post(apiEndPoint + "admin/forgot-password");
};

const adminResetPassword = (token, data) => {
  return axios.post(
    apiEndPoint + `admin/reset-password?token=${encodeURIComponent(token)}`,
    data
  );
};

const adminListCategory = (search) => {
  return axiosAdminPrivate.get(`admin/question-categories?search=${search}`);
};

const adminListCategorys = () => {
  return axiosAdminPrivate.get(`admin/question-categories`);
};

const adminGetCategoryById = (categoryId) => {
  return axiosAdminPrivate.get(`admin/question-categories/${categoryId}`);
};

const adminAddCategory = (category) => {
  return axiosAdminPrivate.post(`admin/question-categories`, category);
};

const adminEditCategory = (categoryId, data) => {
  return axiosAdminPrivate.put(`admin/question-categories/${categoryId}`, data);
};

const adminDeleteCategory = (categoryId) => {
  return axiosAdminPrivate.delete(`admin/question-categories/${categoryId}`);
};

const adminGetCategoryQuestionsCount = () => {
  return axiosAdminPrivate.get("admin/exam/question-category-count");
};

const adminListQuestions = (category_id, search, page ) => {
  return axiosAdminPrivate.get(`admin/question-management/?category_id=${category_id}&searchTerm=${search}&page=${page}`);
};

const adminGetQuestionsById = (question_id) => {
  return axiosAdminPrivate.get(`admin/question-management/${question_id}`);
};

const adminAddQuestions = (question) => {
  return axiosAdminPrivate.post(`admin/question-management/`, question, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const adminAddBulkQuestions = (questionFile) => {
  return axiosAdminPrivate.post(`admin/question-management/bulk-upload`, questionFile, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const adminEditQuestions = (question_id, question) => {
  return axiosAdminPrivate.put(
    `admin/question-management/${question_id}`, question, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  );
};

const adminSendExamLink = (data) => {
  return axiosAdminPrivate.post(`admin/exam-management/exam-link/`, data);
};
const adminStudentExamMapping = (data) => {
  return axiosAdminPrivate.post(
    `admin/exam-management/student-exam-mapping/`,
    data
  );
};
const adminDeleteQuestions = (question_id) => {
  return axiosAdminPrivate.delete(`admin/question-management/${question_id}`);
};

const adminListInstitution = (page, search) => {
  return axiosAdminPrivate.get(
    `admin/institutions?page=${page}&search=${search}`
  );
};

const adminDropdownInstitutions = () => {
  return axiosAdminPrivate.get(`admin/institutions`);
};

const adminGetInstitutionById = (id) => {
  return axiosAdminPrivate.get(`admin/institutions/${id}`);
};

const adminAddInstitution = (institution) => {
  return axiosAdminPrivate.post(`admin/institutions`, institution);
};

const adminEditInstitution = (institutionId, updatedData) => {
  return axiosAdminPrivate.put(
    `admin/institutions/${institutionId}`,
    updatedData
  );
};

const adminDeleteInstitution = (institutionId) => {
  return axiosAdminPrivate.delete(`admin/institutions/${institutionId}`);
};

const adminDashboardCount = () => {
  return axiosAdminPrivate.get("admin/dashboard");
};

const adminListExams = (page, examYear, questionnaireId, search) => {
  return axiosAdminPrivate.get(
    `admin/exams?page=${page}&year=${examYear}&questionnaireId=${questionnaireId}&searchTerm=${search}`
  );
};

const adminGetExamById = (examId) => {
  return axiosAdminPrivate.get(`admin/exams/${examId}`);
};

const adminAddExam = (data) => {
  return axiosAdminPrivate.post(`admin/exams`, data);
};

const adminEditExam = (examId, updatedData) => {
  return axiosAdminPrivate.put(`admin/exams/${examId}`, updatedData);
};

const adminDeleteExam = (examId, status) => {
  return axiosAdminPrivate.patch(`admin/exams/${examId}`, status);
};

const adminForceCompleteExam = (examId, status) => {
  return axiosAdminPrivate.patch(`admin/exams/${examId}?forceDelete=true`, status);
};

const adminListStudentsInExam = (examId, activeTab, page) => {
  return axiosAdminPrivate.get(
    `admin/exam/${examId}/students?enrolledStudents=${activeTab}&page=${page}`
  );
};

const adminGenerateExamPaper = (examId) => {
  const data = {
    examId: examId,
  };
  return axiosAdminPrivate.post(`/admin/exams/paper/`, data);
};


const adminGetStudents = (page, institutionId, passOutYear, search) => {
  return axiosAdminPrivate.get(apiEndPoint + "admin/students", {
    params: {
      institutionId: institutionId,
      passOutYear: passOutYear,
      page: page,
      searchTerm : search
    },
  });
};

const adminGetStudentById = (id) => {
  return axiosAdminPrivate.get(apiEndPoint + `admin/students/${id}`);
};

const adminCreateStudent = (data) => {
  return axiosAdminPrivate.post(apiEndPoint + "admin/students", data);
};

const adminDropdownExams = () => {
  return axiosAdminPrivate.get(apiEndPoint + "admin/exams");
};

const adminDeleteStudent = (studentList) => {
  const formattedData = {
    student_ids: studentList,
  };

  return axiosAdminPrivate.patch(apiEndPoint + "admin/students", formattedData);
};

const adminGetExamInstitution = (institutionId) => {
  const data = {
    institutionId: institutionId,
  };

  return axiosAdminPrivate.post(apiEndPoint + "admin/students/exam", data);
};

const adminListShortListedStudents = (mark, examId) => {
  return axiosAdminPrivate.get(
    `admin/exam/${examId}/shortlisted-students?marks=${mark}`
  );
};

const adminListAllWrittenStudents = (examId) => {
  return axiosAdminPrivate.get(
    `admin/shortlist/students/${examId}`
  );
};

const adminSendShortlist = (examId, data) => {
  return axiosAdminPrivate.post(
    `admin/shortlist/students/${examId}`, data
  );
};

const adminEditStudent = (id, data) => {
  const userId = Number(id);
  return axiosAdminPrivate.put(apiEndPoint + `admin/students/${userId}`, data);
};

const adminUploadStudents = (formData) => {
  return axiosAdminPrivate.post(
    apiEndPoint + "admin/students/upload/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const adminListFeedbacks = (rating,institutionId, page) => {
  return axiosAdminPrivate.get(`admin/feedbacks?rating=${rating}&institutionId=${institutionId}&page=${page}`);
};

const studentAddFeedbacks = ({ comment, rating, token }) => {
  return axios.post(apiEndPoint + `student/feedbacks?token=${token}`, {
    comment, rating
  });
};

const dropdownLists = (required) => {
  return axiosAdminPrivate.get(`admin/dropdown-list/${required}`);
};

const questionnaireLists = () => {
  return axiosAdminPrivate.get('admin/questionnaire');
}

const adminQuestionnaireLists = (searchTerm,year, page) => {
  return axiosAdminPrivate.get(`admin/questionnaire?searchTerm=${searchTerm}&year=${year}&page=${page}`);
};

const adminQuestionnaireAddPreviewQuestions = (data) => {
  return axiosAdminPrivate.post(`admin/questionnaire/preview`, data);
};

const adminQuestionnaireCreate = (data) => {
  return axiosAdminPrivate.post(`admin/questionnaire`, data);
};

const adminBatchCreation = (data) => {
  return axiosAdminPrivate.post(`admin/batch`, data);
}

const adminBatchDeleteById = (batchId) => {
  return axiosAdminPrivate.delete(`admin/batch/${batchId}`);
}

const adminBatchStudents = (batchId,search) => {
  return axiosAdminPrivate.get(`admin/batch/${batchId}/student?search=${search}`);
}

const adminBatchDeleteStudents = (batchId, studentId) => {
  return axiosAdminPrivate.delete(`admin/batch/${batchId}/student?studentId=${studentId}`);
};

const adminStudentStatusChange = (batchId, studentId) => {
  return axiosAdminPrivate.patch(`admin/batch/${batchId}/student?studentId=${studentId}`);
};

const adminBatchClose = (batchId, status) => {
  return axiosAdminPrivate.patch(`admin/batch/${batchId}`, status);
};

const adminQuestionnaireDetailView = (id) => {
  return axiosAdminPrivate.get(`admin/questionnaire/details/${id}`);
};

const adminQuestionnaireEditPreviewView = (id) => {
  return axiosAdminPrivate.get(`admin/questionnaire/${id}`);
};

const adminQuestionnaireUpdate = (id, data) => {
  return axiosAdminPrivate.put(`admin/questionnaire/${id}`, data);
};

const adminQuestionnaireDelete = (id) => {
  return axiosAdminPrivate.patch(`admin/questionnaire/${id}`);
};

const adminStudentResponseSummary = (studentId, batchId) => {
  return axiosAdminPrivate.get(`admin/student-response?studentId=${studentId}&batchId=${batchId}`);
};

const adminBatchStudentDetails = (examId) => {
  return axiosAdminPrivate.get(`admin/exam/${examId}/count-students`)
}

const adminShortlistCriteria = (examId) => {
  return axiosAdminPrivate.get(`admin/shortlist/exam/criteria/${examId}`);
};

const adminDownloadExamReport = (examId) => {
  return axiosAdminPrivate.get(`admin/exam-report/${examId}`);
 };
 

const adminServices = {
  adminLogin,
  adminListCategory,
  adminEditCategory,
  adminAddCategory,
  adminDeleteCategory,
  adminListCategorys,
  adminGetCategoryQuestionsCount,
  adminListQuestions,
  adminGetCategoryById,
  adminGetQuestionsById,
  adminAddQuestions,
  adminAddBulkQuestions,
  adminEditQuestions,
  adminDeleteQuestions,
  adminCreateStudent,
  adminListInstitution,
  adminDropdownInstitutions,
  adminGetInstitutionById,
  adminAddInstitution,
  adminEditInstitution,
  adminDeleteInstitution,
  adminDashboardCount,
  adminListExams,
  adminAddExam,
  adminDeleteExam,
  adminForceCompleteExam,
  adminEditExam,
  adminListAllWrittenStudents,
  adminGetExamById,
  adminGenerateExamPaper,
  adminListStudentsInExam,
  adminForgotPassword,
  adminResetPassword,
  adminListFeedbacks,
  studentAddFeedbacks,
  adminListShortListedStudents,
  adminSendShortlist,
  adminSendExamLink,
  adminStudentExamMapping,
  adminUploadStudents,
  adminGetStudentById,
  adminDeleteStudent,
  adminEditStudent,
  adminGetStudents,
  adminGetExamInstitution,
  adminDropdownExams,
  dropdownLists,
  questionnaireLists,
  adminQuestionnaireLists,
  adminQuestionnaireAddPreviewQuestions,
  adminQuestionnaireCreate,
  adminQuestionnaireDelete,
  adminBatchCreation,
  adminBatchDeleteById,
  adminBatchStudents,
  adminBatchDeleteStudents,
  adminStudentStatusChange,
  adminBatchClose,
  adminQuestionnaireDetailView,
  adminQuestionnaireEditPreviewView,
  adminQuestionnaireUpdate,
  adminStudentResponseSummary,
  adminBatchStudentDetails,
  adminShortlistCriteria,
  adminDownloadExamReport
};

export { adminServices };
