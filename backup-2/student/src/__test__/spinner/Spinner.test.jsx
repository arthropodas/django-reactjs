import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../../components/spinner/Spinner";
import "@testing-library/jest-dom";

describe("rendering spinner component", () => {
  test("it renders the spinner using data-testid", () => {
    render(<LoadingSpinner />);

    // Finding the spinner using the data-testid
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });
});
