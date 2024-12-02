import React, { useState } from "react";
import { Box, Image, Flex, Stack, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { useNavigate, Link } from "react-router-dom";
import image from "../../../assets/reg_vector.png";
import { emailInvalid, emailRequired } from "../../../utils/ErrorStrings.js";
import TextBox from "../../../components/textbox/TextBox.js";
import SubmitButton from "../../../components/button/SubmitButton";
import SelfRegisterForm from "./SelfRegisterForm";
import { studentServices } from "../../../services/StudentServices.js";
import AlertBox from "../../../components/alert/Alert";
import selfRegistrationErrorCodes from "./SelfRegistrationErrorCodes.jsx";
import PaperModal from "../../../components/modal/PaperModal.jsx";
import LoadingSpinner from "../../../components/spinner/Spinner.jsx";
import { getAllExamData } from "../../../utils/indexedDB";

import { openDB } from "idb";
const LandingPage = () => {
  const [isRegistered, setIsRegistered] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [batchId, setBatchId] = useState("");
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    studentEmail: "",
    batchId: "",
  };

  const EMAIL_REGEX = new RegExp(process.env.REACT_APP_EMAIL_REGEX);

  const validationSchema = Yup.object({
    studentEmail: Yup.string()
      .required(emailRequired)
      .email(emailInvalid)
      .matches(EMAIL_REGEX, emailInvalid),
    batchId: Yup.string().required("Batch code is required"),
  });

  async function getAllDataFromIndexedDB() {
    // Open the database
    const db = await openDB("examApp", 1);

    // Start a read-only transaction
    const tx = db.transaction("submissions", "readonly");

    // Access the object store
    const store = tx.objectStore("submissions");

    // Get all data
    const allData = await store.getAll();

    // Log the data
    console.log("Data from IndexedDB:", allData);

    return allData;
  }

  // Call the function

  const handleSubmit = async (values) => {
    setLoading(true);
    const trimmedValues = {
      studentEmail: values.studentEmail.trim(),
      batchId: values.batchId.trim(),
    };

    try {
      setErrorMessage("");
      const response = await studentServices.studentVerification(trimmedValues);
      if (response.status === 200) {
        setErrorMessage("");
        setIsRegistered(true);
        localStorage.setItem("token", response?.data?.token);
        navigate("/examPortal");
      }
    } catch (error) {

      if (error?.response?.data?.errorCode === "e1112") {
        if (error?.response?.data?.is_pool === false) {
          setErrorMessage(
            "Please complete your registration to attend the exam"
          );
        }
        if (error?.response?.data?.is_pool === true) {
          setIsRegistered(false);
        }
      } else if (error?.response?.data?.errorCode === "e1114") {
        try {
          const allData = await getAllExamData(); 
          console.log("email", email)
          console.log("all data", allData)
          const userData = allData.find(
            (data) => data.email === email
          ); 
          console.log("console..........", userData)
          if (userData) {
            console.log("User data found in IndexedDB:", userData);
            setErrorMessage("You are already enrolled. Resuming session...");
            console.log("userData in landing page",userData.token)
            navigate("/questions",{state:{ token: userData.token,userData:null||userData}
            });
          } else {
            setErrorMessage("No existing session found for this email.");
          }
        } catch (dbError) {
          console.error("Error checking IndexedDB", dbError);
          setErrorMessage("An error occurred while checking your session.");
        }
      } else {
        setErrorMessage(
          selfRegistrationErrorCodes(error?.response?.data?.errorCode)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstructions = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  if (loading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }
  return (
    <>
      <Box textAlign="center" height="38px">
        {errorMessage && (
          <AlertBox
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </Box>

      <Box
        p={{ base: "0", md: "2rem" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Flex direction={{ base: "column", md: "row" }} width="100%">
          <Box
            flex={{ base: "0", md: "1" }}
            display={{ base: "none", md: "flex" }}
            justifyContent="center"
            alignItems="center"
            mb={{ base: "4", md: "0" }}
          >
            <Image
              src={image}
              alt="Description of Image"
              objectFit="cover"
              width="100%"
              height="90%"
            />
          </Box>
          <Box
            flex="1"
            display="flex"
            justifyContent={{ base: "center", md: "flex-end" }}
            mr={{ base: "0", md: "8rem" }}
          >
            {isRegistered === null && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, errors, touched }) => {
                  return (
                    <Form>
                      <Stack spacing={6} mt={{ base: "4", md: "8" }}>
                        <Box
                          bgColor="white"
                          p="3rem"
                          align="center"
                          borderRadius="8px"
                          width={{ base: "100%", md: "400px", lg: "600px" }}
                        >
                          <Box display="flex" justifyContent="center" mb="3rem">
                            <Text fontSize="2xl" as="b">
                              Access Your Exam
                            </Text>
                          </Box>
                          <Field name="studentEmail">
                            {({ field, form }) => (
                              <Box mb="2.5rem">
                                <TextBox
                                  field={field}
                                  form={form}
                                  type="email"
                                  placeholder="Email"
                                  onChange={(e) => {
                                    field.onChange(e); // Update Formik state
                                    setEmail(e.target.value); // Update local state
                                  }}
                                />
                              </Box>
                            )}
                          </Field>
                          <Field name="batchId">
                            {({ field, form }) => (
                              <Box mb="2.5rem">
                                <TextBox
                                  field={field}
                                  form={form}
                                  type="text"
                                  placeholder="Batch Code"
                                  onChange={(e) => {
                                    field.onChange(e); // Update Formik state
                                    setBatchId(e.target.value); // Update local state
                                  }}
                                />
                              </Box>
                            )}
                          </Field>
                          <SubmitButton
                            disabled={loading}
                            title="Submit"
                            type="submit"
                            colorScheme={"blue"}
                            textColor="white"
                            label={"Proceed"}
                            dis
                            width="100%"
                          />
                          <Text textAlign="right" mt={2} color="blue">
                            <Link onClick={handleInstructions}>
                              Instructions
                            </Link>
                          </Text>
                        </Box>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            )}
            {isRegistered === false && (
              <SelfRegisterForm batchId={batchId} email={email} />
            )}
          </Box>
        </Flex>
      </Box>
      <PaperModal
        open={openModal}
        handleClose={handleClose}
        showCloseButton={true}
      >
        <Box width="100%">
          <Text color="red.500" mt="2rem">
            Please read the instructions carefully before Proceed.
          </Text>
          <Box p="2rem">
            1. Kindly enter the email address used during registration. <br />
            <br />
            2. Ensure to input the correct batch code given by the invigilator.{" "}
            <br />
            <br />
            3. If you haven't registered for the exam, please provide a valid
            email address accurately, as all further details will be sent to
            this address.
            <br />
            <br />
            4. If you encounter any technical issues, please inform the
            invigilator.
            <br />
          </Box>
        </Box>
      </PaperModal>
    </>
  );
};

export default LandingPage;
