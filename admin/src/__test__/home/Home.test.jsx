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
        "shortlisted_student_count": 5,
        "institution_count": 5,
        "total_students": 19,
        "questionnaire_count": 3
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
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("19")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
