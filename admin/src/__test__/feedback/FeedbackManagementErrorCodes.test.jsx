import adminFeedbackErrorCodes from "../../pages/admin/feedback/FeedbackManagementErrorCodes";

describe("adminFeedbackErrorCodes", () => {
  test("rendering the errocodes in feedback", () => {
    expect(adminFeedbackErrorCodes("e1068")).toBe("Token is required");
    expect(adminFeedbackErrorCodes("e1069")).toBe("Token is invalid");
    expect(adminFeedbackErrorCodes("e1070")).toBe("Comment is required");
    expect(adminFeedbackErrorCodes("e1071")).toBe("Invalid comment");
    expect(adminFeedbackErrorCodes("e1072")).toBe(
      "The comment should be greater than 3 characters"
    );
    expect(adminFeedbackErrorCodes("e1073")).toBe(
      "The comment should be less than 1000 characters"
    );
    expect(adminFeedbackErrorCodes("e1074")).toBe(
      "Do not add blank spaces as the first and last characters"
    );
    expect(adminFeedbackErrorCodes("e1075")).toBe(
      "The student does not have a completed exam"
    );
    expect(adminFeedbackErrorCodes("e1076")).toBe("Token is incorrect");
    expect(adminFeedbackErrorCodes("unknownCode")).toBe(
      "Unknown error occurred"
    );
  });
});
