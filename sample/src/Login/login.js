// Inside your Login component
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import MuiTextField from '../components/common/MuiTextField'; 
import Box from '@mui/material/Box';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';


const defaultTheme = createTheme();
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const onSubmit = (data, event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const formData = {
      email: data.email,
      password: data.password,
    };
  
    // Now formData contains email and password
    console.log('Form Data:', formData);
    // You can proceed to send this data to the server or perform other actions.
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const isFormValid = Object.keys(errors).length === 0; // Check if there are no errors

  return (
<ThemeProvider theme = {defaultTheme}>
<Container>

            <div className="card shadow-lg justify-content-center" style={{ border: '0', maxWidth: '400px', minHeight: '400px' }}>
              <div className="card-header text-primary" style={{ border: '0', backgroundColor: 'white' }}>
                <h3 className="text-center login-title">Let's Sign you in</h3>
                {/* Error or information message */}
                {errorMessage ? (
                  <p className="email-text text-center" style={{ color: 'red' }}>{errorMessage}</p>
                ) : (
                  <p className="email-text text-center">Please enter your email and password</p>
                )}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                 
                  <Box>

                    <MuiTextField
                      label="Email"
                     
                      error={!!errors.email}
                      helperText={errors.email && 'Please enter a valid email address.'}
                      registerProps={register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                    />
                  </Box>
                  
                  {/* Password TextField with eye icon */}
                  <div className=" mb-3 position-relative">
                    <MuiTextField
                      label="Password"
                      type={passwordVisibility ? 'text' : 'password'}
                      error={!!errors.password}
                      helperText={errors.password && 'Please enter a password.'}
                      registerProps={register('password', { required: true, maxLength: 20 })}
                      InputProps={{
                        endAdornment: (
                          <Icon
                            icon={passwordVisibility ? eyeOff : eye}
                            size={20}
                            onClick={togglePasswordVisibility}
                            style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                          />
                        ),
                      }}
                    />
                  </div>
                  <a href="#" className="forgot-password-link">Forgot Password?</a>
                  <div className="d-lg-grid gap-2">
                    <button type="submit" className={`custom-button ${isFormValid ? '' : 'disabled'}`} disabled={!isFormValid}>
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
</Container>
</ThemeProvider>
      
       
     
    
  );
};

export default Login;
