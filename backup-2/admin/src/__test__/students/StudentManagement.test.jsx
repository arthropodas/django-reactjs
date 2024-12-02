import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentManagement from "../../pages/admin/studentManagement/StudentManagement";
import { adminServices } from "../../services/AdminServices";
import "@testing-library/jest-dom";
import { StudentManagementErrorCodes } from "../../pages/admin/studentManagement/StudentManagementErrorCodes";

jest.mock("../../services/AdminServices");
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));
jest.mock("../../components/modal/CommonModal");

describe("StudentManagement Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render Student Management header", () => {
    render(<StudentManagement />);
    waitFor(()=>{
      const addStudentButton=screen.getByText(/\+ Add Students/i)
      const filterButton=screen.getByTestId('filter-button');
      expect(addStudentButton).toBeInTheDocument();
      expect(filterButton).toBeInTheDocument();
      fireEvent.click(addStudentButton);
      fireEvent.click(filterButton);
    })    
  });

  test("should fetch and render student data", async () => {
    const mockStudents = {
      status: 200,
      data: {
        results: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            pass_out_year: 2023,
            institution: { institution_name: "ABC University" },
          },
        ],
        count: 10,
      },
    };

    adminServices.adminGetStudents.mockResolvedValue(mockStudents);

    render(<StudentManagement />);

    expect(adminServices.adminGetStudents).toHaveBeenCalled();

    await waitFor(() => {
      const studentName = screen.getByText("John Doe");
      expect(studentName).toBeInTheDocument();
      const firstButton = screen.getByTitle('First');
      fireEvent.click(firstButton);
      const lastButton = screen.getByTitle('Last');
      fireEvent.click(lastButton);
      const nextButton = screen.getByTitle('Next');
      fireEvent.click(nextButton);
      const prevButton = screen.getByTitle('Next');
      fireEvent.click(prevButton);
    });
    const detailButton=screen.getByTitle('View Detail');
    fireEvent.click(detailButton);
  });
  test('enables "Bulk delete" button when click on checkboxes', async () => {
    const mockStudents = {
      status: 200,
      data: {
        results: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            pass_out_year: 2023,
            institution: { institution_name: "ABC University" },
          },
        ],
        count: 1,
      },
    };

    adminServices.adminGetStudents.mockResolvedValue(mockStudents);

    render(<StudentManagement />);

    expect(adminServices.adminGetStudents).toHaveBeenCalled();
    adminServices.adminDeleteStudent.mockResolvedValueOnce({
          status: 200,
        });
    await waitFor(() => {
      const studentName = screen.getByText("John Doe");
      expect(studentName).toBeInTheDocument();
    });
    const checkbox = screen.getByRole("checkbox", { name: "Select 1" });
    fireEvent.click(checkbox);

    const bulkDeleteButton = screen.getByText("Bulk Delete");
    expect(bulkDeleteButton).not.toBeDisabled();
    fireEvent.click(bulkDeleteButton);

    
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete the Students?')).toBeInTheDocument();
    const submitButton = screen.getByTestId("confirm");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminDeleteStudent).toHaveBeenCalledWith([1]);
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
  });
  test("opens the Edit Modal, fetches student details, and submits", async () => {
    const mockStudents = {
      status: 200,
      data: {
        results: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            pass_out_year: 2023,
            institution: { institution_name: "ABC University" },
          },
        ],
        count: 1,
      },
    };
    adminServices.adminEditStudent.mockResolvedValue(mockStudents);

    adminServices.adminGetStudents.mockResolvedValue(mockStudents);

    render(<StudentManagement />);

    expect(adminServices.adminGetStudents).toHaveBeenCalled();

    await waitFor(() => {
      const studentName = screen.getByText("John Doe");
      expect(studentName).toBeInTheDocument();
    });
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(adminServices.adminGetStudentById).toHaveBeenCalledWith(1);
      
    });
    waitFor(()=>{
      expect(screen.getByText("Edit Student Details")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Emy")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1234567654")).toBeInTheDocument();
      expect(screen.getByDisplayValue("xyzsdfg@gmail.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024")).toBeInTheDocument();
      const submitButton = screen.getByTestId("submit");
      fireEvent.click(submitButton);
      expect(adminServices.adminEditStudent).toHaveBeenCalledWith(1, {
        "name": "sdfsdrfds",
        "phone": "2123456789",
        "email": "selin.basil@qwinnovaturelabs.com",
        "passOutYear": 2023
    })
    });
  });

  test('delete student from the list',async()=>{
    adminServices.adminGetStudents.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            pass_out_year: 2023,
            institution: { institution_name: "ABC University" },
          },
        ],
        count: 1,
      },
    });
    render(<StudentManagement/>);
    adminServices.adminDeleteStudent.mockResolvedValueOnce({
      status: 200,
    });
    await waitFor(() => {
      expect(adminServices.adminGetStudents).toHaveBeenCalled();
      const addButton = screen.getByTitle('Delete');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete the Student?')).toBeInTheDocument();
    const submitButton = screen.getByTestId("confirm");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminDeleteStudent).toHaveBeenCalledWith([1]);
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
  })

});
