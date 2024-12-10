// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import GenerateCSV from "../../components/downloadCSVButton/DownloadCSVButton";

// describe("GenerateCSV Component", () => {
//   const props = {
//     filename: "test.csv",
//     headers: ["Column1", "Column2", "Column3"],
//     buttonLabel: "Download CSV",
//     width: "60%",
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     // Mock createElement and appendChild for download functionality
//     document.createElement = jest.fn(() => ({
//       setAttribute: jest.fn(),
//       click: jest.fn(),
//       remove: jest.fn(),
//     }));
//     document.body.appendChild = jest.fn();
//     document.body.removeChild = jest.fn();
//   });

//   it("renders the button with correct label and styles", () => {
//     render(<GenerateCSV {...props} />);

//     const button = screen.getByText(props.buttonLabel);
//     expect(button).toBeInTheDocument();
//     expect(button).toHaveStyle(`width: ${props.width}`);
//     expect(button).toHaveStyle("height: 40px");
//   });

//   it("downloads a CSV file when the button is clicked", () => {
//     render(<GenerateCSV {...props} />);

//     const button = screen.getByText(props.buttonLabel);
//     fireEvent.click(button);

//     expect(document.createElement).toHaveBeenCalledWith("a");
//     expect(document.body.appendChild).toHaveBeenCalled();
//     expect(document.body.removeChild).toHaveBeenCalled();

//     const anchor = document.createElement.mock.results[0].value;
//     expect(anchor.setAttribute).toHaveBeenCalledWith("download", props.filename);
//     expect(anchor.click).toHaveBeenCalled();
//   });

//   it("sets the correct CSV content", () => {
//     render(<GenerateCSV {...props} />);

//     const button = screen.getByText(props.buttonLabel);

//     const mockBlob = jest.fn();
//     global.Blob = mockBlob;

//     fireEvent.click(button);

//     const expectedCSVContent = props.headers.join(",") + "\n";
//     expect(mockBlob).toHaveBeenCalledWith([expectedCSVContent], {
//       type: "text/csv;charset=utf-8;",
//     });
//   });
// });
