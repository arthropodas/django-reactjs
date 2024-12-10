import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import TextBox from "../../../components/textbox/TextBox.js";
import SelectBox from "../../../components/select/SelectBox";
import SubmitButton from "../../../components/button/SubmitButton";
import { adminServices } from "../../../services/AdminServices.js";
import { StudentManagementErrorCodes } from "./StudentManagementErrorCodes.jsx";
import SuccessToast from "../../../components/toast/Toast.jsx";
import adminInstitutionErrorCodes from "../institutions/InstitutionErrorCodes.jsx";
import AlertBox from "../../../components/alert/Alert.jsx";
import LoadingSpinner from "../../../components/spinner/Spinner.jsx";
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
import ClickButton from "../../../components/button/OnClickButton.jsx";
import { buttonSave, courses } from "../../../utils/Strings.js";

const EMAIL_REGEX = new RegExp(process.env.REACT_APP_EMAIL_REGEX);
const currentYear = new Date().getFullYear();

const validationSchema = Yup.object({
  name: Yup.string()
    .transform((value) => value.trim())
    .required(studentName)
    .min(3, nameMinLength)
    .max(100, nameMaxLength)
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z\s.]+$/, nameRegex),
  phone: Yup.string()
    .required(phoneRequired)
    .matches(/^\d+$/, phoneRegex)
    .length(10, phoneLength),
  email: Yup.string()
    .required(emailRequired)
    .email(emailInvalid)
    .matches(EMAIL_REGEX, emailInvalid),
  institutionId: Yup.number().required(institutionIdRequired),
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
  noOfBacklogs: Yup.number()
    .typeError(backlogType)
    .required(backlogRequired)
    .min(0, backlogNegative)
    .max(20, backlogMaxValue)
    .integer(backlogInteger),
  course: Yup.number()
    .required(courseRequired),
});

function StudentAdd({ handleClose }) {
  const [institutions, setInstitutions] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [institutionValue, setInstitutionValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstitutionDetails();
  }, []);

  const fetchInstitutionDetails = async () => {
    try {
      const response = await adminServices.dropdownLists("institution");
      if (response.status === 200) {
        const institutionOptions = response?.data?.map((institution) => ({
          id: institution.id,
          value: institution.institution_name,
        }));
        setInstitutions(institutionOptions);
      }
    } catch (error) {
      setErrorMessage(
        adminInstitutionErrorCodes(error?.response?.data?.errorCode)
      );
    }
  };

  const handleSubmit = async (formData) => {

    setLoading(true);
    try {

      const trimmedData = {
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email,
        institutionId: Number(formData.institutionId),
        passOutYear: formData.passOutYear,
        cgpa: formData.cgpa.trim(),
        noOfBacklogs: formData.noOfBacklogs.trim(),
        course: Number(formData.course)
      };

      const dataToSubmit = {
        ...trimmedData,
        institutionId: Number(formData.institutionId),
        course: Number(formData.course),
      };

      const response = await adminServices.adminCreateStudent(dataToSubmit);

      if (response.status === 200) {
        setSuccessMessage("Student created successfully");

        setToast(true);
        setTimeout(() => {
          setToast(false);
        }, 1000);
      }
      handleClose();
    } catch (error) {
      setErrorMessage(
        StudentManagementErrorCodes(error?.response?.data?.errorCode)
      );
    }
    setLoading(false);
  };

  const handleCancelButton = () => {
    handleClose();
  };

  return (
    <>
      <Box textAlign="center" mt="20px" maxH="32px">
        {errorMessage && (
          <AlertBox
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </Box>
      {loading && <LoadingSpinner />}
      <Box p="5">
        <Formik
          initialValues={{
            name: "",
            phone: "",
            email: "",
            institutionId: "",
            passOutYear: "",
            cgpa: "",
            noOfBacklogs: "",
            course: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched }) => {
            return (
              <Form>
                <Stack spacing={6} mt={{ base: "4", md: "8" }}>
                  <Box minH="52px">
                    <Field name="name">
                      {({ field, form }) => (
                        <TextBox
                          field={field}
                          form={form}
                          type="text"
                          placeholder="Name"
                          data-testid="name"
                        />
                      )}
                    </Field>
                  </Box>
                  <Box minH="52px">
                    <Field name="phone">
                      {({ field, form }) => (
                        <TextBox
                          field={field}
                          form={form}
                          type="text"
                          placeholder="Phone"
                          data-testid="phone"
                        />
                      )}
                    </Field>
                  </Box>
                  <Box minH="52px">
                    <Field name="email">
                      {({ field, form }) => (
                        <TextBox
                          field={field}
                          form={form}
                          type="email"
                          placeholder="Email"
                          data-testid="email"
                        />
                      )}
                    </Field>
                  </Box>
                  <Box minH="52px">
                    <Field name="institutionId">
                      {() => (
                        <SelectBox
                          testId="institution"
                          width="100%"
                          placeholder={"Institution Name"}
                          options={institutions}
                          onSelect={(option) => {
                            setFieldValue("institutionId", option.id);
                            setInstitutionValue(option.id); // Store selected institution id
                          }}
                        />
                      )}
                    </Field>
                    {errors.institutionId && touched.institutionId && (
                      <Text color="red.500" fontSize="sm">
                        {errors.institutionId}
                      </Text>
                    )}
                  </Box>
                  <Box minH="52px">
                    <Field name="course">
                      {() => (
                        <SelectBox
                          testId="course"
                          width="100%"
                          placeholder={"Course Name"}
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

                  <Box minH="52px">
                    <Field name="passOutYear">
                      {({ field, form }) => (
                        <TextBox
                          field={field}
                          data-testId="year"
                          form={form}
                          type="number"
                          placeholder="Passout Year"
                          onChange={(e) => {
                            const { value } = e.target;
                            const intValue = parseInt(value, 10);
                            setFieldValue(
                              field.name,
                              isNaN(intValue) ? "" : intValue
                            );
                          }}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box minH="52px">
                    <Field name="cgpa">
                      {({ field, form }) => (
                        <TextBox
                          field={field}
                          form={form}
                          type="text"
                          placeholder="Mark in CGPA"
                          data-testid="cgpa"
                        />
                      )}
                    </Field>
                  </Box>
                  <Box minH="52px">
                    <Field name="noOfBacklogs">
                      {({ field, form }) => (
                        <TextBox
                          field={field}
                          form={form}
                          type="text"
                          placeholder="No.of Backlogs"
                          data-testid="backlogs"
                        />
                      )}
                    </Field>
                  </Box>
                  <Flex>
                    <SubmitButton
                      title="Add"
                      type="submit"
                      colorScheme={"green"}
                      textColor="white"
                      label={buttonSave}
                      width="100%"
                      _hover={{ bg: "green" }}
                    />
                    &nbsp;
                    <ClickButton
                      type="reset"
                      colorScheme={"red"}
                      textColor="white"
                      label={"Cancel"}
                      width="100%"
                      _hover={{ bg: "red" }}
                      onClick={handleCancelButton}
                    />
                  </Flex>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Box>
      <SuccessToast
        show={toast}
        onClose={() => setToast(false)}
        message={successMessage}
      />
    </>
  );
}

StudentAdd.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default StudentAdd;
