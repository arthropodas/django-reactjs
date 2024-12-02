import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExamTerminationPage from "../../pages/student/thankspage/ExamTerminationPage";
import '@testing-library/jest-dom';

jest.mock("../../components/modal/PaperModal", () => jest.fn(({ open, handleClose, children }) => (
    open ? <div data-testid="paper-modal">{children}<button onClick={handleClose} data-testid="close-modal-button">Close</button></div> : null
  )));
  
  jest.mock("../../pages/student/studentfeedback/StudentFeedback", () => jest.fn(({ handleClose }) => (
    <div data-testid="student-feedback">Feedback Form</div>
  )));
jest.mock("../../assets/termination.png", () => "termination.png");

describe("ExamTerminationPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders the termination message and image", () => {
    render(<ExamTerminationPage />);
    expect(screen.getByText(/Sorry, You are terminated from the exam/i)).toBeInTheDocument();
    expect(screen.getByAltText(/exam submission/i)).toBeInTheDocument();
  });

  test("opens the feedback modal if token is present in localStorage", () => {
    localStorage.setItem("token", "some-token");
    render(<ExamTerminationPage />);
    
    const modal = screen.getByTestId("paper-modal");
    expect(modal).toBeInTheDocument();
    
    const feedbackForm = screen.getByTestId("student-feedback");
    expect(feedbackForm).toBeInTheDocument();
  });

  test("closes the feedback modal when handleClose is called", () => {
    localStorage.setItem("token", "some-token");
    render(<ExamTerminationPage />);
    
    expect(screen.getByTestId("paper-modal")).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("close-modal-button"));
    expect(screen.queryByTestId("paper-modal")).not.toBeInTheDocument();
  });

  test("does not open the feedback modal if token is not present in localStorage", () => {
    render(<ExamTerminationPage />);
    
    expect(screen.queryByTestId("paper-modal")).not.toBeInTheDocument();
  });
});
