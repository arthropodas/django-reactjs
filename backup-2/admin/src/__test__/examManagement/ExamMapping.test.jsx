import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import ExamMapping from "../../pages/admin/examManagement/ExamMapping";
import { adminServices } from "../../services/AdminServices";
import "@testing-library/jest-dom";

jest.mock("../../services/AdminServices");

describe("ExamMapping Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("fetches and displays enrolled and available students on initial render", async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [],
        count: 0,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [],
        count: 0,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    expect(screen.getByText("No students enrolled yet.")).toBeInTheDocument();
    expect(
      screen.getByText("No available students to add.")
    ).toBeInTheDocument();
  });
  test('enables "Send link" and "remove student button when checkboxes in enrolled Students tab are selected', async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            student_id: 1,
            name: "Student 1",
            exam_mapping_details: { link_sent: false, status_exam_student: 0 },
          },
        ],
        count: 1,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ id: 2, name: "Student 2" }],
        count: 1,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    fireEvent.click(screen.getByText("Already Added"));

    const checkbox = screen.getByRole("checkbox", { name: "Select Student 1" });
    fireEvent.click(checkbox);

    const sendLinkButton = screen.getByText("Send Link");
    const removeStudent = screen.getByText("Remove Students");
    expect(sendLinkButton).not.toBeDisabled();
    expect(removeStudent).not.toBeDisabled();
    adminServices.adminSendExamLink.mockResolvedValueOnce({
      status: 200,
    });

    fireEvent.click(sendLinkButton);

    await waitFor(() =>
      expect(adminServices.adminSendExamLink).toHaveBeenCalledWith({
        examId: expect.any(Number),
        studentId: [1],
      })
    );

    // Ensure API call is made once
    expect(adminServices.adminSendExamLink).toHaveBeenCalledTimes(1);
  });

  test("remove student functionality", async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            student_id: 1,
            name: "Student 1",
            exam_mapping_details: { link_sent: false, status_exam_student: 0 },
          },
        ],
        count: 1,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ id: 2, name: "Student 2" }],
        count: 1,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    fireEvent.click(screen.getByText("Already Added"));

    const checkbox = screen.getByRole("checkbox", { name: "Select Student 1" });
    fireEvent.click(checkbox);

    const sendLinkButton = screen.getByText("Send Link");
    const removeStudent = screen.getByText("Remove Students");
    expect(sendLinkButton).not.toBeDisabled();
    expect(removeStudent).not.toBeDisabled();
    adminServices.adminStudentExamMapping.mockResolvedValueOnce({
      status: 200,
    });

    fireEvent.click(removeStudent);

    await waitFor(() =>
      expect(adminServices.adminStudentExamMapping).toHaveBeenCalledWith({
        examId: expect.any(Number),
        studentId: [],
        removeStudentId: [1],
      })
    );
    expect(adminServices.adminStudentExamMapping).toHaveBeenCalledTimes(1);
  });
  test('enables "Add to Exam" button when checkboxes in Available Students tab are selected', async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            student_id: 1,
            name: "Student 1",
          },
        ],
        count: 1,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ id: 2, name: "Student 2" }],
        count: 1,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    fireEvent.click(screen.getByText("Available to Add"));
    const checkbox = screen.getByRole("checkbox", { name: "Select Student 2" });
    fireEvent.click(checkbox);
    const addToExamButton = screen.getByText("Add to Exam");
    expect(addToExamButton).not.toBeDisabled();
    adminServices.adminStudentExamMapping.mockResolvedValueOnce({
      status: 200,
    });

    fireEvent.click(addToExamButton);

    await waitFor(() =>
      expect(adminServices.adminStudentExamMapping).toHaveBeenCalledWith({
        examId: expect.any(Number),
        studentId: [2],
        removeStudentId: [],
      })
    );
    expect(adminServices.adminStudentExamMapping).toHaveBeenCalledTimes(1);
  });



  // add to exam error responses

  test('error response calling add to exam', async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            student_id: 1,
            name: "Student 1",
          },
        ],
        count: 1,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ id: 2, name: "Student 2" }],
        count: 1,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    fireEvent.click(screen.getByText("Available to Add"));
    const checkbox = screen.getByRole("checkbox", { name: "Select Student 2" });
    fireEvent.click(checkbox);
    const addToExamButton = screen.getByText("Add to Exam");
    expect(addToExamButton).not.toBeDisabled();
    adminServices.adminStudentExamMapping.mockRejectedValueOnce(
      new Error("Failed to add student to exam")
    );

    fireEvent.click(addToExamButton);
    await waitFor(() =>
      expect(adminServices.adminStudentExamMapping).toHaveBeenCalledWith({
        examId: expect.any(Number),
        studentId: [2],
        removeStudentId: [],
      })
    );
    expect(adminServices.adminStudentExamMapping).toHaveBeenCalledTimes(1);
  });

  //remove student error response
  test('remove student function error responses', async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            student_id: 1,
            name: "Student 1",
            exam_mapping_details: { link_sent: false, status_exam_student: 0 },
          },
        ],
        count: 1,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ id: 2, name: "Student 2" }],
        count: 1,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    fireEvent.click(screen.getByText("Already Added"));

    const checkbox = screen.getByRole("checkbox", { name: "Select Student 1" });
    fireEvent.click(checkbox);

    const removeStudent = screen.getByText("Remove Students");
    expect(removeStudent).not.toBeDisabled();


    adminServices.adminStudentExamMapping.mockRejectedValueOnce(
      new Error("Failed to remove student")
    );

    fireEvent.click(removeStudent);
    await waitFor(() =>
      expect(adminServices.adminStudentExamMapping).toHaveBeenCalledWith({
        examId: expect.any(Number),
        studentId: [],
        removeStudentId: [1],
      })
    );
    expect(adminServices.adminStudentExamMapping).toHaveBeenCalledTimes(1);
  });




  test('enables "Send link" and "remove student button when checkboxes in enrolled Students tab are selected', async () => {
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          {
            student_id: 1,
            name: "Student 1",
            exam_mapping_details: { link_sent: false, status_exam_student: 0 },
          },
        ],
        count: 1,
      },
    });
    adminServices.adminListStudentsInExam.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ id: 2, name: "Student 2" }],
        count: 1,
      },
    });

    render(<ExamMapping />);

    await waitFor(() =>
      expect(adminServices.adminListStudentsInExam).toHaveBeenCalledTimes(2)
    );

    fireEvent.click(screen.getByText("Already Added"));

    const checkbox = screen.getByRole("checkbox", { name: "Select Student 1" });
    fireEvent.click(checkbox);

    const sendLinkButton = screen.getByText("Send Link");
    expect(sendLinkButton).not.toBeDisabled();
    adminServices.adminSendExamLink.mockRejectedValue(
      new Error("Failed to send link")
    );

    fireEvent.click(sendLinkButton);

    await waitFor(() =>
      expect(adminServices.adminSendExamLink).toHaveBeenCalledWith({
        examId: expect.any(Number),
        studentId: [1],
      })
    );

    // Ensure API call is made once
    expect(adminServices.adminSendExamLink).toHaveBeenCalledTimes(1);
  });
});
