import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import ReChart from "../../pages/admin/analytics/ReChart";
import { adminServices } from "../../services/AdminServices";

jest.mock("../../services/AdminServices", () => ({
  adminServices: { adminBarGraph: jest.fn() },
}));

describe("rendering of bar graph component", () => {
  const mockData = {
    status: 200,
    data: {
      student_institution_graph: [
        {
          collegeName: "Ilahia College of Engineering, Muvatupuzha",
          numberOfShortlistedStudents: 1,
        },
        {
          collegeName: "KMEA college of engineering, Kuzhivelippady",
          numberOfShortlistedStudents: 2,
        },
        {
          collegeName: "Nirmala College of Atrs and Science, Muvattupuzha",
          numberOfShortlistedStudents: 2,
        },
      ],
    },
  };
  test("intial rendering", () => {
    adminServices.adminBarGraph.mockResolvedValueOnce(mockData);
    render(<ReChart />);
    expect(screen.getByText(/YearWise Data/i)).toBeInTheDocument();
  });
});
