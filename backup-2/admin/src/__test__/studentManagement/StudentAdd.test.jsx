import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentAdd from "../../pages/admin/studentManagement/StudentAdd.jsx";
import { adminServices } from "../../services/AdminServices";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminCreateStudent: jest.fn(),
    adminDropdownInstitutions: jest.fn(),
    // adminGetExamInstitution: jest.fn(),
  },
}));

jest.mock("../../components/toast/Toast.jsx", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

describe("StudentAdd Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads and submits the form with institution and exam selections", async () => {
    adminServices.adminDropdownInstitutions.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          { id: 1, institution_name: "Institution 1" },
          { id: 2, institution_name: "Institution 2" },
        ],
      },
    });
  
  //   adminServices.adminGetExamInstitution.mockResolvedValueOnce([
  //     {
  //         "id": 1,
  //         "exam_name": "Test examination",
  //         "exam_date": "2024-09-10",
  //         "exam_time": "10:30:00",
  //         "student_status": 1,
  //         "total_questions": 2,
  //         "exam_duration": 60,
  //         "status": 1,
  //         "created_at": "2024-09-09T13:20:51.175210Z",
  //         "updated_at": "2024-09-09T15:45:08.673529Z",
  //         "status_of_exam": 1,
  //         "question_paper_set": true,
  //         "cut_of_mark": null,
  //         "institution": 1
  //     }
  // ]);
  
    adminServices.adminCreateStudent.mockResolvedValueOnce({
      status: 200,
    });
  
    render(<StudentAdd handleClose={jest.fn()} />);
  
    await waitFor(() => expect(adminServices.adminDropdownInstitutions).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("institution")).toBeInTheDocument();
  
  
    fireEvent.click(screen.getByTestId("institution"));
    waitFor(()=>{
      userEvent.selectOptions(screen.getByTestId("institution"), 'Institution 1');
    })
    
  
  
    // await waitFor(() => expect(adminServices.adminGetExamInstitution).toHaveBeenCalled());
    // fireEvent.click(screen.getByTestId("exam"));
    // waitFor(()=>{
    //   userEvent.selectOptions(screen.getByTestId("exam"), "Test examination");
    // })
    
  
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Passout Year"), {
      target: { value: "2024" },
    });
  
    // Submit form
    fireEvent.click(screen.getByText("Add"));
  
    await waitFor(() =>
      expect(adminServices.adminCreateStudent).toHaveBeenCalledWith({
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        institutionId: 1,
        passOutYear: 2024,
      })
    );
  });
  
});
