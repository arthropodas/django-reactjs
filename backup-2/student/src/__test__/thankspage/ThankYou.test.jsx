import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThankYou from "../../pages/student/thankspage/ThankYou";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../assets/thanks.png", () => () => <h1>Thanks Image</h1>);
jest.mock(
  "../../components/modal/PaperModal",
  () =>
    ({ open, handleClose }) => {
      return open ? (
        <div role="dialog">
          <button onClick={handleClose}>Close Modal</button>
        </div>
      ) : null;
    }
);

describe("ThankYou Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <ThankYou />
      </MemoryRouter>
    );

    expect(screen.getByText("Thank You!")).toBeInTheDocument();
    expect(
      screen.getByText("Your responses have been submitted successfully!!!")
    ).toBeInTheDocument();
    expect(screen.getByAltText("exam submission")).toBeInTheDocument();
  });

  test("does not open feedback modal if no token is in localStorage", () => {
    render(
      <MemoryRouter>
        <ThankYou />
      </MemoryRouter>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes feedback modal when handleFeedbackCloseModal is called", () => {
    localStorage.setItem("token", "some-valid-token");

    render(
      <MemoryRouter>
        <ThankYou />
      </MemoryRouter>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Modal"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
