import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentAdd from "../../pages/admin/studentManagement/StudentAdd.jsx";
import { adminServices } from "../../services/AdminServices";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { courses } from "../../utils/Strings.js";

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminCreateStudent: jest.fn(),
    dropdownLists: jest.fn(),
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

  test("loads and submits the form with institution and course selections", async () => {
    // Mock API responses
    adminServices.dropdownLists.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, institution_name: "Institution 1" },
        { id: 2, institution_name: "Institution 2" },
      ],
    });

    adminServices.adminCreateStudent.mockResolvedValueOnce({
      status: 200,
    });

    render(<StudentAdd handleClose={jest.fn()} />);

    // Wait for the institution dropdown to be populated
    await waitFor(() => expect(adminServices.dropdownLists).toHaveBeenCalledTimes(1));
    // expect(screen.getByTestId("institution")).toBeInTheDocument();
    
    const name = screen.getByPlaceholderText('Name');
    fireEvent.change(name, { target: { value: "John Doe" }, });
   
    const number = screen.getByPlaceholderText('Phone');
    fireEvent.change(number, { target: { value: "1234567890" }, });

    
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Passout Year"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mark in CGPA"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByPlaceholderText("No.of Backlogs"), {
      target: { value: "0" },
    });
 // // Select an institution from the dropdown
    fireEvent.click(screen.getByTestId("institution"));
    fireEvent.click(screen.getByText("Institution 1"));


    expect(screen.getByTestId("course")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("course"));
    fireEvent.click(screen.getByText("Master of Computer Science"));

    // Submit the form
    fireEvent.click(screen.getByTitle("Add"));

    // Wait for the adminCreateStudent API call to be made with the correct data
    await waitFor(() => 
      expect(adminServices.adminCreateStudent).toHaveBeenCalled());
  });


  test("loads and submits fails the form with institution ", async () => {
    // Mock API responses
    adminServices.dropdownLists.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1022", "errorMsg": "No institute" },
    });

    adminServices.adminCreateStudent.mockResolvedValueOnce({
      status: 200,
    });

    render(<StudentAdd handleClose={jest.fn()} />);

    // Wait for the institution dropdown to be populated
    await waitFor(() => expect(adminServices.dropdownLists).toHaveBeenCalledTimes(1));
    
  });

  test("loads and submits fails the form ", async () => {
    // Mock API responses
    adminServices.dropdownLists.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, institution_name: "Institution 1" },
        { id: 2, institution_name: "Institution 2" },
      ],
    });

    adminServices.adminCreateStudent.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "1222", "errorMsg": "No institute" },
    });

    render(<StudentAdd handleClose={jest.fn()} />);

    // Wait for the institution dropdown to be populated
    await waitFor(() => expect(adminServices.dropdownLists).toHaveBeenCalledTimes(1));
    // expect(screen.getByTestId("institution")).toBeInTheDocument();
    
    const name = screen.getByPlaceholderText('Name');
    fireEvent.change(name, { target: { value: "John Doe" }, });
   
    const number = screen.getByPlaceholderText('Phone');
    fireEvent.change(number, { target: { value: "1234567890" }, });

    
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Passout Year"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mark in CGPA"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByPlaceholderText("No.of Backlogs"), {
      target: { value: "0" },
    });
 // // Select an institution from the dropdown
    fireEvent.click(screen.getByTestId("institution"));
    fireEvent.click(screen.getByText("Institution 1"));


    expect(screen.getByTestId("course")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("course"));
    fireEvent.click(screen.getByText("Master of Computer Science"));

    // Submit the form
    fireEvent.click(screen.getByTitle("Add"));

    // Wait for the adminCreateStudent API call to be made with the correct data
    await waitFor(() => 
      expect(adminServices.adminCreateStudent).toHaveBeenCalled());
  });



});
