import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';

// Mock onClose function
const onCloseMock = jest.fn();

describe('Sidebar Component Tests', () => {
    test('logout functionality', () => {
        const localStorageMock = jest.spyOn(Storage.prototype, 'clear');

        const originalLocation = window.location;
        delete window.location;
        window.location = { replace: jest.fn() };

        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Logout'));
        expect(localStorageMock).toHaveBeenCalled();
        expect(window.location.replace).toHaveBeenCalledWith('/');
        localStorageMock.mockRestore();
        window.location = originalLocation;
    });

    test('handleItemClick updates activePath and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Sections'));
        expect(onCloseMock).toHaveBeenCalled();
    });
    test('handleItemClick updates activePath when click on questions and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Question Bank'));
        expect(onCloseMock).toHaveBeenCalled();
    });
    test('handleItemClick updates activePath when click on questions and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Questionnaire'));
        expect(onCloseMock).toHaveBeenCalled();
    });
    test('handleItemClick updates activePath when click on exam and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Exam'));
        expect(onCloseMock).toHaveBeenCalled();
    });
    test('handleItemClick updates activePath when click on students and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Students'));
        expect(onCloseMock).toHaveBeenCalled();
    });
    test('handleItemClick updates activePath when click on institution and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Institution'));
        expect(onCloseMock).toHaveBeenCalled();
    });
    test('handleItemClick updates activePath when click on Feedback and calls onClose', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={onCloseMock} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Feedbacks'));
        expect(onCloseMock).toHaveBeenCalled();
    });
});
