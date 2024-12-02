import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import Footer from '../../components/studentFooter/Footer';

describe('testing student footer components', () => {
    test('rendering student footer elements', () => {
        render(
            <Footer
                onPrevious={() => {}}
                onNext={() => {}}
                currentQuestionIndex={1}
                totalQuestions={5}
            />
        );

        // Check if both buttons are rendered
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(2);
        expect(buttons[0]).toHaveTextContent('Previous');
        expect(buttons[1]).toHaveTextContent('Next');
    });
});
