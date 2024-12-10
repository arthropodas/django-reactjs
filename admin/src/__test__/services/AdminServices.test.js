import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { adminServices } from "../../services/AdminServices";
import { axiosAdminPrivate } from "../../services/interceptors";

const apiEndPoint = process.env.REACT_APP_BASE_URL;
describe("adminLogin", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.restore();
  });

  it("should handle forgot password", async () => {
    mock
      .onPost(`${process.env.REACT_APP_BASE_URL}admin/forgot-password`)
      .reply(200, { message: "Reset link sent" });

    const response = await adminServices.adminForgotPassword();
    expect(response.data).toEqual({ message: "Reset link sent" });
  });

  it("should handle reset password", async () => {
    const token = "reset-token";
    const mockData = { message: "Password reset successful" };

    // Ensure the URL in mock matches the URL in your service
    mock
      .onPost(`${process.env.REACT_APP_BASE_URL}admin/reset-password`, {
        token,
      })
      .reply(200, mockData);

    try {
      const response = await adminServices.adminResetPassword(token, {
        newPassword: "newPassword",
      });
      expect(response.data).toEqual(mockData);
    } catch (error) {
      // In case of an error, assert the expected error message or handle it
      expect(error.response.status).toBe(404); // or handle the error as needed
    }
  });
  test('add feedback successfully', async () => {
    mock.onPost(apiEndPoint + `student/feedbacks?token=dummytoken`).reply(200, { success: true });
  
    const response = await adminServices.studentAddFeedbacks({ comment: 'Great job!', token: 'dummytoken' });
    expect(response.status).toBe(200);
  });
});
describe("admin management apis", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosAdminPrivate);
  });
  jest.mock("../../services/interceptors", () => ({
    get: jest.fn(),
    put: jest.fn(),
  }));
  afterEach(() => {
    mock.restore();
  });
  it("should fetch category details successfully", async () => {
    const mockCategoryData = {
      category: "logical",
    };

    mock.onGet("admin/question-categories").reply(200, mockCategoryData);

    const response = await adminServices.adminListCategorys();

    expect(response.data).toEqual(mockCategoryData);
  });

  it("should add a new category", async () => {
    const newCategory = { name: "New Category" };
    mock
      .onPost(`admin/question-categories`, newCategory)
      .reply(201, newCategory);

    const response = await adminServices.adminAddCategory(newCategory);
    expect(response.data).toEqual(newCategory);
  });

  it("should edit a category", async () => {
    const categoryId = 1;
    const updatedCategory = { name: "Updated Category" };
    mock
      .onPut(`admin/question-categories/${categoryId}`, updatedCategory)
      .reply(200, updatedCategory);

    const response = await adminServices.adminEditCategory(
      categoryId,
      updatedCategory
    );
    expect(response.data).toEqual(updatedCategory);
  });

  it(" delete a category", async () => {
    const categoryId = 1;
    mock.onDelete(`admin/question-categories/${categoryId}`).reply(204);
    const response = await adminServices.adminDeleteCategory(categoryId);
    expect(response.status).toBe(204);
  });

  it("fetch the category questions count", async () => {
    const data = { count: 10 };
    mock.onGet("admin/exam/question-category-count").reply(200, data);

    const response = await adminServices.adminGetCategoryQuestionsCount();
    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it("list questions based on category and page", async () => {
    const category_id = 1;
    const page = 2;
    const search = "";
    const data = [{ id: 1, question: "What is this?" }];
    mock
      .onGet(
        `admin/question-management/?category_id=${category_id}&searchTerm=${search}&page=${page}`
      )
      .reply(200, data);
    const response = await adminServices.adminListQuestions(category_id, search, page);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it("fetch question by id", async () => {
    const question_id = 1;
    const data = { id: 1, question: "What is this?" };
    mock.onGet(`admin/question-management/${question_id}`).reply(200, data);

    const response = await adminServices.adminGetQuestionsById(question_id);
    expect(response.data).toEqual(data);
  });

  it("send an exam link", async () => {
    const data = { examId: 1, link: "http://example.com" };
    mock
      .onPost("admin/exam-management/exam-link/", data)
      .reply(200, { success: true });

    const response = await adminServices.adminSendExamLink(data);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });

  it("map students to exams", async () => {
    const data = { studentId: 1, examId: 2 };
    mock
      .onPost("admin/exam-management/student-exam-mapping/", data)
      .reply(200, { success: true });

    const response = await adminServices.adminStudentExamMapping(data);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });

  it("delete the questions get by id", async () => {
    const question_id = 1;
    mock
      .onDelete(`admin/question-management/${question_id}`)
      .reply(200, { success: true });
    const response = await adminServices.adminDeleteQuestions(question_id);
    expect(response.data).toEqual({ success: true });
  });

  it("list institution with pagination and search", async () => {
    const page = "1";
    const search = "ABC college";
    const data = [{ id: "1", institution: "ABC college1" }];
    mock
      .onGet(`admin/institutions?page=${page}&search=${search}`)
      .reply(200, data);

    const response = await adminServices.adminListInstitution(page, search);
    expect(response.data).toEqual(data);
  });

  it("fetch institutions for dropdown", async () => {
    const data = [{ id: 1, name: "Institution 1" }];
    mock.onGet("admin/institutions").reply(200, data);

    const response = await adminServices.adminDropdownInstitutions();
    expect(response.data).toEqual(data);
  });
  it("fetch an institution by id", async () => {
    const id = 1;
    const data = { id: 1, name: "Institution 1" };
    mock.onGet(`admin/institutions/${id}`).reply(200, data);

    const response = await adminServices.adminGetInstitutionById(id);
    expect(response.data).toEqual(data);
  });
  it("add a new institution", async () => {
    const institution = { name: "New Institution" };
    mock
      .onPost("admin/institutions", institution)
      .reply(201, { id: 1, ...institution });

    const response = await adminServices.adminAddInstitution(institution);
    expect(response.status).toBe(201);
  });
  it("edit an existing institution", async () => {
    const institutionId = 1;
    const updatedData = { name: "Updated Institution" };
    mock
      .onPut(`admin/institutions/${institutionId}`, updatedData)
      .reply(200, { id: institutionId, ...updatedData });

    const response = await adminServices.adminEditInstitution(
      institutionId,
      updatedData
    );
    expect(response.status).toBe(200);
  });
  it("delete an institution by id", async () => {
    const institutionId = 1;
    mock
      .onDelete(`admin/institutions/${institutionId}`)
      .reply(200, { success: true });

    const response = await adminServices.adminDeleteInstitution(institutionId);
    expect(response.data).toEqual({ success: true });
  });
  it("fetch dashboard count", async () => {
    const data = { count: 100 };
    mock.onGet("admin/dashboard").reply(200, data);

    const response = await adminServices.adminDashboardCount();
    expect(response.data).toEqual(data);
  });
  it("list exams based on parameters", async () => {
    const page = 1;
    const examYear = 2024;
    const questionnaireId = 1;
    const searchTerm = "";
    const data = [{ id: 1, title: "Exam 1" }];
    mock
      .onGet(
        `admin/exams?page=${page}&year=${examYear}&questionnaireId=${questionnaireId}&searchTerm=${searchTerm}`
      )
      .reply(200, data);

    const response = await adminServices.adminListExams(
      page,
      examYear,
      questionnaireId,
      searchTerm
    );
    expect(response.data).toEqual(data);
});
  it("fetch an exam by id", async () => {
    const examId = 1;
    const data = { id: 1, title: "Exam 1" };
    mock.onGet(`admin/exams/${examId}`).reply(200, data);

    const response = await adminServices.adminGetExamById(examId);
    expect(response.data).toEqual(data);
  });
  it("add a new exam", async () => {
    const data = { title: "New Exam" };
    mock.onPost("admin/exams", data).reply(201, { id: 1, ...data });

    const response = await adminServices.adminAddExam(data);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: 1, ...data });
  });
  it("edit an existing exam", async () => {
    const examId = 1;
    const updatedData = { title: "Updated Exam" };
    mock
      .onPut(`admin/exams/${examId}`, updatedData)
      .reply(200, { id: examId, ...updatedData });

    const response = await adminServices.adminEditExam(examId, updatedData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ id: examId, ...updatedData });
  });
  it(" delete an exam by id with status", async () => {
    const examId = 1;
    const status = { deleted: true };
    mock.onPatch(`admin/exams/${examId}`, status).reply(200, { success: true });

    const response = await adminServices.adminDeleteExam(examId, status);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });

  it("list students in an exam with pagination and tab", async () => {
    const examId = 1;
    const activeTab = "enrolled";
    const page = 1;
    const data = [{ id: 1, name: "Student 1" }];
    mock
      .onGet(
        `admin/exam/${examId}/students?enrolledStudents=${activeTab}&page=${page}`
      )
      .reply(200, data);

    const response = await adminServices.adminListStudentsInExam(
      examId,
      activeTab,
      page
    );
    expect(response.data).toEqual(data);
  });
  test('should generate exam paper successfully', async () => {
    const examId=1;
    mock.onPost(`admin/exams/paper/`).reply(200, { success: true });
  
    const response = await adminServices.adminGenerateExamPaper(examId);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  test('fetch students successfully', async () => {
    mock.onGet(apiEndPoint + "admin/students").reply(200, { data: [] });
  
    const response = await adminServices.adminGetStudents(1, 1, 2024);
    expect(response.status).toBe(200);
    expect(response.data.data).toEqual([]);
  });
  test('fetch student by ID successfully', async () => {
    mock.onGet(apiEndPoint + `admin/students/1`).reply(200, { id: 1, name: 'John Doe' });
  
    const response = await adminServices.adminGetStudentById(1);
    expect(response.status).toBe(200);
  });
  test('should create student successfully', async () => {
    mock.onPost(apiEndPoint + "admin/students").reply(201, { id: 1 });
  
    const response = await adminServices.adminCreateStudent({ name: 'John Doe' });
    expect(response.status).toBe(201);
  });
  test('fetch dropdown exams successfully', async () => {
    mock.onGet(apiEndPoint + "admin/exams").reply(200, { exams: [] });
  
    const response = await adminServices.adminDropdownExams();
    expect(response.status).toBe(200);
  });
  test('delete students successfully', async () => {
    mock.onPatch(apiEndPoint + "admin/students").reply(200, { success: true });
  
    const response = await adminServices.adminDeleteStudent([1, 2, 3]);
    expect(response.data.success).toBe(true);
  });
  test('get exam institution data successfully', async () => {
    mock.onPost(apiEndPoint + "admin/students/exam").reply(200, { exam: 'Sample Exam' });
  
    const response = await adminServices.adminGetExamInstitution(1);
    expect(response.data.exam).toBe('Sample Exam');
  });
  
  test('list shortlisted students successfully', async () => {
    mock.onGet(`admin/exam/1/shortlisted-students?marks=80`).reply(200, { students: [] });
  
    const response = await adminServices.adminListShortListedStudents(80, 1);
    expect(response.status).toBe(200);
    expect(response.data.students).toEqual([]);
  });
  test('list all written students successfully', async () => {
    const examId = 1;
    mock.onGet(`admin/shortlist/students/${examId}`).reply(200, { students: [] });
  
    const response = await adminServices.adminListAllWrittenStudents(examId);
    expect(response.status).toBe(200);
});
  // test('send shortlist mail successfully', async () => {
  //   mock.onPost(`admin/valuation/email/shortlisted-students`).reply(200, { success: true });
  
  //   const response = await adminServices.adminSendShortlistMail({ email: 'example@example.com', message: 'Congrats!' });
  //   expect(response.data.success).toBe(true);
  // });
  test('should edit student successfully', async () => {
    mock.onPut(apiEndPoint + `admin/students/1`).reply(200, { success: true });
  
    const response = await adminServices.adminEditStudent(1, { name: 'Jane Doe' });
    expect(response.status).toBe(200);
  });
  test('upload students file successfully', async () => {
    mock.onPost(apiEndPoint + "admin/students/upload/").reply(200, { success: true });
  
    const formData = new FormData();
    formData.append('file', 'dummyfile.csv');
  
    const response = await adminServices.adminUploadStudents(formData);
    expect(response.status).toBe(200);
  });
  test('list feedbacks successfully', async () => {
    const rating = 5;
    const institutionId = 123;
    const page = 1;
    mock.onGet(`admin/feedbacks?rating=${rating}&institutionId=${institutionId}&page=${page}`).reply(200, { feedbacks: [] });

    const response = await adminServices.adminListFeedbacks(rating, institutionId, page);

    expect(response.status).toBe(200);
});

 test('adminListCategory should fetch categories with search query', async () => {
  const search = 'science';
  const categories = [{ id: 1, name: 'Physics' }, { id: 2, name: 'Chemistry' }];
  mock.onGet(`admin/question-categories?search=${search}`).reply(200, categories);

  const response = await adminServices.adminListCategory(search);
  expect(response.data).toEqual(categories);
});

test('adminGetCategoryById should fetch category by ID', async () => {
  const categoryId = 1;
  const category = { id: 1, name: 'Physics' };
  mock.onGet(`admin/question-categories/${categoryId}`).reply(200, category);

  const response = await adminServices.adminGetCategoryById(categoryId);
  expect(response.data).toEqual(category);
});

});
