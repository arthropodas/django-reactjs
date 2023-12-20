

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // for additional matchers
import Login from '../Login/login'

describe("Page...", () => {
  const mockUseForm = useForm as jest.Mock;
  beforeEach(() => {`
    mockUseForm.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      formState: { errors: {}, isDirty: true, isSubmitting: false, isValid: true },
      register: jest.fn(),
      watch: jest.fn(),
      ...rest
    }));
  });
})
describe('Login component', () => {
  test('should show error for invalid email', async () => {
    render(<Login />);

    // Find the email input using its data-testid
    const emailInput = screen.getByTestId('email');

    // Trigger a change event on the email input with an invalid email value
    fireEvent.change(emailInput, { target: { value: 'invalid email' } });

    // Wait for the error message to be displayed
    await screen.findByText('Please enter a valid email address.');
  });
  test('hide show error when email is valid', async () => {
    render(<Login />);

    // Find the email input using its data-testid
    const emailInput = screen.getByTestId('email');

    // Trigger a change event on the email input with an invalid email value
    fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });

    // Wait for the error message to be displayed
    await waitFor(() =>
    expect(
      screen.queryByText('Please enter a valid email address.')
    ).not.toBeInTheDocument()
  );
  });


  test('should show error for invalid password', async () => {
    render(<Login />);


    const passwordInput = screen.getByTestId('password');

    // Trigger a change event on the email input with an invalid email value
    fireEvent.change(passwordInput, { target: { value: 'invpas' } });

    // Wait for the error message to be displayed
    await screen.findByText('Please enter a valid password.');
  });

  test('hide show error when password is valid', async () => {
    render(<Login />);

    // Find the email input using its data-testid
    const passwordInput = screen.getByTestId('email');

    // Trigger a change event on the email input with an invalid email value
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

    // Wait for the error message to be displayed
    await waitFor(() =>
    expect(
      screen.queryByText('Please enter a valid password address.')
    ).not.toBeInTheDocument()
  );
  });
  test('should trigger onSubmit when form is submitted with valid data', async () => {
    // Mock isFormValid as true
    const originalIsFormValid = Object.getOwnPropertyDescriptor(window, 'isFormValid');
    Object.defineProperty(window, 'isFormValid', { value: true, configurable: true });

    // Mock the onSubmit function
    const onSubmitMock = jest.fn();

    render(<Login onSubmit={onSubmitMock} />); // Pass onSubmit as a prop to the Login component

    // Fill in valid email and password
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });

    // Trigger form submission
    fireEvent.submit(screen.getByTestId('login-form'));

    // Wait for the asynchronous onSubmit function to be called
    

    // Assert that the onSubmit function was called
    expect(onSubmitMock).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123' },
      expect.anything() // You might need to adjust this expectation based on your actual onSubmit implementation
    );

    // Restore the original value of isFormValid
    
  });

 
});

import { useForm } from "react-hook-form";

jest.mock("react-hook-form");

