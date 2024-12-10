import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { studentServices } from "../../services/StudentServices"
const apiEndPoint = process.env.REACT_APP_BASE_URL; 

describe("studentServices", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("send a GET request to validate the student token", async () => {
    const token = "sampleToken";
    const expectedResponse = { data: "success" };

    mock
      .onGet(`${apiEndPoint}student/exam-management/question-paper?token=${token}`)
      .reply(200, expectedResponse);

    const response = await studentServices.studentTokenValidation(token);
    expect(response.data).toEqual(expectedResponse);
  });

  it("handling errors properly", async () => {
    const token = "sampleToken";
    const errorMessage = "Network Error";

    mock
      .onGet(`${apiEndPoint}student/exam-management/question-paper?token=${token}`)
      .networkError();

    try {
      await studentServices.studentTokenValidation(token);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
    }
  });

  it("send a POST request with the correct answer and token", async () => {
    const token = "sampleToken";
    const answer = "sampleAnswer";
    const expectedResponse = { result: "submitted" };

    mock
      .onPost(
        `${apiEndPoint}student/valuation?token=${encodeURIComponent(token)}`
      )
      .reply(200, expectedResponse);

    const response = await studentServices.answerSubmission(token, answer);
    expect(response.data).toEqual(expectedResponse);
  });

  it("handle errors properly", async () => {
    const token = "sampleToken";
    const answer = "sampleAnswer";
    const errorMessage = "Network Error";

    mock
      .onPost(
        `${apiEndPoint}student/valuation?token=${encodeURIComponent(token)}`
      )
      .networkError();

    try {
      await studentServices.answerSubmission(token, answer);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
    }
  });
  it("registers a student successfully", async () => {
    const data = { name: "John Doe", email: "john.doe@example.com" };
    const expectedResponse = { message: "Registration successful" };

    // Mock the API endpoint
    mock.onPost(`${apiEndPoint}student/self-registration`, data).reply(200, expectedResponse);

    // Call the function
    const response = await studentServices.selfRegistration(data);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual(expectedResponse);
  });

  it("verifies a student successfully", async () => {
    const data = { email: "john.doe@example.com", code: "123456" };
    const expectedResponse = { message: "Verification successful" };

    // Mock the API endpoint
    mock.onPost(`${apiEndPoint}student/verification`, data).reply(200, expectedResponse);

    // Call the function
    const response = await studentServices.studentVerification(data);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual(expectedResponse);
  });

  it("fetches student dropdown list successfully", async () => {
    const required = "courses";
    const expectedResponse = { courses: ["MCA", "BCA", "MSc"] };

    // Mock the API endpoint
    mock.onGet(`${apiEndPoint}student/dropdown-list/${required}`).reply(200, expectedResponse);

    // Call the function
    const response = await studentServices.studentDropdownLists(required);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual(expectedResponse);
  });
});
