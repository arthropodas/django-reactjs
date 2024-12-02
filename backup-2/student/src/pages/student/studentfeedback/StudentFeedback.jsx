import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack, Textarea, Text, Box, Flex, Divider } from "@chakra-ui/react";
import ClickButton from "../../../components/button/OnClickButton";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { adminServices } from "../../../services/AdminServices";
import adminFeedbackErrorCodes from "./FeedbackManagementErrorCodes";
import SuccessToast from "../../../components/toast/Toast";
import { feedbackLength, feedbackMaxLength } from "../../../utils/ErrorStrings";
import StarRating from "../../../components/starrating/StarRating";
import AlertBox from "../../../components/alert/Alert";
import { ratingRequired } from "../../../utils/Strings";
import LoadingSpinner from "../../../components/spinner/Spinner";

const StudentFeedback = ({ handleClose }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [rating, setRating] = useState(0); // Initial rating set to 0
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    feedback: Yup.string()
      .optional()
      .min(3, feedbackLength)
      .max(1000, feedbackMaxLength),
    rating: Yup.number().min(1, ratingRequired).required(ratingRequired),
  });

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleFeedbackSubmit = (values) => {
    setLoading(true);
    if (token) {
      adminServices
        .studentAddFeedbacks({
          comment: values.feedback ? values.feedback.trim() : null, // If feedback is empty, send an null value
          rating: values.rating,
          token: token,
        })
        .then((response) => {
          if (response.status === 200) {
            localStorage.clear();
            navigate("/thanks");
            handleClose();
            setMessage("Feedback submitted Successfully");
            setToastOpen(true);
          }
        })
        .catch((error) => {
          setErrorMessage(
            adminFeedbackErrorCodes(error.response.data?.errorCode)
          );
          setErrorMessage("");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Formik
        initialValues={{ feedback: "", rating: 0 }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          values.rating = rating; // Pass rating value to Formik's submission
          handleFeedbackSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <Box textAlign="center" mb={4} minH="32px">
              {errorMessage && (
                <AlertBox
                  message={errorMessage}
                  onClose={() => setErrorMessage("")}
                />
              )}
            </Box>
            <VStack spacing={4} align="start" p="10px">
              <Text color="#243070">
                Please take a moment to review your experience with us.
              </Text>
              <Divider orientation="horizontal" />
              {/* StarRating component */}
              <Text fontSize="20px">Rate Us</Text>
              <Flex justifyContent="center" width="100%" align="center">
                <StarRating
                  rating={rating}
                  setRating={(newRating) => {
                    setRating(newRating); // Update rating
                    setFieldValue("rating", newRating); // Update Formik's rating field
                  }}
                  count={5}
                  size={28}
                />
              </Flex>

              {/* rating error message */}
              <Box minH="22px">
                {errors.rating && touched.rating ? (
                  <Text color="red.500" fontSize="sm">
                    {errors.rating}
                  </Text>
                ) : null}
              </Box>
              <Text fontSize="20px">Comment</Text>
              <Field name="feedback">
                {({ field }) => (
                  <Textarea
                    {...field}
                    size="sm"
                    placeholder="Enter your feedback here"
                    bgColor="white"
                    isInvalid={errors.feedback && touched.feedback}
                  />
                )}
              </Field>
              <Box minH="30px">
                {errors.feedback && touched.feedback ? (
                  <Text color="red.500" fontSize="sm">
                    {errors.feedback}
                  </Text>
                ) : null}
              </Box>

              <Box width="100%" display="flex" justifyContent="right" gap="4px">
                <ClickButton
                  label={loading?"Submitting...":"Submit"}
                  disabled={loading}
                  colorScheme="blue"
                  type="submit"
                />
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>

      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={message}
      />
    </>
  );
};

StudentFeedback.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default StudentFeedback;
