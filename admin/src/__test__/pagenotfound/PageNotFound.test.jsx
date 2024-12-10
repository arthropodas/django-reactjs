import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageNotFound from '../../pages/pagenotfound/PageNotFound';

describe('PageNotFound Component', () => {
  test('renders without crashing', () => {
    render(<PageNotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});
