import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropTypes from 'prop-types';
import CheckboxGroup from '../../components/checkbox/CheckBox';

PropTypes.checkPropTypes = jest.fn();

describe('CheckboxGroup Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    label: 'Test Label',
    options: [
      { id: '1', value: 'Option 1' },
      { id: '2', value: 'Option 2' },
    ],
    value: ['1'],
    onChange: mockOnChange,
    colorScheme: 'blue',
  };

  it('should render the component with label and options', () => {
    render(<CheckboxGroup {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  it('should check the checkbox if it is in the value array', () => {
    render(<CheckboxGroup {...defaultProps} />);

    expect(screen.getByLabelText('Option 1')).toBeChecked();
    expect(screen.getByLabelText('Option 2')).not.toBeChecked();
  });

  it('should call onChange with updated values when a checkbox is clicked', () => {
    render(<CheckboxGroup {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Option 2'));

    expect(mockOnChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('should remove the checkbox value when it is clicked again', () => {
    const initialProps = {
      ...defaultProps,
      value: ['1'],
    };

    render(<CheckboxGroup {...initialProps} />);

    fireEvent.click(screen.getByLabelText('Option 1'));

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('should handle an empty options array', () => {
    render(<CheckboxGroup {...defaultProps} options={[]} />);

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });
});
