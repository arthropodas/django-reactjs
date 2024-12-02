import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import StudentNav from '../../components/studentNav/StudentNav';

jest.mock('../../assets/innov_logo.png', () => 'test-file-stub');

describe('testing student navbar component', () => {
    test('rendering the navbar without crashing', () => {
        render(
            <StudentNav />
        );

        expect(screen.getByAltText('Innovature logo')).toBeInTheDocument();
    });
});
