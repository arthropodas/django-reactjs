import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminProtected from '../../../services/authentication/AdminProtected';
import Home from '../../../pages/admin/home/Home';
import '@testing-library/jest-dom';
test('redirects unauthenticated users from dashboard to login', () => {
  localStorage.removeItem('accessToken');

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<AdminProtected><Home /></AdminProtected>} />
        <Route path="/" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('shows dashboard for authenticated users', () => {
  localStorage.setItem('accessToken', 'mockToken');

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<AdminProtected><Home /></AdminProtected>} />
        <Route path="/" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Question Sections')).toBeInTheDocument();
});
