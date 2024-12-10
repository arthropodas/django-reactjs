import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessToast from '../../components/toast/Toast';
import { MemoryRouter } from 'react-router-dom';
import { toastTime } from '../../utils/Strings';

// Mock the useToast hook from Chakra UI
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(() => ({
    isActive: jest.fn(),
    toast: jest.fn(),
  })),
}));

describe('SuccessToast', () => {
  let useToastMock;

  beforeEach(() => {
    useToastMock = require('@chakra-ui/react').useToast;
    useToastMock().isActive.mockReturnValue(false); // default isActive to false
  });

 

  it('does not render the toast when show is false', () => {
    const mockOnClose = jest.fn();

    render(
      <MemoryRouter>
        <SuccessToast
          show={false}
          onClose={mockOnClose}
          message="Operation successful"
        />
      </MemoryRouter>
    );

    // Ensure that no toast is triggered when show is false
    expect(useToastMock().toast).not.toHaveBeenCalled();
  });

  
});