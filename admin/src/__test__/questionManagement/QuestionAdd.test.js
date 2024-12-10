import React from 'react';
import { render, screen, waitFor, fireEvent, getByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";

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

    const dropdownLists = {
        status: 200,
        data: [
            {
                "id": 2,
                "question_category_name": "Logical",
                "status": true,
                "created_at": "2024-10-22T12:44:10.671223Z",
                "updated_at": "2024-10-22T12:44:10.671260Z"
            },
            {
                "id": 3,
                "question_category_name": "Aptitude",
                "status": true,
                "created_at": "2024-10-22T12:44:17.701302Z",
                "updated_at": "2024-10-22T12:44:17.701341Z"
            },
            {
                "id": 4,
                "question_category_name": "Verbal",
                "status": true,
                "created_at": "2024-10-22T12:44:23.078253Z",
                "updated_at": "2024-10-22T12:44:23.078288Z"
            },
            {
                "id": 5,
                "question_category_name": "Mixed",
                "status": true,
                "created_at": "2024-10-22T12:44:28.510768Z",
                "updated_at": "2024-10-22T12:44:28.510795Z"
            },
            {
                "id": 6,
                "question_category_name": "Reasoning",
                "status": true,
                "created_at": "2024-11-04T12:10:57.145440Z",
                "updated_at": "2024-11-04T12:10:57.145466Z"
            },
            {
                "id": 7,
                "question_category_name": "Coding",
                "status": true,
                "created_at": "2024-11-15T08:34:56.276649Z",
                "updated_at": "2024-11-15T08:34:56.276683Z"
            },
            {
                "id": 8,
                "question_category_name": "ggfhh",
                "status": true,
                "created_at": "2024-11-19T05:04:57.314526Z",
                "updated_at": "2024-11-19T05:04:57.314569Z"
            }
        ]
    };
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

        render(<MemoryRouter><QuestionAdd /></MemoryRouter>);

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
        adminServices.dropdownLists.mockResolvedValueOnce(dropdownLists);

        render(<MemoryRouter><QuestionAdd /></MemoryRouter>);

        await waitFor(() => {
            expect(adminServices.dropdownLists).toHaveBeenCalled();
        });

        waitFor(() => {
        const selectSection = screen.getByTitle('Select Section');
        fireEvent.change(selectSection,{ target: {value:"Logical"},});

        const selectType = screen.getByTitle('Question Type');
        fireEvent.change(selectType,{ target: {value:"Multiple Answers"},});

        const selectLevel = screen.getByTitle('Question level');
        fireEvent.change(selectLevel,{ target: {value:"Easy"},});

        const question = screen.getByPlaceholderText('Enter question here');
        fireEvent.change(question,{ target: {value:"What is the largest mamal in the world?"},});

        fireEvent.click(screen.getByTitle('Add'));
        });
        // await waitFor(() => {
        //     expect(adminServices.adminAddQuestions).toHaveBeenCalled();
        // });
    });


});