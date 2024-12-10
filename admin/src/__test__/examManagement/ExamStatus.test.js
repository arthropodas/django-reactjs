import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { adminServices } from '../../services/AdminServices.js';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ExamStatus from '../../pages/admin/examManagement/ExamStatus.jsx';



jest.mock('../../services/AdminServices.js', () => ({
    adminServices: {
        adminDeleteExam: jest.fn(),
        adminForceCompleteExam: jest.fn(),
        adminBatchStudentDetails: jest.fn(),
    },
}));

describe('ExamStatus Component', () => {

    const mockOnExamStatusChange = jest.fn();
    const mockFetchBatchDetails = jest.fn();

    const defaultProps = {
        examStatus: 1, // use a valid exam status ID
        examId: 123, // example exam ID
        onExamStatusChange: mockOnExamStatusChange,
        fetchBatchDetails: mockFetchBatchDetails
    };

    beforeEach(() => {
        // Reset mocks before each test
        mockOnExamStatusChange.mockClear();
        mockFetchBatchDetails.mockClear();
        adminServices.adminDeleteExam.mockResolvedValue({ status: 200 });
        adminServices.adminForceCompleteExam.mockResolvedValue({ status: 200 });
    });

    it('renders the ExamStatus component correctly', () => {
        render(<ExamStatus {...defaultProps} />);

        // Check if the select element and status options are rendered
        expect(screen.getByTestId('select-status')).toBeInTheDocument();
        expect(screen.getAllByText('Exam Status')[0]).toBeInTheDocument();
    });

    it('opens status change confirmation dialog when a new status is selected', async () => {
        render(<ExamStatus {...defaultProps} />);

        // Simulate selecting a new status
        fireEvent.change(screen.getByTestId('select-status'), { target: { value: 2 } });

        // Wait for and confirm that the modal appears
        await waitFor(() => {
            expect(screen.getByText('Confirm Status Change')).toBeInTheDocument();
        });
    });

    it('calls the API to change status and shows success toast on success', async () => {
        render(<ExamStatus {...defaultProps} />);
        fireEvent.change(screen.getByTestId('select-status'), { target: { value: 2 } });
        expect(screen.getByText('Are you sure you want to change the status of this exam?'));
        const submitButton = screen.getByTestId('confirm');
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(adminServices.adminDeleteExam).toHaveBeenCalledWith(defaultProps.examId, { examStatus: 2 });

        });
        expect(mockOnExamStatusChange).toHaveBeenCalled();
    });

    it('handles error and shows warning modal when specific error occurs', async () => {
        adminServices.adminDeleteExam.mockRejectedValueOnce({
            response: { data: { errorCode: 'e1126' } }
        });
        

        render(<ExamStatus {...defaultProps} />);

        fireEvent.change(screen.getByTestId('select-status'), { target: { value: 2 } });
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Confirm Batch Close')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(adminServices.adminForceCompleteExam).toHaveBeenCalledWith(defaultProps.examId, { examStatus: 2 });
        });
    });

    it('handles status change and does not trigger force completion when error is different', async () => {
        adminServices.adminDeleteExam.mockRejectedValueOnce({
            response: { data: { errorCode: 'e9999' } }
        });

        render(<ExamStatus {...defaultProps} />);

        fireEvent.change(screen.getByTestId('select-status'), { target: { value: 2 } });
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
        });
    });

    it('closes modals correctly when cancelled', async () => {
        render(<ExamStatus {...defaultProps} />);
        fireEvent.change(screen.getByTestId('select-status'), { target: { value: 2 } });

        await waitFor(() => {
            expect(screen.getByText('Confirm Status Change')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Cancel'));
    });

   
    it('shows warning modal and close it ', async () => {
        adminServices.adminDeleteExam.mockRejectedValueOnce({
            response: { data: { errorCode: 'e1126' } }
        });
        

        render(<ExamStatus {...defaultProps} />);

        fireEvent.change(screen.getByTestId('select-status'), { target: { value: 2 } });
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Confirm Batch Close')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Cancel'));
    });



});