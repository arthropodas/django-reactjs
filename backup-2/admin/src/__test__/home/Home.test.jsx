import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Home from "../../pages/admin/home/Home";
import { adminServices } from "../../services/AdminServices";

// Mocking the adminServices
jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminDashboardCount: jest.fn(),
  },
}));

describe("Home component tests", () => {
  beforeEach(() => {
    adminServices.adminDashboardCount.mockResolvedValue({
      data: {
        question_category_count: 5,
        question_count: 10,
        institution_count: 3,
        student_count: 100,
        exam_count: 15,
        feedback_count: 7,
      },
    });
  });

  test("renders correct counts", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });
  });
});
