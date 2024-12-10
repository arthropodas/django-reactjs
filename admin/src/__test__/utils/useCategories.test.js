import { render, screen, waitFor } from '@testing-library/react';
import { adminServices } from '../../services/AdminServices';
import useCategories from '../../utils/useCategories';  // Adjust import as needed
import React from 'react';

jest.mock('../../services/AdminServices', () => ({
    dropdownLists: jest.fn(),
    adminGetCategoryQuestionsCount: jest.fn(),

}));


describe('useCategories hook', () => {
  it('should fetch and display category data', async () => {

    render(<useCategories />);

   
  });
});
