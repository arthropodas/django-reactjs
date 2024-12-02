import React from "react";
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RedirectIfAuthenticated from '../../../services/authentication/RedirectAuthentication';
import Login from '../../../pages/admin/login/Login';
import Home from '../../../pages/admin/home/Home';

test('redirects authenticated users from login to dashboard', () => {
  localStorage.setItem('accessToken', 'mockToken');

  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.queryByText('Login')).toBeNull();
});
