import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ExamPercentage from "../../pages/admin/analytics/ExamPercentage";
import { MemoryRouter } from "react-router-dom";
import { adminServices } from "../../services/AdminServices";

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminExamAnalytics: jest.fn(),
  },
}));

describe("rendering the exam percentage component", () => {
  const mockData = {
    results: [
      {
        exam_id: 1,
        exam_name: "Placement 2025",
        average_score: 12.5,
        average_rating: 3.0,
        success_rate: "100.0%",
        failure_rate: "0.0%",
        termination_rate: "0.0%",
        total_students: 2,
      },
      {
        exam_id: 2,
        exam_name: "Test examination",
        average_score: 11.5,
        average_rating: 3.5,
        success_rate: "100.0%",
        failure_rate: "0.0%",
        termination_rate: "0.0%",
        total_students: 2,
      },
    ],
  };
  test("should first rendering", () => {
    adminServices.adminExamAnalytics.mockResolvedValueOnce(mockData);
    render(
      <MemoryRouter>
        <ExamPercentage />
      </MemoryRouter>
    );
    expect(screen.getByText("Exam Analytics")).toBeInTheDocument();
  });
});
