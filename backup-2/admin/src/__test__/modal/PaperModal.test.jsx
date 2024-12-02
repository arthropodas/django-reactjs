import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaperModal from "../../components/modal/PaperModal"; // Import the component
import '@testing-library/jest-dom'; 

describe("PaperModal component", () => {
  const handleClose = jest.fn();
  const onClose = jest.fn();

  const defaultProps = {
    open: true,
    onClose: onClose,
    handleClose: handleClose,
    children: <div>Modal Content</div>,
  };

  it("renders modal when open is true", () => {
    render(<PaperModal {...defaultProps} />);
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render modal when open is false", () => {
    const closedProps = { ...defaultProps, open: false };
    render(<PaperModal {...closedProps} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls handleClose when the close button is clicked", () => {
    render(<PaperModal {...defaultProps} />);
    const closeButton = screen.getByLabelText("Close"); 
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
