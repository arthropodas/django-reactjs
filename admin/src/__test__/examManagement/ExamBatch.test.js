import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { adminServices } from '../../services/AdminServices.js';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ExamBatch from '../../pages/admin/examManagement/ExamBatch.jsx';

jest.mock('../../services/AdminServices.js', () => ({
    adminServices: {
        adminBatchCreation: jest.fn(),
        adminBatchDeleteById: jest.fn(),
        adminBatchClose: jest.fn(),
        adminGetExamById: jest.fn()
    },
}));




describe('ExamBatch Component', () => {
    const mockFetchBatchDetails = jest.fn();
    const batchData = [
        { uuid: '123', batch_name: 'Batch 1', no_of_students: 30, batch_status: 1 },
    ];;

    beforeEach(() => {
        mockFetchBatchDetails.mockClear();
        adminServices.adminBatchCreation.mockResolvedValue({ status: 200 });
        adminServices.adminBatchDeleteById.mockResolvedValue({ status: 200 });
        adminServices.adminBatchClose.mockResolvedValue({ status: 200 });
    });

    const renderComponent = () => {
        render(
            <Router>
                <ExamBatch examStatus={1} fetchBatchDetails={mockFetchBatchDetails} batchData={batchData} />

            </Router>
        );
    };

    it('renders the ExamBatch component and displays batch data', async () => {
        renderComponent();
        expect(screen.getByText(/Exam Batches/i)).toBeInTheDocument();
        expect(screen.getByTitle('Add')).toBeInTheDocument();
    });

    it('opens modal to add a new batch when the "Add" button is clicked', async () => {
        renderComponent();
        const addButton = screen.getByTitle('Add');
        fireEvent.click(addButton);
        expect(screen.getByText(/Create New Batch/i)).toBeInTheDocument();

        const categoryNameInput = screen.getByTitle('batchName')
        expect(categoryNameInput).toBeInTheDocument();
        fireEvent.change(categoryNameInput, { target: { value: "Batch 1" } });
        expect(categoryNameInput.value).toBe("Batch 1");
        const submitButton = screen.getByText("Add");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(adminServices.adminBatchCreation).toHaveBeenCalled();

        })
    });

    it('opens modal to delete a batch button is clicked', async () => {
        renderComponent();
        const addButton = screen.getByTitle('Delete batch');
        fireEvent.click(addButton);

        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        const submitButton = screen.getByTitle("confirm");
        fireEvent.click(submitButton);

    });

    it('opens modal to view a batch button is clicked', async () => {
        renderComponent();
        const addButton = screen.getByTitle('View Detail');
        fireEvent.click(addButton);

    });


    it('handles status change for a batch', async () => {
        renderComponent();
    
        const selectStatusButton = screen.getByTestId('select-status');
        fireEvent.click(selectStatusButton);
    
        await waitFor(() => {
            const statusChangeButton = screen.getByText('CLOSED');
            fireEvent.click(statusChangeButton);
        });
    
        // await waitFor(() => {
        //     expect(screen.getByText('Confirm Status Change')).toBeInTheDocument();
        // });
    
        // fireEvent.click(screen.getByText('Confirm'));
        await waitFor(() => {
            expect(mockFetchBatchDetails).toHaveBeenCalledTimes(1);
        });
    });
    
    
});




describe('ExamBatch Component', () => {
    const mockFetchBatchDetails = jest.fn();
    const batchData = [
        { uuid: '123', batch_name: 'Batch 1', no_of_students: 30, batch_status: 1 },
    ];;

    beforeEach(() => {
        mockFetchBatchDetails.mockClear();
        adminServices.adminBatchCreation.mockRejectedValueOnce({ status: 400 });
        adminServices.adminBatchDeleteById.mockRejectedValueOnce({ status: 400 });
        adminServices.adminBatchClose.mockRejectedValueOnce({ status: 400 });
    });

    const renderComponent = () => {
        render(
            <Router>
                <ExamBatch examStatus={1} fetchBatchDetails={mockFetchBatchDetails} batchData={batchData} />

            </Router>
        );
    };

    

    it('opens modal to add a new batch when the "Add" button is clicked', async () => {
        renderComponent();
        const addButton = screen.getByTitle('Add');
        fireEvent.click(addButton);
        expect(screen.getByText(/Create New Batch/i)).toBeInTheDocument();

        const categoryNameInput = screen.getByTitle('batchName')
        expect(categoryNameInput).toBeInTheDocument();
        fireEvent.change(categoryNameInput, { target: { value: "Batch 1" } });
        expect(categoryNameInput.value).toBe("Batch 1");
        const submitButton = screen.getByText("Add");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(adminServices.adminBatchCreation).toHaveBeenCalled();

        })
    });

    it('opens modal to delete a batch button is clicked', async () => {
        renderComponent();
        const addButton = screen.getByTitle('Delete batch');
        fireEvent.click(addButton);

        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        const submitButton = screen.getByTitle("confirm");
        fireEvent.click(submitButton);

    });

 

    
    
    
});