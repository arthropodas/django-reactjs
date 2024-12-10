import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/admin/login/Login";

// Mock `adminServices`
jest.mock("../../services/AdminServices", () => ({
  adminServices: {
    adminLogin: jest.fn(),
  },
}));

jest.mock('@react-oauth/google', () => ({
  __esModule: true, // Ensures named exports work correctly
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: jest.fn().mockImplementation(({ onSuccess }) => (
    <button data-testid="google-login" onClick={() => onSuccess({ credential: "mock_credential" })}>
      Google Login
    </button>
  )),
}));

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the login page correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verify that the Google login button is rendered
    expect(screen.getByText("Google Login")).toBeInTheDocument();

    // Verify that the header is present
    expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
  });



  // it("handles successful Google login", async () => {
  //   adminServices.adminLogin.mockResolvedValue({
  //     status: 200,
  //     data: {
  //       access_token: "mock_access_token",
  //       refresh_token: "mock_refresh_token",
  //       name: "John Doe",
  //       profile: "mock_profile_url",
  //     },
  //   });

  //   render(
  //     <MemoryRouter>
  //       <Login />
  //     </MemoryRouter>
  //   );

  //   // Click the Google login button
  //   fireEvent.click(screen.getByText("Google Login"));
    
  //   // Wait for the login process to complete
  //   await waitFor(() => expect(adminServices.adminLogin).toHaveBeenCalledTimes(1));
    
  //   // Check if the tokens are stored in localStorage
  //   expect(localStorage.getItem("accessToken")).toBe("mock_access_token");
  //   expect(localStorage.getItem("refreshToken")).toBe("mock_refresh_token");
  //   expect(localStorage.getItem("name")).toBe("John Doe");
  //   expect(localStorage.getItem("profile")).toBe("mock_profile_url");
  // });

  // it("handles Google login failure", async () => {
  //   adminServices.adminLogin.mockRejectedValueOnce({
  //     response: { data: { errorCode: 500 } },
  //   });

  //   render(
  //     <Router>
  //       <Login />
  //     </Router>
  //   );

  //   // Click the Google login button
  //   fireEvent.click(screen.getByText("Google Login"));

  //   // Wait for the error message
  //   await waitFor(() => expect(screen.getByText(/Google login failed/i)).toBeInTheDocument());
  // });

  // it("shows loading spinner during login", async () => {
  //   adminServices.adminLogin.mockResolvedValue({
  //     status: 200,
  //     data: {
  //       access_token: "mock_access_token",
  //       refresh_token: "mock_refresh_token",
  //       name: "John Doe",
  //       profile: "mock_profile_url",
  //     },
  //   });

  //   render(
  //     <Router>
  //       <Login />
  //     </Router>
  //   );

  //   // Click the Google login button
  //   fireEvent.click(screen.getByText("Google Login"));
    
  //   // Check if the loading spinner is shown
  //   expect(screen.getByText("Loading...")).toBeInTheDocument();

  //   // Wait for the login to complete
  //   await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
  // });

  // it("displays error message on login failure", async () => {
  //   const errorMessage = "Invalid credentials";
  //   adminServices.adminLogin.mockRejectedValueOnce({
  //     response: { data: { errorCode: "INVALID_CREDENTIALS" } },
  //   });

  //   render(
  //     <Router>
  //       <Login />
  //     </Router>
  //   );

  //   // Click the Google login button
  //   fireEvent.click(screen.getByText("Google Login"));

  //   // Wait for the error message to appear
  //   await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
  // });
});









// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import Login from "../../pages/admin/login/Login";
// import SwalAlert from "../../components/alert/SwalAlert";
// import { useNavigate } from 'react-router-dom';
// import { adminServices } from "../../services/AdminServices";
// import '@testing-library/jest-dom';
// // Mock SwalAlert
// jest.mock("../../components/alert/SwalAlert", () => jest.fn());
// jest.mock("../../assets/innov_logo.png", () => () => <h1>Mocked Profile Image</h1>);
// jest.mock("../../assets/image.png", () => () => <h1>Mocked Image</h1>);

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: jest.fn(),
// }));

