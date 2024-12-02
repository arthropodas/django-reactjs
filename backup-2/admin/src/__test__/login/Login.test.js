import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../pages/admin/login/Login";
import SwalAlert from "../../components/alert/SwalAlert";
import { useNavigate } from 'react-router-dom';
import { adminServices } from "../../services/AdminServices";
import '@testing-library/jest-dom';
// Mock SwalAlert
jest.mock("../../components/alert/SwalAlert", () => jest.fn());
jest.mock("../../assets/innov_logo.png", () => () => <h1>Mocked Profile Image</h1>);
jest.mock("../../assets/image.png", () => () => <h1>Mocked Image</h1>);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../services/AdminServices', () => ({
  adminServices: {
    adminLogin: jest.fn(),
    adminForgotPassword: jest.fn(),
  },
}));

describe("Login Component", () => {
  const navigateMock = jest.fn();
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
    jest.spyOn(Storage.prototype, 'setItem');
    useNavigate.mockReturnValue(navigateMock);
  });

  test("renders Login component correctly and navigates to dashboard on submit", async () => {
    const mockResponse = {
      data: {
        access_token: "mockAccessToken",
        refresh_token: "mockRefreshToken",
      },
    };

    adminServices.adminLogin.mockResolvedValue(mockResponse);

    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: "test@123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(adminServices.adminLogin).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: 'test@123',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith("accessToken", "mockAccessToken");
      expect(localStorage.setItem).toHaveBeenCalledWith("refreshToken", "mockRefreshToken");

    });
  });
  test("handles error in form submission and error message", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // Mock the adminLogin error response
    adminServices.adminLogin.mockRejectedValue({
      response: {
        data: {
          errorMsg: "Invalid password or email credentials",
        },
      },
    });

    fireEvent.click(loginButton);

    waitFor(() => {
      expect(screen.getByText("Invalid password or email credentials")).toBeInTheDocument();
    });
  });

  test("handles password reset success", async () => {
    const mockResponse = { status: 200 };
    adminServices.adminForgotPassword.mockResolvedValue(mockResponse);

    render(<Login />);
    fireEvent.click(screen.getByText(/Forgot password\?/i));

    await waitFor(() => {
      expect(SwalAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password Reset",
          text: "A password reset link has been sent to your email. Please follow the instructions to reset your password.",
          confirmButtonText: "OK",
        })
      );
    });
  });

  test("handles password reset error", async () => {
    const mockError = {
      response: {
        data: {
          errorMsg: "An error occured while processing your request. Please try again later.",
        },
      },
    };
    adminServices.adminForgotPassword.mockRejectedValue(mockError);

    render(<Login />);
    fireEvent.click(screen.getByText(/Forgot password\?/i));

    await waitFor(() => {
      expect(SwalAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password Reset",
          text: "An error occured while processing your request. Please try again later.",
          confirmButtonText: "OK",
        })
      );
    });
  });
  test("password visibility when eye icon is clicked in user login", () => {
    render(<Login />);
    const passwordInputValueData = screen.getByPlaceholderText("Password");
    const eyeIcon = screen.getByTestId("eye-icon");  
    expect(passwordInputValueData.getAttribute("type")).toBe("password");  
    fireEvent.click(eyeIcon);  
    expect(passwordInputValueData.getAttribute("type")).toBe("text");  
    fireEvent.click(eyeIcon);  
    expect(passwordInputValueData.getAttribute("type")).toBe("password");
  });
});
