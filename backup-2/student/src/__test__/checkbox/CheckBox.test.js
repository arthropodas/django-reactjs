import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import CheckboxGroup from '../../components/checkbox/CheckBox';

describe('CheckboxGroup Component', () => {
    const mockOnChange = jest.fn();
  
    const options = [
      { id: '1', value: 'Option 1' },
      { id: '2', value: 'Option 2' },
    ];
  
    test('calls onChange with correct values', () => {
        const initialValues = ['1'];
        render(<CheckboxGroup label="" options={options} value={initialValues} onChange={mockOnChange} />);
    
        const option2Checkbox = screen.getByLabelText('Option 2');
    
        fireEvent.click(option2Checkbox);
    
        // Expect onChange to be called with updated values
        expect(mockOnChange).toHaveBeenCalledWith([...initialValues, '2']);
      });

  
    // test('handles checkbox selection and deselection', () => {
    //   render(<CheckboxGroup label="" options={options} value={[]} onChange={mockOnChange} />);
  
    //   const option1Checkbox = screen.getByLabelText('Option 1');
    //   const option2Checkbox = screen.getByLabelText('Option 2');
  
    //   // Check initial state (unchecked)
    //   expect(option1Checkbox).not.toBeChecked();
    //   expect(option2Checkbox).not.toBeChecked();
  
    //   // Click checkbox to select
    //   fireEvent.click(option1Checkbox);
    //   expect(mockOnChange).toHaveBeenCalledWith(['1']);
  
    //   // Click checkbox again to deselect
    //   fireEvent.click(option1Checkbox);
    //   expect(mockOnChange).toHaveBeenCalledWith([]);
    // });
  
    // test('handles pre-selected checkboxes', () => {
    //   render(<CheckboxGroup label="" options={options} value={['1']} onChange={mockOnChange} />);
  
    //   const option1Checkbox = screen.getByLabelText('Option 1');
    //   const option2Checkbox = screen.getByLabelText('Option 2');
  
    //   // Check that option 1 is initially selected
    //   expect(option1Checkbox).toBeChecked();
    //   expect(option2Checkbox).not.toBeChecked();
    // });
  
    
  
  
  });