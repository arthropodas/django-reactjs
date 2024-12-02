import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionManagement from '../../pages/admin/questionManagement/QuestionManagement';
import { adminServices } from '../../services/AdminServices';
import { MemoryRouter } from 'react-router-dom';


jest.mock('../../services/AdminServices', () => ({
    adminServices: {
        dropdownLists: jest.fn(),
        adminListQuestions: jest.fn(),
        adminDeleteQuestions: jest.fn(),

    },
}));


beforeEach(() => {
    jest.clearAllMocks();
});

describe('testing question management component', () => {

    const mockQuestions = {
        status: 200,
        data: {
            "count": 64,
            "num_pages": 8,
            "current_page": 1,
            "next_page": "http://localhost:8000/recruit-system/admin/question-management/?category_id=&page=2&searchTerm=",
            "previous_page": null,
            "results": [
                {
                    "question_id": 64,
                    "question": "What is the time complexity of accessing an element in an array?",
                    "question_type": 2,
                    "question_difficulty_level": 3,
                    "category_name": "Aptitude",
                    "category_id": 3,
                    "options": [
                        "O(n)",
                        "O(log n)",
                        "O(n²)",
                        "O(1)"
                    ],
                    "correct_answer": [
                        "O(1)"
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.843201Z"
                },
                {
                    "question_id": 63,
                    "question": "Which of the following is not a programming language",
                    "question_type": 2,
                    "question_difficulty_level": 1,
                    "category_name": "Aptitude",
                    "category_id": 3,
                    "options": [
                        "Python",
                        "Java",
                        "C++",
                        "HTML"
                    ],
                    "correct_answer": [
                        "HTML"
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.841603Z"
                },
                {
                    "question_id": 62,
                    "question": "What is the next number in the sequence: 5, 10, 20, 40, __?",
                    "question_type": 2,
                    "question_difficulty_level": 1,
                    "category_name": "Reasoning",
                    "category_id": 6,
                    "options": [
                        30,
                        70,
                        90,
                        80
                    ],
                    "correct_answer": [
                        80
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.836698Z"
                },
                {
                    "question_id": 61,
                    "question": "Which data structure works on a First In First Out (FIFO) basis",
                    "question_type": 2,
                    "question_difficulty_level": 3,
                    "category_name": "Aptitude",
                    "category_id": 3,
                    "options": [
                        "Stack",
                        "Tree",
                        "Graph",
                        "Queue"
                    ],
                    "correct_answer": [
                        "Queue"
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.834978Z"
                },
                {
                    "question_id": 60,
                    "question": "The sum of two odd numbers is always odd.",
                    "question_type": 11,
                    "question_difficulty_level": 21,
                    "category_name": "Aptitude",
                    "category_id": 3,
                    "options": [
                        "TRUE",
                        "FALSE"
                    ],
                    "correct_answer": [
                        "FALSE"
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.833914Z"
                },
                {
                    "question_id": 59,
                    "question": "If 5x + 3 = 28, what is the value of x?",
                    "question_type": 2,
                    "question_difficulty_level": 2,
                    "category_name": "Aptitude",
                    "category_id": 3,
                    "options": [
                        4,
                        6,
                        7,
                        5
                    ],
                    "correct_answer": [
                        5
                    ],
                    "question_image": "http://localhost:8000/question-image/Screenshot_from_2024-10-23_08-59-59.png",
                    "created_at": "2024-11-04T12:11:19.832534Z"
                },
                {
                    "question_id": 58,
                    "question": "Which of the following are prime numbers?",
                    "question_type": 2,
                    "question_difficulty_level": 1,
                    "category_name": "Aptitude",
                    "category_id": 3,
                    "options": [
                        1,
                        10,
                        21,
                        11
                    ],
                    "correct_answer": [
                        21,
                        11
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.831082Z"
                },
                {
                    "question_id": 57,
                    "question": "All even numbers are divisible by",
                    "question_type": 1,
                    "question_difficulty_level": 1,
                    "category_name": "Reasoning",
                    "category_id": 6,
                    "options": [
                        "FALSE",
                        "TRUE"
                    ],
                    "correct_answer": [
                        "TRUE"
                    ],
                    "question_image": null,
                    "created_at": "2024-11-04T12:11:19.829967Z"
                }
            ]
        }
    };

    const mockSections = {
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
        ]
    };

    test('display the fetched questions successfully', async () => {
        adminServices.adminListQuestions.mockResolvedValueOnce(mockQuestions);
        adminServices.dropdownLists.mockResolvedValueOnce(mockSections);
        render(
            <MemoryRouter>
                <QuestionManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminListQuestions).toHaveBeenCalled();
            expect(adminServices.dropdownLists).toHaveBeenCalled();
            expect(screen.getByText('Question Management')).toBeInTheDocument();
            expect(screen.getAllByText('Aptitude')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Hard')[0]).toBeInTheDocument();
        });
    });

    test('display the fetched questions fails', async () => {
        adminServices.adminListQuestions.mockRejectedValue({
            response: { data: { "errorCode": 'e3008', "errorMsg": "not found" } },
        });
        adminServices.dropdownLists.mockRejectedValue({
            response: { data: { "errorCode": 'e1006', "errorMsg": "not found" } },
        });
        render(
            <MemoryRouter>
                <QuestionManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminListQuestions).toHaveBeenCalled();
            expect(adminServices.dropdownLists).toHaveBeenCalled();
            expect(screen.getByText('No data available')).toBeInTheDocument();

        });
    });


    test('should successfully add a new  question - modal', async () => {
        adminServices.adminListQuestions.mockRejectedValue({
            response: { data: { "errorCode": 'e3008', "errorMsg": "not found" } },
        });
        adminServices.dropdownLists.mockRejectedValue({
            response: { data: { "errorCode": 'e1006', "errorMsg": "not found" } },
        });
        render(
            <MemoryRouter>
                <QuestionManagement />
            </MemoryRouter>
        );

        await waitFor(() => {

            fireEvent.click(screen.getByTitle('New questions'));
            expect(screen.getByText('Enter question details')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTitle('close'));

    });



    test('should successfully bulk  question', async () => {
        adminServices.adminListQuestions.mockRejectedValue({
            response: { data: { "errorCode": 'e3008', "errorMsg": "not found" } },
        });
        adminServices.dropdownLists.mockRejectedValue({
            response: { data: { "errorCode": 'e1006', "errorMsg": "not found" } },
        });
        render(
            <MemoryRouter>
                <QuestionManagement />
            </MemoryRouter>
        );
        await waitFor(() => {

            fireEvent.click(screen.getByTitle('Upload questions as bulk'));
            expect(screen.getByText('Create Questionnaire')).toBeInTheDocument();
            fireEvent.click(screen.getByTitle('close'));

        });

    });


    test('should successfully delete a question', async () => {

        adminServices.adminListQuestions.mockResolvedValueOnce(mockQuestions);
        adminServices.dropdownLists.mockResolvedValueOnce(mockSections);
        adminServices.adminDeleteQuestions.mockResolvedValueOnce({
            status: 200,
            data: { "message": "Successfully" }
        });
        render(
            <MemoryRouter>
                <QuestionManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminListQuestions).toHaveBeenCalled();
            expect(adminServices.dropdownLists).toHaveBeenCalled();
            const deleteButton = screen.getAllByTitle('Delete')[0];
            fireEvent.click(deleteButton);
        });

         waitFor(() => {
            expect(screen.getByText('Are you sure you want to delete the question ?')).toBeInTheDocument();
            // expect(screen.getByTitle('Confirm Delete')).toBeInTheDocument();

            fireEvent.click(screen.getByTestId('confirm'));
            expect(adminServices.adminDeleteQuestions).toHaveBeenCalledWith(63);
        });
    });



    

   










});
