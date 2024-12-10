import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { adminServices } from '../../services/AdminServices.js';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import BatchDetails from '../../pages/admin/examManagement/BatchDetails.jsx';

jest.mock('../../services/AdminServices.js', () => ({
    adminServices: {
        adminBatchStudents: jest.fn(),
        adminBatchDeleteStudents: jest.fn(),
    },
}));



describe('BatchDetails Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const BatchStudentDetails = {
        status: 200,
        data:
            [
                {
                    "student_id": 13,
                    "student_name": "Simy Varghese",
                    "student_email": "simyvarghese@gmail.com",
                    "student_phone": "7676843678",
                    "pass_out_year": 2024,
                    "cgpa": 5.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 1,
                    "institution": "Nirmala"
                },
                {
                    "student_id": 14,
                    "student_name": "Varghese",
                    "student_email": "varghese@gmail.com",
                    "student_phone": "9876789098",
                    "pass_out_year": 2024,
                    "cgpa": 9.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 0,
                    "institution": "MEC K"
                },
                {
                    "student_id": 15,
                    "student_name": "Emyz",
                    "student_email": "emyz2021@abc.com",
                    "student_phone": "7788990099",
                    "pass_out_year": 2024,
                    "cgpa": 9.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 3,
                    "institution": "Nirmala"
                },
                {
                    "student_id": 16,
                    "student_name": "Kunjumole",
                    "student_email": "kunjumole@gmail.com",
                    "student_phone": "7788990099",
                    "pass_out_year": 2024,
                    "cgpa": 9.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 2,
                    "institution": "Innovature"
                },
                {
                    "student_id": 17,
                    "student_name": "Selin",
                    "student_email": "emyz2020@gmail.com",
                    "student_phone": "9876782345",
                    "pass_out_year": 2024,
                    "cgpa": 9.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 5,
                    "institution": "MEC K"
                },
                {
                    "student_id": 18,
                    "student_name": "Sara",
                    "student_email": "simycv@gmail.com",
                    "student_phone": "7788990099",
                    "pass_out_year": 2024,
                    "cgpa": 5.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 4,
                    "institution": "Nirmala"
                },
                {
                    "student_id": 19,
                    "student_name": "Emilyia",
                    "student_email": "emyz202@abc.com",
                    "student_phone": "7788990099",
                    "pass_out_year": 2024,
                    "cgpa": 5.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 3,
                    "institution": "MEC K"
                },
                {
                    "student_id": 20,
                    "student_name": "Joe",
                    "student_email": "jooe@gmail.com",
                    "student_phone": "9876789098",
                    "pass_out_year": 2024,
                    "cgpa": 8.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 9,
                    "institution": "MEC K"
                },
                {
                    "student_id": 21,
                    "student_name": "Mia",
                    "student_email": "emyz20@abc.com",
                    "student_phone": "9876789098",
                    "pass_out_year": 2023,
                    "cgpa": 5.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 2,
                    "institution": "Nirmala"
                },
                {
                    "student_id": 22,
                    "student_name": "Nicy",
                    "student_email": "sess@gmail.com",
                    "student_phone": "9876782345",
                    "pass_out_year": 2024,
                    "cgpa": 8.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 2,
                    "institution": "Nirmala"
                },
                {
                    "student_id": 8,
                    "student_name": "Jojo",
                    "student_email": "jojo@gmail.com",
                    "student_phone": "7676843611",
                    "pass_out_year": 2024,
                    "cgpa": 9.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 2,
                    "institution": "Nirmala"
                },
                {
                    "student_id": 23,
                    "student_name": "Peter",
                    "student_email": "emyz224@gmail.com",
                    "student_phone": "9876782345",
                    "pass_out_year": 2024,
                    "cgpa": 8.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 2,
                    "institution": "MEC K"
                }
            ]
    }


    test('Render component', async () => {

        adminServices.adminBatchStudents.mockResolvedValueOnce(BatchStudentDetails);

        render(
            <MemoryRouter>
                <BatchDetails />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(adminServices.adminBatchStudents).toHaveBeenCalled();
        })

        expect(screen.getByText('Batch Students Details')).toBeInTheDocument();
        expect(screen.getByText('All Students')).toBeInTheDocument();
        expect(screen.getAllByText('Started')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Terminated')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Shortlisted')[0]).toBeInTheDocument();


    });

    test('Go back from  component', async () => {

        adminServices.adminBatchStudents.mockResolvedValueOnce(BatchStudentDetails);

        render(
            <MemoryRouter>
                <BatchDetails />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(adminServices.adminBatchStudents).toHaveBeenCalled();
        })

        expect(screen.getByText('Batch Students Details')).toBeInTheDocument();
        expect(screen.getByText('All Students')).toBeInTheDocument();
        expect(screen.getAllByText('Started')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Terminated')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Shortlisted')[0]).toBeInTheDocument();


        const searchInput = screen.getAllByText('View Report')[0];
        fireEvent.click(searchInput);


        const backButton = screen.getByText('back');
        fireEvent.click(backButton);


    });


    test('failed api call component', async () => {

        adminServices.adminBatchStudents.mockRejectedValueOnce({
              status: 400,
              data: { "errorCode": "e1022", "errorMsg": "No institute" },
            });

        render(
            <MemoryRouter>
                <BatchDetails />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(adminServices.adminBatchStudents).toHaveBeenCalled();
        })
        expect(screen.getAllByText('No data available')[0]).toBeInTheDocument();

    });

    test('renders  and display data and delete student', async () => {

        adminServices.adminBatchStudents.mockResolvedValueOnce({
            status: 200,
            data:
                [
                    {
                        "student_id": 23,
                        "student_name": "Peter",
                        "student_email": "emyz224@gmail.com",
                        "student_phone": "9876782345",
                        "pass_out_year": 2024,
                        "cgpa": 8.0,
                        "no_of_backlogs": 0,
                        "student_status": 1,
                        "batch_mapping_status": 2,
                        "institution": "MEC K"
                    }
                ]
        }
        );
        adminServices.adminBatchDeleteStudents.mockResolvedValueOnce({
            status: 200,
            data: {
                message: "Batch deleted successfully"
            }
        });

        render(
            <MemoryRouter>
                <BatchDetails />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(adminServices.adminBatchStudents).toHaveBeenCalled();
        })

        expect(screen.getByText('Batch Students Details')).toBeInTheDocument();
        expect(screen.getByText('All Students')).toBeInTheDocument();
        fireEvent.click(screen.getByText('All Students'));
        expect(screen.getAllByText('Peter')[0]).toBeInTheDocument();
        expect(screen.getAllByTitle('Remove Student')[0]).toBeInTheDocument();
        const deleteButton = screen.getAllByTitle('Remove Student')[0];
        fireEvent.click(deleteButton);
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('confirm'));
        await waitFor(() => {
            expect(adminServices.adminBatchDeleteStudents).toHaveBeenCalled();
            // expect(screen.getByText('Student deleted successfully')).toBeInTheDocument();

        });
    });




    test('renders and displays data and search functionality', async () => {
        // Mock the response for fetching batch students
        adminServices.adminBatchStudents.mockResolvedValueOnce({
            status: 200,
            data: [
                {
                    "student_id": 23,
                    "student_name": "Peter",
                    "student_email": "emyz224@gmail.com",
                    "student_phone": "9876782345",
                    "pass_out_year": 2024,
                    "cgpa": 8.0,
                    "no_of_backlogs": 0,
                    "student_status": 1,
                    "batch_mapping_status": 2,
                    "institution": "MEC K"
                }
            ]
        });

        render(
            <MemoryRouter>
                <BatchDetails />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(adminServices.adminBatchStudents).toHaveBeenCalled();
        });
        expect(screen.getByTestId('Search')).toBeInTheDocument();
        const searchInput = screen.getByPlaceholderText('Enter Student Name/Email');
        fireEvent.change(searchInput, { target: { value: "Peter" } });
        fireEvent.click(screen.getByTitle('search'));
        // await waitFor(() => {
        //     // expect(adminServices.adminBatchStudents).toHaveBeenCalled(); // Ensure it's called twice
        //     expect(screen.getAllByText('Peter')[0]).toBeInTheDocument();
        // }); 

    });


});