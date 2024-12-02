import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmDialog from '../../components/alert/DialogConfirmation';

describe('ConfirmDialog Component', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  const renderDialog = (open) =>
    render(
      <ConfirmDialog
        open={open}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

  it('should render the dialog with the provided title and description', () => {
    renderDialog(true);

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to perform this action?')
    ).toBeInTheDocument();
  });

  it('should call onClose when the Cancel button is clicked', () => {
    renderDialog(true);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when the Confirm button is clicked', () => {
    renderDialog(true);

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('should not render the dialog when open is false', () => {
    renderDialog(false);

    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });
});
