import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import DoughnutChart from "../../pages/admin/analytics/DoughNutReChart";
import { adminServices } from "../../services/AdminServices";

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminDashboardCount: jest.fn(),
  },
}));

describe("rendering of doughnut chart", () => {
  test("should render initial content", async () => {
    const mockData = {
        student_shortlist_donut_chart: {
          shortlisted: 8,
          completed: 1,
          terminated: 3,
        },
      };
      adminServices.adminDashboardCount.mockResolvedValueOnce({
        data: mockData,
      });
    render(<DoughnutChart />);

    // Check that the "Shortlist Status" text is present
    expect(screen.getByText("Shortlist Status")).toBeInTheDocument();
  });

  test("should display 'No Data Available' if the data is empty", async () => {
    const emptyData = {
      student_shortlist_donut_chart: {
        shortlisted: 0,
        completed: 0,
        terminated: 0,
      },
    };

    adminServices.adminDashboardCount.mockResolvedValueOnce({
      data: emptyData,
    });

    render(<DoughnutChart />);

    await waitFor(() => {
      expect(adminServices.adminDashboardCount).toHaveBeenCalled();
    });

    expect(screen.getByText("No Data Available...")).toBeInTheDocument();
  });

  test("should handle error correctly", async () => {
    adminServices.adminDashboardCount.mockRejectedValueOnce(new Error("Failed to load"));

    render(<DoughnutChart />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });
  });
});