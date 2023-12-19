// // Login.test.js

// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// import { BrowserRouter as Router } from 'react-router-dom';

// import Login from '../Login/login';
// // import { login } from '../services';

// // jest.mock("axios", () => require("../../mocks/axiosMock"));
// // jest.mock('../services',()=>({
// //     login: jest.fn()
// // })
// // )

// // Mock the axios module
// // const mAxiosInstance = {
// //   post: jest.fn(),
// //   interceptors: {
// //     request: { use: jest.fn() },
// //     response: { use: jest.fn() },
// //   },
// // };

// // const axiosMock = {
// //   create: jest.fn(() => mAxiosInstance),
// // };



// // Other mocks or configurations can go here

// test('Login Component handles form submission', async () => {
//   // Mock the successful response from the login service
//   const mockAccessToken = 'mockAccessToken';
//   const mockUserType = 'customer';
//   const loginMockResponse = { access: mockAccessToken, user_type: mockUserType };
// //   Login.mockResolvedValueOnce(loginMockResponse);

//   render(
//     <Router>
//       <Login />
//     </Router>
//   );

//   // Simulate user input
// //   fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'mockUsername' } });
// //   fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'mockPassword' } });

// //   // Trigger the submit button click
// //   fireEvent.click(screen.getByText('Login'));

// //   // Wait for the asynchronous action to complete
// //   await waitFor(() => {
// //     // You might want to add assertions based on your component's behavior
// //     expect(screen.getByText('Account created successfully')).toBeInTheDocument();
// //   });

// //   // Ensure that the login service was called with the correct data
// //   expect(jest.requireMock('../services/login').login).toHaveBeenCalledWith({
// //     username: 'mockUsername',
// //     password: 'mockPassword',
// //   });
// });

// Login.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../Login/login';

test('should show error when email is empty', () => {
  render(<Login />);
  
    const emailInput = screen.getByTestId('email');
    fireEvent.change(emailInput, { target: { value: '' } });
  
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });