import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { Box, Stack, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import TextBox from "../../../components/textbox/TextBox.js";
import SubmitButton from "../../../components/button/SubmitButton";
import {
  backlogInteger,
  backlogMaxValue,
  backlogNegative,
  backlogRequired,
  backlogType,
  cgpaDecimal,
  cgpaRange,
  cgpaRequired,
  cgpaType,
  courseRequired,
  emailInvalid,
  emailRequired,
  institutionIdRequired,
  nameMaxLength,
  nameMinLength,
  nameRegex,
  passYearRequired,
  passYearType,
  phoneLength,
  phoneRegex,
  phoneRequired,
  studentName,
} from "../../../utils/ErrorStrings.js";
import SelectBox from "../../../components/select/SelectBox";
import { studentServices } from "../../../services/StudentServices.js";
import selfRegistrationErrorCodes from "./SelfRegistrationErrorCodes.jsx";
import institutionErrorCodes from "./InstitutionErrorCodes.jsx";
import AlertBox from "../../../components/alert/Alert.jsx";
import { courses } from "../../../utils/Strings.js";
import LoadingSpinner from "../../../components/spinner/Spinner.jsx";

const SelfRegisterForm = ({ batchId, email }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const initialValues = {
    name: "",
    phone: "",
    email: email,
    institutionId: "",
    institutionName: "",
    passOutYear: "",
    noOfBacklogs: "",
    cgpa: "",
    course: "",
  };
  const [institutions, setInstitutions] = useState([]);

  const EMAIL_REGEX = new RegExp(process.env.REACT_APP_EMAIL_REGEX);
  const currentYear = new Date().getFullYear();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(studentName)
      .min(3, nameMinLength)
      .max(100, nameMaxLength)
      .matches(/^[A-Za-z\s.]+$/, nameRegex),
    phone: Yup.string()
      .required(phoneRequired)
      .matches(/^\d+$/, phoneRegex)
      .length(10, phoneLength),
    email: Yup.string()
      .required(emailRequired)
      .email(emailInvalid)
      .matches(EMAIL_REGEX, emailInvalid),
    institutionId: Yup.number().required(institutionIdRequired),
    examId: Yup.number().optional(),
    passOutYear: Yup.number()
      .required(passYearRequired)
      .integer(passYearType)
      .min(currentYear - 1, `Year must be ${currentYear - 1} or later`)
      .max(currentYear + 1, `Year must be ${currentYear + 1} or earlier`)
      .typeError(passYearType),
    cgpa: Yup.number()
      .typeError(cgpaType)
      .required(cgpaRequired)
      .min(0, cgpaRange)
      .max(10, cgpaRange)
      .test("is-decimal", cgpaDecimal, (value) =>
        /^\d+(\.\d{1,2})?$/.test(value)
      ),
    course: Yup.number().required(courseRequired),
    noOfBacklogs: Yup.number()
      .typeError(backlogType)
      .required(backlogRequired)
      .min(0, backlogNegative)
      .max(20, backlogMaxValue)
      .integer(backlogInteger),
  });

  const fetchInstitutionDetails = async () => {
    try {
      const response = await studentServices.studentDropdownLists(
        "institution"
      );
      if (response.status === 200) {
        setErrorMessage("");
        const institutionOptions = response?.data?.map((institution) => ({
          id: institution.id,
          value: institution.institution_name,
        }));
        setInstitutions(institutionOptions);
      }
    } catch (error) {
      setErrorMessage(institutionErrorCodes(error?.response?.data?.errorCode));
    }
  };

  const handleSubmit = async (values) => {
    setErrorMessage("");
    setLoading(true)
    try {
      const response = await studentServices.selfRegistration(values);

      if (response.status === 200) {
        setErrorMessage("");
        try {
          const response = await studentServices.studentVerification({
            studentEmail: email,
            batchId: batchId,
          });
          if (response.status === 200) {
            localStorage.setItem("token", response?.data?.token);
            navigate("/examPortal");
          }
          setErrorMessage("");
        } catch (error) {
          setErrorMessage(
            selfRegistrationErrorCodes(error?.response?.data?.errorCode)
          );
        }
      }
    } catch (error) {
      setErrorMessage(
        selfRegistrationErrorCodes(error?.response?.data?.errorCode)
      );
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchInstitutionDetails();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box textAlign="center" height="38px" minW="100%">
            {errorMessage && (
              <AlertBox
                message={errorMessage}
                onClose={() => setErrorMessage("")}
              />
            )}
          </Box>
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
                      borderRadius="8px"
                      width={{ base: "100%", md: "400px", lg: "600px" }}
                    >
                      <Box display="flex" justifyContent="center" mb="3rem">
                        <Text fontSize="2xl">Enter Credentials to Proceed</Text>
                      </Box>
                      <Field name="name">
                        {({ field, form }) => (
                          <Box mb="2.5rem">
                            <TextBox
                              field={field}
                              form={form}
                              type="text"
                              placeholder="Name"
                            />
                          </Box>
                        )}
                      </Field>
                      <Field name="email">
                        {({ field, form }) => (
                          <Box mb="2.5rem">
                            <TextBox
                              field={field}
                              form={form}
                              type="email"
                              value={email}
                              readOnly
                            />
                          </Box>
                        )}
                      </Field>
                      <Field name="institutionId">
                        {() => (
                          <Box mb="2.5rem">
                            <SelectBox
                              placeholder={"Select Institution"}
                              options={institutions}
                              onSelect={(option) => {
                                setFieldValue("institutionId", option.id);
                              }}
                              testId="institution"
                              width="31.5rem"
                            />
                            {errors.institutionId && touched.institutionId && (
                              <Text color="red.500" fontSize="sm">
                                {errors.institutionId}
                              </Text>
                            )}
                          </Box>
                        )}
                      </Field>
                      <Field name="phone">
                        {({ field, form }) => (
                          <Box mb="2.5rem">
                            <TextBox
                              field={field}
                              form={form}
                              type="text"
                              placeholder="Phone"
                            />
                          </Box>
                        )}
                      </Field>
                      <Box minH="52px">
                        <Field name="course">
                          {() => (
                            <SelectBox
                              testId="course"
                              width="31.5rem"
                              placeholder={"Select Course"}
                              options={courses}
                              onSelect={(option) => {
                                setFieldValue("course", option.id);
                              }}
                            />
                          )}
                        </Field>
                        {errors.course && touched.course && (
                          <Text color="red.500" fontSize="sm">
                            {errors.course}
                          </Text>
                        )}
                      </Box>
                      <Field name="passOutYear">
                        {({ field, form }) => (
                          <Box mb="2.5rem">
                            <TextBox
                              field={field}
                              form={form}
                              type="text"
                              placeholder="Passout Year"
                            />
                          </Box>
                        )}
                      </Field>
                      <Field name="noOfBacklogs">
                        {({ field, form }) => (
                          <Box mb="2.5rem">
                            <TextBox
                              field={field}
                              form={form}
                              type="text"
                              placeholder="Number of backlogs"
                            />
                          </Box>
                        )}
                      </Field>
                      <Field name="cgpa">
                        {({ field, form }) => (
                          <Box mb="3rem">
                            <TextBox
                              field={field}
                              form={form}
                              type="text"
                              placeholder="Cgpa"
                            />
                          </Box>
                        )}
                      </Field>
                      <SubmitButton
                        title="Save and Continue"
                        type="submit"
                        colorScheme={"blue"}
                        textColor="white"
                        label={"Save & Continue"}
                        disabled={loading}
                        width="100%"
                        // _hover={{ bg: "blue" }}
                      />
                    </Box>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </>
  );
};

export default SelfRegisterForm;
