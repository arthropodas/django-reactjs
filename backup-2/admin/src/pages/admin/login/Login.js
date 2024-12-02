import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import SwalAlert from "../../../components/alert/SwalAlert"; // Ensure this is used if needed
import Header from "../../../components/header/Header";
import LoadingSpinner from "../../../components/spinner/Spinner";
import AlertBox from "../../../components/alert/Alert";
import loginImage from "../../../assets/image.png";
import { adminServices } from "../../../services/AdminServices";
import { LoginErrorCodes } from "./LoginErrorCodes";

function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const responseGoogle = async (response) => {
    console.log("response",response);
    
    console.log("client id", clientId)
    console.log("Button is clicked: " + response)
    setLoading(true); // Set loading state while processing the response
    try {
      const res = await adminServices.adminLogin(response.credential);

      console.log("result",res);
      

      if (res.status === 200) {
        localStorage.setItem("accessToken", res?.data?.access_token);
        localStorage.setItem("refreshToken", res?.data?.refresh_token);
        localStorage.setItem("name", res?.data?.name); // Store the user's name
        localStorage.setItem("profile", res?.data?.profile);
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage(LoginErrorCodes(error.response?.data?.errorCode)); // Set error message based on error code
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Header />
      <Box textAlign="center" minH="54px">
        {errorMessage && (
          <AlertBox
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}
      </Box>
      <Flex justify="center" align="center" px={{ base: "4", md: "10" }}>
        {loading && <LoadingSpinner />}
        <Box display={{ base: "none", md: "block" }}>
          <Image
            src={loginImage}
            alt="login"
            w={{ base: "100%", md: "460px" }}
            h={{ base: "auto", md: "495px" }}
          />
        </Box>

        <Box textAlign="center" ml={{ base: "0", md: "10" }} mt={{ base: "4", md: "0" }}>
          <Text as="b" fontSize={{ base: "28px", md: "36px" }}>
            LOGIN
          </Text>
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={responseGoogle}
              onFailure={() => {
                console.log('Login Failed');
                setErrorMessage('Google login failed. Please try again.');
              }}
              cookiePolicy={'single_host_origin'}
              flowName="GeneralOAuthFlow"
            />
          </GoogleOAuthProvider>
        </Box>
      </Flex>
    </>
  );
}

export default Login;
