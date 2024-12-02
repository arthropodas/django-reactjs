import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import FeedbackManagement from "../../pages/admin/feedback/FeedbackManagement";
import { adminServices } from "../../services/AdminServices";
import "@testing-library/jest-dom"; // for better assertions
import { useBreakpointValue } from "@chakra-ui/react";
import adminFeedbackErrorCodes from "../../pages/admin/feedback/FeedbackManagementErrorCodes";

// Mocking the necessary modules
jest.mock("../../services/AdminServices");
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

jest.mock("../../pages/admin/feedback/FeedbackManagementErrorCodes");

describe("FeedbackManagement", () => {
  const mockFeedbacks = {
    status: 200,
    data: {
      results: [
        { 
          id: 1, 
          student: { name: "John Doe", institution: { institution_name: "ABC" } },
          comment: "Great course!", 
          rating: 5 
        },
        { 
          id: 2, 
          student: { name: "Jane Smith", institution: { institution_name: "ABC" } },
          comment: "Very informative.", 
          rating: 4 
        },
      ],
      count: 10,
    },
  };

  beforeEach(() => {
    useBreakpointValue.mockReturnValue("md"); // Returning a default value for the test
  });

  it("renders feedbacks correctly", async () => {
    adminServices.adminListFeedbacks.mockResolvedValue(mockFeedbacks);

    render(<FeedbackManagement />);

    await waitFor(() => {
      expect(screen.getByText("Feedbacks")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Great course!")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Very informative.")).toBeInTheDocument();
      const firstButton = screen.getByTitle('First');
      fireEvent.click(firstButton);
      const lastButton = screen.getByTitle('Last');
      fireEvent.click(lastButton);
      const nextButton = screen.getByTitle('Next');
      fireEvent.click(nextButton);
      const prevButton = screen.getByTitle('Next');
      fireEvent.click(prevButton);
    });
  });

  it("displays an error message when the API call fails", async () => {
    const errorMessage = "Something went wrong.";
    adminServices.adminListFeedbacks.mockRejectedValue({
      response: {
        data: {
          errorCode: "SOME_ERROR_CODE",
        },
      },
    });

    adminFeedbackErrorCodes.mockReturnValue(errorMessage);

    render(<FeedbackManagement />);

    await waitFor(() => {
      expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    });
  });
  
});
