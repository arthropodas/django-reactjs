import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Instructions from '../../pages/student/instructions/Instructions';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

describe('testing the instruction pages component', () => {
    test('rendering the instructions page elements', () => {

        render(
            <MemoryRouter>
                <Instructions />
            </MemoryRouter>
        );

        expect(screen.getByText('Instructions for the Test')).toBeInTheDocument();
    });

    test('should navigate to questions with the correct state and set local storage when button is clicked', () => {

        delete window.location;
        window.location = new URL('http://localhost?token=mock-token');

        render(
            <MemoryRouter>
                <Instructions />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Start Test'));

        expect(localStorage.getItem('token')).toBe('mock-token');

        expect(mockNavigate).toHaveBeenCalledWith('questions', { state: { tokenFromUrl: 'mock-token' } });
    });
});