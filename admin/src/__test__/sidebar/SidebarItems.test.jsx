import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SidebarItems from '../../components/sidebar/SidebarItems';
import { IoMdHome } from "react-icons/io";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('SidebarItems Component', () => {
    const icon = <IoMdHome />;
    const label = 'Test Label';
    const path = '/test-path';

    test('renders icon and label', () => {
        render(
            <MemoryRouter>
                <SidebarItems icon={icon} label={label} path={path} />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });
});
