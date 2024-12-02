import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomModal from '../../components/modal/CommonModal';
import { Formik } from 'formik';
import '@testing-library/jest-dom';

// Mock props for the test
const mockProps = {
  open: true,
  handleClose: jest.fn(),
  title: 'Test Modal',
  buttonLabel: 'Submit',
  fields: [
    { label: 'Option 1', type: 'text', name: 'option1', defaultValue: '' },
    { label: 'Option 2', type: 'file', name: 'option2' },
  ],
  onConfirm: jest.fn(),
  onAddOption: jest.fn(),
  onRemoveOption: jest.fn(),
  setCorrectAnswer: jest.fn(),
  correctAnswer: [],
  validationSchema: {},
  initialValues: { option1: '', option2: '' },
};

// Test Suite for CustomModal component
describe('CustomModal Component', () => {
  it('renders modal with the provided title', () => {
    render(<CustomModal {...mockProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

 

  it('calls handleClose when cancel button is clicked', () => {
    render(<CustomModal {...mockProps} />);

    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);

    expect(mockProps.handleClose).toHaveBeenCalled();
  });

  it('renders custom components like Checkbox and Delete icon', () => {
    const checkboxProps = {
      ...mockProps,
      fields: [
        {
          label: 'Option 1',
          type: 'text',
          name: 'option1',
          isOptionField: true,
          checked: true,
        },
      ],
      boolean: true,
    };

    render(<CustomModal {...checkboxProps} />);

    // Check if checkbox is rendered
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    const errorProps = {
      ...mockProps,
      error: 'Something went wrong!',
    };

    render(<CustomModal {...errorProps} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('calls onAddOption when + Add Option button is clicked', () => {
    const addOptionProps = {
      ...mockProps,
      boolean: true,
    };

    render(<CustomModal {...addOptionProps} />);

    const addOptionButton = screen.getByText('+ Add Option');

    fireEvent.click(addOptionButton);

    expect(mockProps.onAddOption).toHaveBeenCalled();
  });


  it('calls onConfirm when form is submitted', async () => {
    const mockOnConfirm = jest.fn();
    const mockProps = {
      open: true,
      handleClose: jest.fn(),
      title: 'Test Modal',
      buttonLabel: 'Submit',
      fields: [
        {
          label: 'Name',
          type: 'text',
          name: 'name',
        },
      ],
      onConfirm: mockOnConfirm,
      // ... other required props
    };
    render(<CustomModal {...mockProps} />);
    const submitButton = await screen.findByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockOnConfirm).toHaveBeenCalledTimes(1));

    // Additional Assertions on mockOnConfirm arguments if needed
  });

});