// jest.mock('../../services/AdminServices', () => ({
//   adminServices: {
//     adminLogin: jest.fn(),
//     adminForgotPassword: jest.fn(),
//   },
// }));

// describe("Login Component", () => {
//   const navigateMock = jest.fn();
//   beforeEach(() => {
//     // Clear all instances and calls to constructor and all methods:
//     jest.clearAllMocks();
//     jest.spyOn(Storage.prototype, 'setItem');
//     useNavigate.mockReturnValue(navigateMock);
//   });

//   test("renders Login component correctly and navigates to dashboard on submit", async () => {
//     const mockResponse = {
//       data: {
//         access_token: "mockAccessToken",
//         refresh_token: "mockRefreshToken",
//       },
//     };

//     adminServices.adminLogin.mockResolvedValue(mockResponse);

//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText(/Email/i);
//     const passwordInput = screen.getByPlaceholderText(/Password/i);
//     const loginButton = screen.getByRole('button', { name: /login/i });

//     fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
//     fireEvent.change(passwordInput, { target: { value: "test@123" } });
//     fireEvent.click(loginButton);

//     await waitFor(() => {
//       expect(adminServices.adminLogin).toHaveBeenCalledWith({
//         email: 'test@gmail.com',
//         password: 'test@123',
//       });
//       expect(localStorage.setItem).toHaveBeenCalledWith("accessToken", "mockAccessToken");
//       expect(localStorage.setItem).toHaveBeenCalledWith("refreshToken", "mockRefreshToken");

//     });
//   });
//   test("handles error in form submission and error message", async () => {
//     render(<Login />);
//     const emailInput = screen.getByPlaceholderText(/Email/i);
//     const passwordInput = screen.getByPlaceholderText(/Password/i);
//     const loginButton = screen.getByRole('button', { name: /login/i });

//     fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
//     fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

//     // Mock the adminLogin error response
//     adminServices.adminLogin.mockRejectedValue({
//       response: {
//         data: {
//           errorMsg: "Invalid password or email credentials",
//         },
//       },
//     });

//     fireEvent.click(loginButton);

//     waitFor(() => {
//       expect(screen.getByText("Invalid password or email credentials")).toBeInTheDocument();
//     });
//   });

//   test("handles password reset success", async () => {
//     const mockResponse = { status: 200 };
//     adminServices.adminForgotPassword.mockResolvedValue(mockResponse);

//     render(<Login />);
//     fireEvent.click(screen.getByText(/Forgot password\?/i));

//     await waitFor(() => {
//       expect(SwalAlert).toHaveBeenCalledWith(
//         expect.objectContaining({
//           title: "Password Reset",
//           text: "A password reset link has been sent to your email. Please follow the instructions to reset your password.",
//           confirmButtonText: "OK",
//         })
//       );
//     });
//   });

//   test("handles password reset error", async () => {
//     const mockError = {
//       response: {
//         data: {
//           errorMsg: "An error occured while processing your request. Please try again later.",
//         },
//       },
//     };
//     adminServices.adminForgotPassword.mockRejectedValue(mockError);

//     render(<Login />);
//     fireEvent.click(screen.getByText(/Forgot password\?/i));

//     await waitFor(() => {
//       expect(SwalAlert).toHaveBeenCalledWith(
//         expect.objectContaining({
//           title: "Password Reset",
//           text: "An error occured while processing your request. Please try again later.",
//           confirmButtonText: "OK",
//         })
//       );
//     });
//   });
//   test("password visibility when eye icon is clicked in user login", () => {
//     render(<Login />);
//     const passwordInputValueData = screen.getByPlaceholderText("Password");
//     const eyeIcon = screen.getByTestId("eye-icon");  
//     expect(passwordInputValueData.getAttribute("type")).toBe("password");  
//     fireEvent.click(eyeIcon);  
//     expect(passwordInputValueData.getAttribute("type")).toBe("text");  
//     fireEvent.click(eyeIcon);  
//     expect(passwordInputValueData.getAttribute("type")).toBe("password");
//   });
// });
