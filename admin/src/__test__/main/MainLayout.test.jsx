import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../../pages/admin/main/MainLayout';

describe('testing main layout page', () => {
    test('rendering main layout page', () => {
        render(
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        );

        expect(screen.getByText('RECRUIT SYSTEM')).toBeInTheDocument();

    });




})