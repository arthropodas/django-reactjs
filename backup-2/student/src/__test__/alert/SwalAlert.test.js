import React from 'react';
import { render } from '@testing-library/react';
import SwalAlert from '../../components/alert/SwalAlert';
import { MemoryRouter } from 'react-router-dom';


describe('SwalAlert Component', () => {
  test('initial rendering', () => {
      render(
          <MemoryRouter>
              <SwalAlert />
          </MemoryRouter>
      );

  });
})