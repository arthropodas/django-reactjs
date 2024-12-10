import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import QuestionnaireAdd from '../../pages/admin/questionnaireManagement/QuestionnaireAdd';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useCategories } from '../../utils/useCategories';

// jest.mock('../../utils/useCategories', () => ({
//   useCategories: jest.fn(() => ({
//     categoryOptions: [
//       { id: 1, value: 'Math' },
//       { id: 2, value: 'Science' },
//     ],
//     categoryDetails: [
//       { categoryId: 1, categoryName: 'Coding', hard: 0, medium: 0, easy: 0 },
//       { categoryId: 2, categoryName: 'Logical', hard: 0, medium: 0, easy: 0 },
//       { categoryId: 3, categoryName: 'Aptitude', hard: 2, medium: 2, easy: 2 },
//     ],
//     fetchCategoryDetails: jest.fn(),
//     fetchCategoryQuestionCount: jest.fn(),
//   })),
// }));

jest.mock('../../services/AdminServices', () => ({
    adminServices: {
        adminQuestionnaireEditPreviewView: jest.fn(),
        adminQuestionnaireAddPreviewQuestions: jest.fn(),
        adminQuestionnaireUpdate: jest.fn(),
        adminQuestionnaireCreate: jest.fn(),
    },
}));

describe('QuestionnaireAdd Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('should render the component correctly in "Add Questionnaire" mode with error for no sections displayed', () => {
        render(
            <MemoryRouter>
                <QuestionnaireAdd />
            </MemoryRouter>
        );

        // Check for the questionnaire title
        expect(screen.getByText(/Add Questionnaire/i)).toBeInTheDocument();
        expect(screen.getByTestId('errorMessage')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch category question counts.')).toBeInTheDocument();
        expect(screen.getByTestId('close')).toBeInTheDocument();
        const errorClose = screen.getByTestId('close');
        fireEvent.click(errorClose);
    });

    test('should render the component correctly in "Add Questionnaire" mode ', async () => {

        adminServices.adminQuestionnaireAddPreviewQuestions.mockResolvedValue({
            status: 200,
            data: {
                "preview": [
                    {
                        "category": "Reasoning",
                        "categoryId": 6,
                        "levels": [
                            {
                                "level": 1,
                                "questions": [
                                    {
                                        "id": 56,
                                        "value": "Which number should come next in the series: 2, 6, 12, 20, 30, __?",
                                        "type": 2,
                                        "questionImage": null,
                                        "options": [
                                            {
                                                "id": 224,
                                                "value": "42",
                                                "isCorrect": true
                                            },
                                            {
                                                "id": 222,
                                                "value": "40",
                                                "isCorrect": false
                                            },
                                            {
                                                "id": 221,
                                                "value": "48",
                                                "isCorrect": false
                                            },
                                            {
                                                "id": 223,
                                                "value": "38",
                                                "isCorrect": false
                                            }
                                        ]
                                    },
                                    {
                                        "id": 62,
                                        "value": "What is the next number in the sequence: 5, 10, 20, 40, __?",
                                        "type": 2,
                                        "questionImage": null,
                                        "options": [
                                            {
                                                "id": 244,
                                                "value": "80",
                                                "isCorrect": true
                                            },
                                            {
                                                "id": 243,
                                                "value": "90",
                                                "isCorrect": false
                                            },
                                            {
                                                "id": 241,
                                                "value": "30",
                                                "isCorrect": false
                                            },
                                            {
                                                "id": 242,
                                                "value": "70",
                                                "isCorrect": false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        });

        render(
            <MemoryRouter>
                <QuestionnaireAdd />
            </MemoryRouter>
        );

        // Check for the questionnaire title
        expect(screen.getByText(/Add Questionnaire/i)).toBeInTheDocument();

        expect(screen.getByText('Questionnaire Name')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId("questionnaireName"), {
            target: { value: "Questionnaire 1" },
        });

        // expect(screen.getByPlaceholderText('Select a Section')).toBeInTheDocument();
        // fireEvent.change(screen.getByPlaceholderText("Select a Section"), {
        //     target: { value: "Aptitude" },
        // });
        expect(screen.getByPlaceholderText('Easy Questions')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText("Easy Questions"), {
            target: { value: "2" },
        });
        expect(screen.getByPlaceholderText('Medium Questions')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText("Medium Questions"), {
            target: { value: "2" },
        });
        expect(screen.getByPlaceholderText('Hard Questions')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText("Hard Questions"), {
            target: { value: "2" },
        });

        expect(screen.getByTitle('Add more section')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Add more section'));

        expect(screen.getAllByTitle('Remove section')[1]).toBeInTheDocument();
        fireEvent.click(screen.getAllByTitle('Remove section')[1]);

        expect(screen.getByTitle('Preview Questions')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Preview Questions'));
   

    await waitFor(() => {
        // expect(adminServices.adminQuestionnaireAddPreviewQuestions).toHaveBeenCalled();
    })


});

   



















});
