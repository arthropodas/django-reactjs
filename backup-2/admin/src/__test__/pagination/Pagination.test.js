import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomPagination from "../../components/pagination/Pagination";
import "@testing-library/jest-dom";

describe('CustomPagination Component', () => {

    const mockHandlePrevious = jest.fn();
    const mockHandleNext = jest.fn();
    const mockSetCurrentPage = jest.fn();

    const renderComponent = (currentPage, totalPages) => {
        render(
            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePrevious={mockHandlePrevious}
                handleNext={mockHandleNext}
                setCurrentPage={mockSetCurrentPage}
            />
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders CustomPagination component', () => {
        renderComponent(1, 5);
        expect(screen.getByText(/Page: 1 of 5/)).toBeInTheDocument();
    });

    test('disables "First" and "Previous" buttons on the first page', () => {
        renderComponent(1, 5);
        expect(screen.getByTitle('First')).toBeDisabled();
        expect(screen.getByTitle('Previous')).toBeDisabled();
    });

    test('disables "Next" and "Last" buttons on the last page', () => {
        renderComponent(5, 5);
        expect(screen.getByTitle('Next')).toBeDisabled();
        expect(screen.getByTitle('Last')).toBeDisabled();
    });

    test('clicking "First" button changes page to 1', () => {
        renderComponent(3, 5);
        fireEvent.click(screen.getByTitle('First'));
        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    });
    

    test('clicking "Last" button changes page to the last page', () => {
        renderComponent(3, 5);
        fireEvent.click(screen.getByTitle('Last'));
        expect(mockSetCurrentPage).toHaveBeenCalledWith(5);
    });

    
    test('displays correct page and total pages', () => {
        renderComponent(3, 5);
        expect(screen.getByText('Page: 3 of 5')).toBeInTheDocument();
    });

    test('clicking a disabled "First" button does nothing', () => {
        renderComponent(1, 5);
        fireEvent.click(screen.getByTitle('First'));
        expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    test('clicking a disabled "Previous" button does nothing', () => {
        renderComponent(1, 5);
        fireEvent.click(screen.getByTitle('Previous'));
        expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    test('handles non-adjacent page changes correctly', () => {
        renderComponent(3, 5);
        fireEvent.click(screen.getByTitle('First'));
        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
        fireEvent.click(screen.getByTitle('Last'));
        expect(mockSetCurrentPage).toHaveBeenCalledWith(5);
    });
});
