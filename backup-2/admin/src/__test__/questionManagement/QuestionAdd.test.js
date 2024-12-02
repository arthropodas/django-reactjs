import React from 'react';
import { render, screen, waitFor, fireEvent, getByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { adminServices } from '../../services/AdminServices';
import QuestionAdd from '../../pages/admin/questionManagement/QuestionAdd';

jest.mock('../../services/AdminServices', () => ({
    adminServices: {
        dropdownLists: jest.fn(),
        adminListQuestions: jest.fn(),
        adminAddQuestions: jest.fn(),
        adminDeleteQuestions: jest.fn(),
        adminEditQuestions: jest.fn(),
        adminGetQuestionsById: jest.fn()
    },
}));

jest.mock('../../components/modal/CommonModal', () => ({ open, handleClose, title, onConfirm }) => (
    open && <div>
        <h2>{title}</h2>
        <button onClick={onConfirm}>Submit</button>
        <button onClick={handleClose}>Close</button>
    </div>
));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('testing the question add component', () => {
    test('fetch the question category successfully', async () => {
        adminServices.dropdownLists.mockResolvedValueOnce({
            status: 200,
            data: {
                results: [
                    { id: 1, question_category_name: 'Logical' },
                    { id: 2, question_category_name: 'Aptitude' }
                ]
            }
        });

        render(<QuestionAdd />);

        await waitFor(() => {
            expect(adminServices.dropdownLists).toHaveBeenCalledWith('question_category');
        });
    });

    test('should fetch the question details based on id', async () => {
        adminServices.adminGetQuestionsById.mockResolvedValueOnce({
            status: 200,
            data: {
                category_id: 1,
                question_type: 'MCQ',
                question_difficulty_level: 'easy',
                question: 'What is Jest?',
                options: ['Option A', 'Option B'],
                correct_answer: ['Option A'],
                question_image: null
            }
        });

        const questionId = 123;
        render(<QuestionAdd questionId={questionId} />);

        await waitFor(() => {
            expect(adminServices.adminGetQuestionsById).toHaveBeenCalled();
        });
    });

    test('should display error when fetch the question details based on id fails', async () => {
        adminServices.adminGetQuestionsById.mockRejectedValueOnce({
            response: { data: { errorCode: 'FETCH_ERROR' } }
        });

        const questionId = 123;
        render(<QuestionAdd questionId={questionId} />);

        await waitFor(() => {
            expect(adminServices.adminGetQuestionsById).toHaveBeenCalled();
        });
    });

    test('should successfully add a question and show the success toast message', async () => {
        adminServices.adminAddQuestions.mockResolvedValueOnce({
            status: 201
        });

        const dataToSend = {
            category_id: 1,
            question_type: 'MCQ',
            difficulty_level: 'easy',
            question: 'What is Jest?',
            options: '["Option A", "Option B", "Option C", "Option D"]',
            correct_answer: '["Option A"]',
            question_image: null
        };

        render(<QuestionAdd />);
        fireEvent.submit(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
            expect(adminServices.adminAddQuestions).toHaveBeenCalledWith(dataToSend);
        });

        expect(screen.getByText('Question added successfully')).toBeInTheDocument();
    });
});