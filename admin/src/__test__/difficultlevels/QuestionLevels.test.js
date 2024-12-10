
import React from "react";


import QuestionLevels from "../../components/difficultlevels/QuestionLevels";
import { MemoryRouter } from 'react-router-dom';

import { render, screen, fireEvent } from "@testing-library/react";


// QuestionLevels.test.js
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
describe("QuestionLevels Component", () => {
  let onLevelChangeMock;

  beforeEach(() => {
    onLevelChangeMock = jest.fn(); // Mock the onLevelChange function
  });

  it("renders the component with sliders and inputs", () => {
    render(
    <MemoryRouter> <QuestionLevels onLevelChange={onLevelChangeMock} /></MemoryRouter>
   );

    expect(screen.getAllByPlaceholderText(/Max Value/i)).toHaveLength(3);
  });

  

  it("updates Hard level value when input changes", () => {
    render(
        <MemoryRouter> <QuestionLevels onLevelChange={onLevelChangeMock} /></MemoryRouter>
       );

    const hardInput = screen.getAllByPlaceholderText(/Max Value/i)[0]; // Get Hard level input
    fireEvent.change(hardInput, { target: { value: "70" } });

    // Verify that the input updates correctly
    expect(hardInput.value).toBe("70");

    // Verify that onLevelChange is called with the updated values
    expect(onLevelChangeMock).toHaveBeenCalledWith({
      hard: 70,
      medium: 50,
      easy: 50,
    });
  });

  it("prevents invalid values in the inputs", () => {
    render(
        <MemoryRouter> <QuestionLevels onLevelChange={onLevelChangeMock} /></MemoryRouter>
       );

    const hardInput = screen.getAllByPlaceholderText(/Max Value/i)[0]; // Get Hard level input
    fireEvent.change(hardInput, { target: { value: "200" } });

    // Verify that the input value does not exceed 100
    expect(hardInput.value).not.toBe("200");

    // Verify that onLevelChange is not called with invalid values
    expect(onLevelChangeMock).not.toHaveBeenCalledWith({
      hard: 200,
      medium: 50,
      easy: 50,
    });
  });

//   it("handles Medium level slider and input changes", () => {
//     render(<QuestionLevels onLevelChange={onLevelChangeMock} />);

//     const mediumSlider = screen.getAllByRole("slider")[1]; // Get Medium level slider
//     fireEvent.change(mediumSlider, { target: { value: 40 } });

//     // Verify that onLevelChange is called with updated Medium level
//     expect(onLevelChangeMock).toHaveBeenCalledWith({
//       hard: 30,
//       medium: 40,
//       easy: 50,
//     });

//     const mediumInput = screen.getAllByPlaceholderText(/Max Value/i)[1]; // Get Medium level input
//     fireEvent.change(mediumInput, { target: { value: "45" } });

//     // Verify that the Medium level input updates correctly
//     expect(mediumInput.value).toBe("45");
//   });

//   it("handles Easy level slider and input changes", () => {
//     render(<QuestionLevels onLevelChange={onLevelChangeMock} />);

//     const easySlider = screen.getAllByRole("slider")[2]; // Get Easy level slider
//     fireEvent.change(easySlider, { target: { value: 35 } });

//     // Verify that onLevelChange is called with updated Easy level
//     expect(onLevelChangeMock).toHaveBeenCalledWith({
//       hard: 30,
//       medium: 50,
//       easy: 35,
//     });

//     const easyInput = screen.getAllByPlaceholderText(/Max Value/i)[2]; // Get Easy level input
//     fireEvent.change(easyInput, { target: { value: "40" } });

//     // Verify that the Easy level input updates correctly
//     expect(easyInput.value).toBe("40");
//   });
});
