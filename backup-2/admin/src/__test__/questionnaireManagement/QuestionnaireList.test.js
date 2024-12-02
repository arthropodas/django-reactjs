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
            expect(adminServices.adminQuestionnaireDelete).toHaveBeenCalledWith(1);
            expect(screen.getByText('Questionnaire Deleted Successfully')).toBeInTheDocument();
        })
        await waitFor(() => {
            expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();

        });
        ;
        screen.debug();
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
            data: { "errorCode": "e2201" , "errorMessage":"already deleted"},
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

        adminServices.adminQuestionnaireUpdate.mockResolvedValue({
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
            const addButton = screen.getByTitle('Edit Questionnaire');
            fireEvent.click(addButton);
        });

       
        screen.debug();
    });






});

