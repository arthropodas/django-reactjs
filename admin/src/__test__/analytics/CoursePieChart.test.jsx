import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CoursePieChart from "../../pages/admin/analytics/CoursePieChart";
import { adminServices } from "../../services/AdminServices";

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminDashboardCount: jest.fn(),
  },
}));
describe("testing pie chart component", () => {
  test("should rendering initially", () => {
    const mockData = {
      student_passing_rate: {
        "Master of Computer Applications": "71.43%",
        "Bachelor of Computer Applications": "40.00%",
        "Bachelor of Technology in Computer Science and Engineering": "33.33%",
        "Bachelor of Technology in Information Technology": "66.67%",
        "Bachelor of Engineering in Information Technology": "50.00%",
        "Bachelor of Engineering in Computer Science and Engineering": "50.00%",
      },
    };
    adminServices.adminDashboardCount.mockResolvedValueOnce(mockData);
    render(<CoursePieChart />);
  });
});
