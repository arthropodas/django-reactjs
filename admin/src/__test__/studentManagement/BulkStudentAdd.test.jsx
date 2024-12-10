import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import BulkStudentAdd from "../../pages/admin/studentManagement/BulkStudentAdd";
import { adminServices } from "../../services/AdminServices";

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminUploadStudents: jest.fn(),
    adminDropdownInstitutions: jest.fn(),
    // adminGetExamInstitution: jest.fn(),
  },
}));

// Mocking components
jest.mock("../../components/select/SelectBox", () => (props) => (
  <select {...props}>
    {props.options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.value}
      </option>
    ))}
  </select>
));

jest.mock("../../components/button/SubmitButton", () => (props) => (
  <button type={props.type} {...props}>
    {props.label}
  </button>
));

jest.mock(
  "../../components/toast/Toast",
  () =>
    ({ show, message, onClose }) =>
      show ? <div role="alert">{message}</div> : null
);

jest.mock("../../components/spinner/Spinner", () => () => (
  <div>Loading...</div>
));

jest.mock(
  "../../components/modal/PaperModal",
  () =>
    ({ open, handleClose, children }) =>
      open ? (
        <div role="dialog">
          {children}
          <button onClick={handleClose}>Close</button>
        </div>
      ) : null
);

jest.mock(
  "../../pages/admin/studentManagement/ErrorCard",
  () =>
    ({ errorData }) =>
      <div>{JSON.stringify(errorData)}</div>
);

const mockInstitutionDropDown = {
  status: 200,
  data: {
    results: [
      { id: 1, institution_name: "Institution A" },
      { id: 2, institution_name: "Institution B" },
    ],
  },
};


describe("BulkStudentAdd Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renders without crashing", () => {
    render(<BulkStudentAdd handleClose={() => {}} />);
    expect(screen.getByText("Upload file")).toBeInTheDocument();
  });

  test("fetches and displays institution and exam details correctly", async () => {
    adminServices.adminDropdownInstitutions.mockResolvedValueOnce(
      mockInstitutionDropDown
    );

    // adminServices.adminGetExamInstitution.mockResolvedValueOnce(mockExamDropDown);

    render(<BulkStudentAdd handleClose={() => {}} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Select Institution")
      ).toBeInTheDocument();
    });

    // userEvent.selectOptions(screen.getByPlaceholderText('Select Institution'), 'Institution A');
  });
  test("shows validation errors for file upload when an invalid file is selected", async () => {
    render(
        <BulkStudentAdd handleClose={() => {}} />
    );

    fireEvent.change(screen.getByLabelText("Upload file"), {
      target: { files: [new File(["test"], "test.txt", { type: "text/plain" })] },
    });

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.getByText("Only CSV files are allowed")).toBeInTheDocument();
    });
  });

  test("shows validation error when the file exceeds the size limit", async () => {
    render(
        <BulkStudentAdd handleClose={() => {}} />
    );

    fireEvent.change(screen.getByLabelText("Upload file"), {
      target: { files: [new File(["a".repeat(3 * 1024 * 1024)], "large-file.csv", { type: "text/csv" })] },
    });

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.getByText("File size must be less than or equal to 2MB")).toBeInTheDocument();
    });
  });

//   test("handles form submission successfully", async () => {
//   adminServices.adminDropdownInstitutions.mockResolvedValueOnce(
//     mockInstitutionDropDown
//   );

//   adminServices.adminUploadStudents.mockResolvedValueOnce({
//     status: 200,
//   });

//   render(<BulkStudentAdd handleClose={() => {}} />);

//   // Wait for dropdown to populate
//   await waitFor(() => {
//     expect(screen.getByPlaceholderText("Select Institution")).toBeInTheDocument();
//   });

//   // Select Institution A
//   userEvent.selectOptions(screen.getByPlaceholderText("Select Institution"), [
//     screen.getByText("Institution A"),
//   ]);

//   // Upload file
//   const file = new File(["dummy content"], "students.csv", {
//     type: "text/csv",
//   });
//   userEvent.upload(screen.getByLabelText("Upload file"), file);

//   // Submit form
//   userEvent.click(screen.getByText("Save"));

//   // Wait for success message
//   await waitFor(() => {
//     expect(screen.getByRole("alert")).toHaveTextContent(
//       "Students uploaded successfully"
//     );
//   });

//   // Simulate error on subsequent submission
//   adminServices.adminUploadStudents.mockRejectedValueOnce({
//     response: { data: { errorCode: "e2050" } },
//   });

//   userEvent.click(screen.getByText("Save"));

//   // Wait for error message
//   await waitFor(() => {
//     expect(screen.getByText("Unknown error occurred")).toBeInTheDocument();
//   });
// });

});
