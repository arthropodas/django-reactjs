import React from "react";
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import ShortListedStudents from "../../pages/admin/shortlist/ShortListedStudents";
import { adminServices } from "../../services/AdminServices";
import * as chakra from "@chakra-ui/react";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"), // Import the actual library
  useBreakpointValue: jest.fn(), // Mock the useBreakpointValue function
}));

jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminListAllWrittenStudents: jest.fn(),
    adminListShortListedStudents: jest.fn(),
    adminSendShortlistMail: jest.fn()
  },
}));

const mockValidResponseData = {
  status: 200,
  data: {
    count: 10,
    next: null,
    previous: null,
    results: [
      {
        student: {
          student_id: 1,
          student_name: "John Doe",
          student_email: "johndoe@example.com",
          student_phone: "1234567890",
          pass_out_year: 2024,
          status: 1,
          created_at: "2024-08-29T14:46:37Z",
          updated_at: "2024-08-29T14:46:37Z",
          student_institution: {
            institution_id: 1,
            institution_name: "Test put institute 1",
            institution_code: "dupitest",
            institution_email: "",
            institution_phone: "1234567890",
            status: false,
          },
        },
        exam: {
          exam_id: 4,
          exam_name: "Placement 2024",
          exam_date: "2024-08-29",
          exam_time: "10:00:00",
          total_questions: 50,
          exam_duration: 60,
          status: 1,
          status_of_exam: 2,
          created_at: "2024-08-28T04:19:48.828939Z",
          updated_at: "2024-08-29T09:42:29.825509Z",
          exam_institution: {
            institution_id: 6,
            institution_name: "Test put institute 891",
            institution_code: "567813",
            institution_email: "",
            institution_phone: "1234567890",
            status: false,
          },
        },
        mark: 60.0,
      },
      {
        student: {
          student_id: 4,
          student_name: "John Doe",
          student_email: "johndoe3@example.com",
          student_phone: "1234567890",
          pass_out_year: 2024,
          status: 1,
          created_at: "2024-08-29T14:46:57Z",
          updated_at: "2024-08-29T14:46:57Z",
          student_institution: {
            institution_id: 1,
            institution_name: "Test put institute 1",
            institution_code: "dupitest",
            institution_email: "",
            institution_phone: "1234567890",
            status: false,
          },
        },
        exam: {
          exam_id: 4,
          exam_name: "Placement 2024",
          exam_date: "2024-08-29",
          exam_time: "10:00:00",
          total_questions: 50,
          exam_duration: 60,
          status: 1,
          status_of_exam: 2,
          created_at: "2024-08-28T04:19:48.828939Z",
          updated_at: "2024-08-29T09:42:29.825509Z",
          exam_institution: {
            institution_id: 6,
            institution_name: "Test put institute 891",
            institution_code: "567813",
            institution_email: "",
            institution_phone: "1234567890",
            status: false,
          },
        },
        mark: 75.0,
      },
    ],
  }
};

describe("Initial rendering", () => {
  it("renders the component", async () => {
    render(<ShortListedStudents />);
    expect(screen.getByPlaceholderText("Enter cutoff mark"));
    expect(screen.getByText("List"));
  });

  test("handles input change correctly", () => {
    render(<ShortListedStudents />);
    const input = screen.getByPlaceholderText("Enter cutoff mark");
    fireEvent.change(input, { target: { value: "65" } });
    expect(input.value).toBe("65");
  });

  it("lists the data with valid output", async () => {
    adminServices.adminListShortListedStudents.mockResolvedValue(
      mockValidResponseData
    );
    render(<ShortListedStudents />);
    const cutOffMark = screen.getByPlaceholderText("Enter cutoff mark");
    fireEvent.change(cutOffMark, { target: { value: " " } });
    fireEvent.click(screen.getByText("List"));

    await waitFor(() => {
      expect(adminServices.adminListShortListedStudents).toHaveBeenCalled();
    });
  });

  test("displays error message for invalid input less than or equal to zero", () => {
    render(<ShortListedStudents />);
    const input = screen.getByPlaceholderText("Enter cutoff mark");

    fireEvent.change(input, { target: { value: "-10" } });

    expect(screen.getByText("Mark should be a positive number"));
  });

  test('fetch the details of all students attended the exam', async () => {
    adminServices.adminListAllWrittenStudents.mockResolvedValue(mockValidResponseData);

    render(
      <ShortListedStudents />
    );

    await waitFor(() => {
      expect(adminServices.adminListAllWrittenStudents).toHaveBeenCalled();
    });
  });

  test('should send mail to all shortlisted candidates', async () => {
    adminServices.adminListShortListedStudents.mockResolvedValue(
      mockValidResponseData
    );

    adminServices.adminSendShortlistMail.mockResolvedValue({ status: 200 });

    render(<ShortListedStudents />);

    const cutOffMark = screen.getByPlaceholderText("Enter cutoff mark");
    fireEvent.change(cutOffMark, { target: { value: " " } });
    fireEvent.click(screen.getByText("List"));

    await waitFor(() => {
      expect(adminServices.adminListShortListedStudents).toHaveBeenCalled();
    });

    expect(screen.getByText('Send Mail'));
    fireEvent.click(screen.getByText('Send Mail'));

    expect(adminServices.adminSendShortlistMail).toHaveBeenCalled();

  });
});
