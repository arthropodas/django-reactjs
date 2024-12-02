import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentFeedback from "../../pages/student/studentfeedback/StudentFeedback";
import { adminServices } from "../../services/AdminServices";
import '@testing-library/jest-dom';

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    studentAddFeedbacks: jest.fn(),
  },
}));

jest.mock("../../components/starrating/StarRating", () => ({
  __esModule: true,
  default: ({ rating, setRating }) => (
    <div data-testid="star-rating" onClick={() => setRating(5)}>
      Star Rating: {rating}
    </div>
  ),
}));

describe("StudentFeedback component", () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    localStorage.setItem("token", "mocked-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  it("displays validation errors when form is submitted with invalid data", async () => {
    render(<StudentFeedback handleClose={handleClose} />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText(/Rating is required/i)).toBeInTheDocument();
    });
  });

  it("submits the feedback and navigates to thank you page on success", async () => {
    adminServices.studentAddFeedbacks.mockResolvedValue({ status: 200 });

    render(<StudentFeedback handleClose={handleClose} />);

    const feedbackTextarea = screen.getByPlaceholderText(
      "Enter your feedback here"
    );
    fireEvent.change(feedbackTextarea, {
      target: { value: "Great experience!" },
    });

    const starRating = screen.getByTestId("star-rating");
    fireEvent.click(starRating);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(adminServices.studentAddFeedbacks).toHaveBeenCalledWith({
        comment: "Great experience!",
        rating: 5,
        token: "mocked-token",
      });
    });

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith("/examPortal/thanks");
    });
  });

  it("handles API error correctly", async () => {
    adminServices.studentAddFeedbacks.mockRejectedValue({
      response: { data: { errorCode: "error message" } },
    });

    render(<StudentFeedback handleClose={handleClose} />);

    const feedbackTextarea = screen.getByPlaceholderText(
      "Enter your feedback here"
    );
    fireEvent.change(feedbackTextarea, { target: { value: "Test feedback" } });

    const starRating = screen.getByTestId("star-rating");
    fireEvent.click(starRating);

    fireEvent.click(screen.getByText("Submit"));

    waitFor(() => {
      expect(adminServices.studentAddFeedbacks).toHaveBeenCalled();
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
    });
  });
});
