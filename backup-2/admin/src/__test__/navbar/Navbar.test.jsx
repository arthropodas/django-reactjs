import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import Navbar from '../../components/navbar/Navbar';

describe('testing navbar component', () => {
    test('rendering navbar elements', () => {
        render(<Navbar />);

        expect(screen.getByText('Admin')).toBeInTheDocument();
    });
})