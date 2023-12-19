// Inside your Login component
import React, { useState }  from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import MuiTextField from "../components/common/MuiTextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link"
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';

const defaultTheme = createTheme();
const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data, event) => {
    event.preventDefault(); 
console.log("ionside the onsubmit")
    const formData = {
      email: data.email,
      password: data.password,
    };

    // Now formData contains email and password
    console.log("Form Data:", formData);
    // You can proceed to send this data to the server or perform other actions.
  };

  const isFormValid = Object.keys(errors).length === 0; // Check if there are no errors

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box
            
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <MuiTextField
            
                data-testid = "email"
                label="Email"
                error={!!errors.email}
                helperText={
                  errors.email && "Please enter a valid email address."
                }
                registerProps={register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
              />

              <MuiTextField
              data-testid = "password"
                label="Password"
                type={"password"}
                error={!!errors.password}
                helperText={errors.password && "Please enter a password."}
                registerProps={register("password", {
                  required: true,
                  maxLength: 20,
                })}
              />

              <Button
                type="submit"
                fullWidth
                variant={isFormValid ? "contained" : "disabled"}
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isFormValid }
              >
                Sign In
              </Button>
            </form>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
  </Container>

</Stack>
      
    </ThemeProvider>
  );
};

export default Login;
