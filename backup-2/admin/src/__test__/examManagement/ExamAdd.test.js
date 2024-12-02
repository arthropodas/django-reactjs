import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExamAdd from '../../pages/admin/examManagement/ExamAdd.jsx';
import { adminServices } from '../../services/AdminServices.js';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../../services/AdminServices.js', () => ({
  adminServices: {
    dropdownLists: jest.fn(),
    adminListCategorys: jest.fn(),
    adminGetCategoryQuestionsCount: jest.fn(),
    adminAddExam: jest.fn(),
  },
}));



describe('ExamAdd Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockQuestionnaires = [
    {
      "id": 1,
      "questionnaire_name": "Paper 1",
      "status": true,
      "created_at": "2024-10-22T14:25:09.548274Z",
      "updated_at": "2024-10-22T14:25:09.548305Z",
      "total_questions": 4
    },
    {
      "id": 2,
      "questionnaire_name": "Papers",
      "status": true,
      "created_at": "2024-10-22T14:25:59.445756Z",
      "updated_at": "2024-10-22T14:25:59.445799Z",
      "total_questions": 2
    }
  ];

  test('renders form fields correctly and display data', async () => {
  
    adminServices.dropdownLists.mockResolvedValueOnce({
      status: 200,
      data: mockQuestionnaires
    });

    render(
      <MemoryRouter>
        <ExamAdd />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Exam name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Exam Duration')).toBeInTheDocument();
    expect(screen.getByText('Exam Date')).toBeInTheDocument();
    expect(screen.getByText('Exam Time')).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
 
    adminServices.dropdownLists.mockResolvedValueOnce({
      status: 200,
      data: mockQuestionnaires
    });

    adminServices.adminAddExam.mockResolvedValueOnce({
      status: 200,
    });
  
    render(
      <MemoryRouter>
        <ExamAdd />
      </MemoryRouter>
    );
  
    await waitFor(() => expect(adminServices.dropdownLists).toHaveBeenCalledTimes(1));
  
    // Use userEvent for a more natural interaction
    userEvent.type(screen.getByPlaceholderText('Exam name'), 'Math Exam');
    userEvent.type(screen.getByPlaceholderText('Exam Duration'), '60');
    userEvent.type(screen.getByPlaceholderText('Exam Location'), 'Room 101');
    userEvent.type(screen.getByText('Exam Date'), '2024-09-15');
    userEvent.type(screen.getByText('Exam Time'), '10:00');
  
    // Handling the select input for the questionnaire
    fireEvent.click(screen.getByTestId("questionnaire-select"));
    waitFor(()=>{
    userEvent.selectOptions(screen.getByTestId("questionnaire-select"), 'Paper 1');
    })
    await waitFor(() => {
      const submitButton = screen.getByTitle('Add');
      fireEvent.click(submitButton);
    });
  
    await waitFor(() => {
      expect(adminServices.adminAddExam).toHaveBeenCalledWith(expect.objectContaining({
        examName: 'Math Exam',
        examDuration: 60,
        examDate: '2024-09-15',
        examTime: '10:00:00',
        examLocation: 'Room 101',
        questionnaireId: 1,
      }));
      expect(screen.getByText('Exam Added Successfully')).toBeInTheDocument();
    });
  });

  test('renders and failure in data display in selectboxes', async () => {
    adminServices.dropdownLists.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1022", "errorMsg": "No institute" },
    });
    adminServices.dropdownLists.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1010", "errorMsg": "exception" },
    });
    adminServices.adminGetCategoryQuestionsCount.mockRejectedValueOnce({
      status: 400,
      data: { "errorMsg": "Failed to fetch categories." },
    });

    render(
      <MemoryRouter>
        <ExamAdd />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Exam name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Exam Duration')).toBeInTheDocument();
    expect(screen.getByText('Exam Date')).toBeInTheDocument();
    expect(screen.getByText('Exam Time')).toBeInTheDocument();
  });
});
