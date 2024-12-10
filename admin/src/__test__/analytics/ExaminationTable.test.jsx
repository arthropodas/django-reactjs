import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExaminationTable from "../../pages/admin/analytics/ExaminationTable";
import { MemoryRouter } from "react-router-dom";
import { adminServices } from "../../services/AdminServices";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminExamQuestionnaireAnalytics: jest.fn(),
  },
}));

describe("rendering of ExaminationTable component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    const { useNavigate } = require("react-router-dom");
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to the correct page when the arrow button is clicked", () => {
    const mockExamData = { latest_exam_details: [{ id: 1, name: "Test Exam" }] };

    adminServices.adminExamQuestionnaireAnalytics.mockResolvedValue({
      data: mockExamData,
    });
    render(
      <MemoryRouter>
        <ExaminationTable />
      </MemoryRouter>
    );

    const arrowButton = screen.getByLabelText("view more");
    expect(arrowButton).toBeInTheDocument();

    fireEvent.click(arrowButton);
    waitFor(()=>{
      expect(mockNavigate).toHaveBeenCalledWith("examsList"); // Update "examsList" based on your routing logic
    })
  });

  test("fetches table data from API and sets it", async () => {
    const mockExamData = { latest_exam_details: [{ id: 1, name: "Test Exam" }] };

    adminServices.adminExamQuestionnaireAnalytics.mockResolvedValue({
      data: mockExamData,
    });

    render(
      <MemoryRouter>
        <ExaminationTable />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminExamQuestionnaireAnalytics).toHaveBeenCalled();
    });
  });

  test("handles API errors gracefully", async () => {
    adminServices.adminExamQuestionnaireAnalytics.mockRejectedValue(
      new Error("API Error")
    );

    render(
      <MemoryRouter>
        <ExaminationTable />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminExamQuestionnaireAnalytics).toHaveBeenCalled();
      expect(screen.queryByText("Test Exam")).not.toBeInTheDocument();
    });
  });
});
