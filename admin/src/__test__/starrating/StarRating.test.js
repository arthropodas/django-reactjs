import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import StarRating from '../../components/starrating/StarRating';



describe('StarRating Component', () => {
    it('renders the correct number of stars', () => {
      render(<MemoryRouter><StarRating rating={3} setRating={() => {}} count={5} size={20} /> </MemoryRouter>);
  
      // Query by aria-label to select all stars
      const stars = screen.getAllByLabelText(/Star \d+/); // Matches aria-label="Star 1", "Star 2", etc.
      expect(stars).toHaveLength(5); // Ensure there are 5 stars rendered
    });
  
    it('resets hover state on mouse leave', () => {
        render(<StarRating rating={3} setRating={() => {}} count={5} />);
        
        const firstStar = screen.getByLabelText('Star 1'); 
        const secondStar = screen.getByLabelText('Star 2');
        fireEvent.mouseEnter(firstStar);
        expect(firstStar).toHaveStyle('color: #ffc107');
        fireEvent.mouseLeave(firstStar);
        fireEvent.mouseEnter(secondStar);
        expect(firstStar).toHaveStyle('color: #ffc107');
        fireEvent.mouseLeave(secondStar);
      });

      it('changes the rating when a star is clicked', () => {
        const setRatingMock = jest.fn();
        render(<StarRating rating={3} setRating={setRatingMock} count={5} size={20} />);
        
        // Click on the 4th star
        const fourthStar = screen.getAllByLabelText(/Star \d+/)[3]; // Assuming you're rendering the star elements correctly
        fireEvent.click(fourthStar);
      
        // Check that the setRating function was called with the correct argument (4)
        expect(setRatingMock).toHaveBeenCalledWith(4);
      });
      
  });
