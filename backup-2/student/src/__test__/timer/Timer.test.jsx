import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from '../../components/timer/Timer';

jest.mock('../../components/alert/DialogConfirmation', () => ({
    __esModule: true,
    default: ({ open, title, description, onConfirm }) => (
        open ? (
            <div data-testid="confirm-dialog">
                <h2>{title}</h2>
                <p>{description}</p>
                <button onClick={onConfirm}>OK</button>
            </div>
        ) : null
    ),
}));

describe('Timer Component', () => {
    jest.useFakeTimers();

    test('should render with initial time', () => {
        render(<Timer initialHour={1} initialMinutes={0} initialSeconds={5} />);
        expect(screen.getByText('01:00:05')).toBeInTheDocument();
    });

    test('should count down correctly', () => {
        render(<Timer initialHour={0} initialMinutes={0} initialSeconds={3} />);
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('00:00:02')).toBeInTheDocument();
    });

    test('should open modal when time is up', () => {
        const mockOnTimeOut = jest.fn();
        render(<Timer initialHour={0} initialMinutes={0} initialSeconds={1} onTimeOut={mockOnTimeOut} />);

        act(() => {
            jest.advanceTimersByTime(1000); 
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText('Your exam time has expired. The response has been submitted automatically. If you have any questions or need assistance, contact support.')).toBeInTheDocument();
        expect(mockOnTimeOut).toHaveBeenCalledTimes(1);
    });

    test('should reset timer when initial props change', () => {
        const { rerender } = render(<Timer initialHour={1} initialMinutes={0} initialSeconds={0} />);
        expect(screen.getByText('01:00:00')).toBeInTheDocument();

        rerender(<Timer initialHour={0} initialMinutes={10} initialSeconds={0} />);
        expect(screen.getByText('00:10:00')).toBeInTheDocument();
    });
});
