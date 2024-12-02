import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StudentDetail from "../../pages/admin/studentManagement/StudentDetail.jsx";
import { adminServices } from "../../services/AdminServices.js";
import "@testing-library/jest-dom";

jest.mock("../../services/AdminServices.js");

describe("StudentDetail Component", () => {
  const mockStudentData = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    passOutYear: "2023",
    institution: { id: "10", institution_name: "XYZ University" },
    exam: { id: "5", exam_name: "Final Exam" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component", () => {
    render(<StudentDetail userId="1" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays loading spinner when loading", async () => {
    adminServices.adminGetStudentById.mockResolvedValueOnce({
      status: 200,
      data: mockStudentData,
    });

    render(<StudentDetail userId="1" />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
