import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MemoryRouter } from 'react-router-dom';

import Navbar from '../../components/navbar/Navbar';

describe('testing navbar component', () => {
    test('rendering navbar elements', () => {
        render( <MemoryRouter><Navbar /></MemoryRouter>);

        // expect(screen.getByText('Admin')).toBeInTheDocument();
    });
})