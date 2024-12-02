import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorCard from "../../../src/pages/admin/studentManagement/ErrorCard"
import '@testing-library/jest-dom';

const errorData = {
  errorCode: '400',
  errorMsg: {
    errors: {
      '1': {
        fieldName: {
          errorCode: 'E001',
          errorMsg: 'Invalid field value'
        }
      }
    },
    processedCount: 5,
    invalidCount: 1
  }
};

test('renders correctly when there are errors', () => {
  render(<ErrorCard errorData={errorData} />);
  
  // Verify the badge is in the document
  expect(screen.getByText(/file errors overview/i)).toBeInTheDocument();
  
  // Verify that the error for Row 1 is displayed
  expect(screen.getByText(/row 1/i)).toBeInTheDocument();
  
  // Verify that the specific error message is displayed
  expect(screen.getByText(/fieldname/i)).toBeInTheDocument();
  expect(screen.getByText(/invalid field value/i)).toBeInTheDocument();
  
  // Verify the invalid count
  expect(screen.getByText(/invalid count: 1/i)).toBeInTheDocument();
});

test('renders correctly when there are no errors', () => {
  const noErrorData = {
    errorCode: '200',
    errorMsg: {
      errors: {},
      processedCount: 10,
      invalidCount: 0
    }
  };
  
  render(<ErrorCard errorData={noErrorData} />);
  
  // Verify that "No errors found" message is displayed
  expect(screen.getByText(/no errors found/i)).toBeInTheDocument();
  
  // Verify the invalid count
  expect(screen.getByText(/invalid count: 0/i)).toBeInTheDocument();
});
