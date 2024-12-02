import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import QuestionsPanel from '../../pages/student/questionsPanel/QuestionsPanel';
import { studentServices } from '../../services/StudentServices';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../services/StudentServices', () => ({
  studentServices: {
    studentTokenValidation: jest.fn(),
    answerSubmission: jest.fn()
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  handleAnswerChange = jest.fn();
});

const mockQuestionPaper = {
  status: 200,
  data: {
    examTitle: "SCE Exam 3",
    duration: 10,
    totalQuestions: 2,
    questions: [
      {
        question: "________ key is the example of Toggle key ?",
        questionId: 20,
        questionType: 0,
        question_image: null,
        options: [
          "Caps Lock",
          "Shift",
          "Ctrl",
          "Alt"
        ]
      },
      {
        question: "What is an example of a Toggle key?",
        questionId: 21,
        questionType: 0,
        question_image: null,
        options: [
          "Caps Lock",
          "Shift",
          "Ctrl",
          "Alt"
        ]
      }
    ]
  }
}

describe('testing question panel components', () => {
  test('renders question panel and displays the questions correctly', async () => {
    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();
      expect(screen.getByText('SCE Exam 3')).toBeInTheDocument();
    });
  });

  test('renders error page when an error occurs', async () => {
    const path = '/examPortal/errorPage';

    studentServices.studentTokenValidation.mockRejectedValueOnce({
      response: { data: { errorCode: 'FETCH_ERROR' } }
    });

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(path);
    });
  });

  test('successful submission of answer', async () => {
    const path = '/examPortal/thanks';

    studentServices.answerSubmission.mockResolvedValueOnce({
      status: 200
    });

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    expect(screen.getByText('Submit')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to submit the exam. Once submitted you cannot change the answers.')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Confirm'));
      expect(studentServices.answerSubmission).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(path);
    });
  });

  test('handles Next button click correctly', async () => {
    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();

      expect(screen.getByText('Q1')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Next'));

      expect(screen.getByText('Q2: What is an example of a Toggle key?')).toBeInTheDocument();
    });
  });

  test('handles previous button click correctly', async () => {
    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();

      fireEvent.click(screen.getByText('Next'));

      fireEvent.click(screen.getByText('Previous'));

      expect(screen.getByText('Q1: ________ key is the example of Toggle key ?')).toBeInTheDocument();
    });
  });

  test('changes question index when a question is clicked in side navigation', async () => {
    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();
      expect(screen.getByText('Q1: ________ key is the example of Toggle key ?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Q2'));

    await waitFor(() => {
      expect(screen.getByText('Q2: What is an example of a Toggle key?')).toBeInTheDocument();
    });
  });

  test('updates answers state when options are selected', async () => {
    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();
      expect(screen.getByText('Q1: ________ key is the example of Toggle key ?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Caps Lock'));

    expect(screen.getByLabelText('Caps Lock')).toBeChecked();
  });

  test('updates answers state when options are unchecked', async () => {
    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(studentServices.studentTokenValidation).toHaveBeenCalled();
      expect(screen.getByText('Q1: ________ key is the example of Toggle key ?')).toBeInTheDocument();
    });

    const options = screen.getByLabelText('Caps Lock')
    fireEvent.click(options);

    expect(options).toBeChecked();

    fireEvent.click(options);

    expect(options).not.toBeChecked();
  });

  test('should terminate from the exam when the tab switch exceeds the limit', async () => {
    const path = '/examPortal/termination';

    studentServices.studentTokenValidation.mockResolvedValueOnce(mockQuestionPaper);

    render(
      <MemoryRouter>
        <QuestionsPanel />
      </MemoryRouter>
    );

    const simulateVisibilityChange = (hidden) => {
      Object.defineProperty(document, 'hidden', { value: hidden, configurable: true });
      const event = new Event('visibilitychange', { bubbles: true });
      act(() => {
        document.dispatchEvent(event);
      });
    };

    simulateVisibilityChange(true);
    simulateVisibilityChange(false);
    simulateVisibilityChange(true);
    simulateVisibilityChange(false);
    simulateVisibilityChange(true);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(path);
    });
  });
});
