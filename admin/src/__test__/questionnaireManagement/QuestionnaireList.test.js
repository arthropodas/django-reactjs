import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import QuestionnaireList from '../../pages/admin/questionnaireManagement/QuestionnaireList';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import adminQuestionnaireErrorCodes from '../../pages/admin/questionnaireManagement/QuestionnaireErrorCodes';

jest.mock('../../services/AdminServices', () => ({
    adminServices: {
        adminQuestionnaireLists: jest.fn(),
        adminQuestionnaireDetailView: jest.fn(),
        adminQuestionnaireDelete: jest.fn(),
    },
}));
jest.mock('../../pages/admin/questionnaireManagement/QuestionnaireErrorCodes');

describe('QuestionnaireList Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders with data and displays the questionnaire details - id', async () => {
        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },
                    {
                        "id": 2,
                        "questionnaire_name": "Paper 2",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    }
                ]
            },
        });
        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );
        expect(screen.getByText('Questionnaire Management')).toBeInTheDocument();
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            expect(screen.getByText('Paper 1')).toBeInTheDocument();

        });
        waitFor(() => {
            const firstButton = screen.getByTitle('First');
            fireEvent.click(firstButton);
            const lastButton = screen.getByTitle('Last');
            fireEvent.click(lastButton);
            const nextButton = screen.getByTitle('Next');
            fireEvent.click(nextButton);
            const prevButton = screen.getByTitle('Previous');
            fireEvent.click(prevButton);
        })
    });

    test('displays an error message when data fetch fails', async () => {

        adminServices.adminQuestionnaireLists.mockRejectedValue({
            response: { data: { "errorCode": 'e2201', "errorMsg": "required" } },
        });
        adminQuestionnaireErrorCodes.mockReturnValue("Questionnaire name is required");

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            expect(screen.getByText('Questionnaire name is required')).toBeInTheDocument();
        });
    });

    it('opens the Delete Dialog and delete it ', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },

                ]
            },
        });

        adminServices.adminQuestionnaireDelete.mockResolvedValue({
            status: 200,
            data: { "message": "Successfully" },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            const addButton = screen.getByTitle('Delete Questionnaire');
            fireEvent.click(addButton);
        });

        waitFor(() => {
            expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
            expect(screen.getByText('Are you sure you want to delete the questionnaire?')).toBeInTheDocument();
            const submitButton = screen.getByTestId("confirm");
            fireEvent.click(submitButton);
            
        })
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireDelete).toHaveBeenCalledWith(1);
            // expect(screen.getByText('Questionnaire Deleted Successfully')).toBeInTheDocument();
            expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();

        });
        ;
        screen.debug();
    });


   
    it('edit it ', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },

                ]
            },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            const addButton = screen.getByTitle('Edit Questionnaire');
            fireEvent.click(addButton);
        });

    });



    it('detail modal open ', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },

                ]
            },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            const addButton = screen.getByTitle('View Detail');
            fireEvent.click(addButton);
        });
        const closeButton = screen.getAllByTitle('close')[0];
        fireEvent.click(closeButton);
    });

    it('opens the Delete Dialog and delete fails', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },

                ]
            },
        });

        adminServices.adminQuestionnaireDelete.mockRejectedValue({
            status: 400,
            data: { "errorCode": "e2201", "errorMessage": "already deleted" },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            const addButton = screen.getByTitle('Delete Questionnaire');
            fireEvent.click(addButton);
        });

        waitFor(() => {
            expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
            const closeButton = screen.getByTestId('close');
            fireEvent.click(closeButton);
            expect(screen.getByText('Are you sure you want to delete the questionnaire?')).toBeInTheDocument();
            const submitButton = screen.getByTestId("confirm");
            fireEvent.click(submitButton);
            expect(adminServices.adminQuestionnaireDelete).toHaveBeenCalledWith(1);
        })
    });



    it('filter questionnaire  ', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },
                ]
            },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            const yearSelect = screen.getByTestId("year");
            fireEvent.change(yearSelect, { target: { value: "2024" } });

            const submitButton = screen.getByTitle('filter'); // Adjust if necessary
            fireEvent.click(submitButton);
        });

        // waitFor(() => {
           

        // })

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalledWith("", "",1);
        })

    });

    it('new questionnaire create ', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },

                ]
            },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();
            const addButton = screen.getByTitle('Create new questionnaire');
            fireEvent.click(addButton);
        });

    });


    it('search questionnaire  ', async () => {

        adminServices.adminQuestionnaireLists.mockResolvedValue({
            status: 200,
            data: {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": 1,
                        "questionnaire_name": "Paper 1",
                        "status": true,
                        "created_at": "2024-11-01T06:16:08.043700Z",
                        "updated_at": "2024-11-01T06:16:08.043724Z",
                        "total_questions": 55
                    },

                ]
            },
        });

        render(
            <MemoryRouter>
                <QuestionnaireList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalled();

        });

        waitFor(() => {
            const searchInput = screen.getByPlaceholderText('Enter questionnaire name');
            fireEvent.change(searchInput, { target: { value: 'Paper 1' } });
            fireEvent.click(screen.getByTestId('Search'));
            expect(adminServices.adminQuestionnaireLists).toHaveBeenCalledTimes(1);

        })

    });






});

