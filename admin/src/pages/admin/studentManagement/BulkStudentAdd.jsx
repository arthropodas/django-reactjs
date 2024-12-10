import React, { useEffect, useState } from "react";
import { Box, Stack, Button, Text, Flex } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import SelectBox from "../../../components/select/SelectBox";
import { IoCloudUploadOutline } from "react-icons/io5";
import SubmitButton from "../../../components/button/SubmitButton";
import PropTypes from "prop-types";
import { adminServices } from "../../../services/AdminServices";
import { StudentManagementErrorCodes } from "./StudentManagementErrorCodes";
import SuccessToast from "../../../components/toast/Toast";
import adminExamErrorCodes from "../examManagement/ExamErrorCodes";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ErrorCard from "./ErrorCard";
import PaperModal from "../../../components/modal/PaperModal";
import { examIdRequired, fileRequired, institutionIdRequired } from "../../../utils/ErrorStrings";
import DownloadCSVButton from "../../../components/downloadCSVButton/DownloadCSVButton";
import AlertBox from "../../../components/alert/Alert";
import ClickButton from "../../../components/button/OnClickButton";
import { buttonSave } from "../../../utils/Strings";

const groupValidationSchema = Yup.object({
  institutionId: Yup.string().required(institutionIdRequired),
  // examId: Yup.number().required(examIdRequired),
  studentsList: Yup.mixed()
    .required(fileRequired)
    .test("fileFormat", "Only CSV files are allowed", (value) => {
      return value && value.type === "text/csv";
    })
    .test(
      "fileSize",
      "File size must be less than or equal to 2MB",
      (value) => {
        return value && value.size <= 2 * 1024 * 1024; // 2MB in bytes
      }
    ),
});

function BulkStudentAdd({ handleClose }) {

  const [institutions, setInstitutions] = useState([]);
  // const [exams, setExams] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [institutionValue, setInstitutionValue] = useState("")
  const [toast, setToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errorData, setErrorData] = useState({});
  const studentHeaders = ['name', 'email', 'phone', 'pass_out_year', 'cgpa', 'no_of_backlogs', 'course'];



  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await adminServices.adminUploadStudents(values);
      if (response.status === 200) {
        setSuccessMessage("Students uploaded successfully");
        setToast(true);
        setTimeout(() => {
          setToast(false);
        }, 1000);
      }
      handleClose();
    } catch (error) {
      const errorCode = error?.response?.data?.errorCode;
      if (errorCode === 'e2050' || errorCode === 'e2051') {
        setErrorData(error?.response?.data);
        setOpenModal(true);
      } else {
        setErrorMessage(StudentManagementErrorCodes(errorCode));
      }
    }
    setLoading(false);
  };



  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    
    fetchInstitutionDetails();

  }, [institutionValue])

  const fetchInstitutionDetails = async () => {
    try {
      const response = await adminServices.dropdownLists('institution');
      if (response.status === 200) {
        const institutionOptions = response?.data?.map(
          (institution) => ({
            id: institution.id,
            value: institution.institution_name,
          })
        );
        setInstitutions(institutionOptions);
      }
    } catch (error) {
      setErrorMessage(
        StudentManagementErrorCodes(error?.response?.data?.errorCode)
      );
    }
  };

  const handleCancelButton=()=>{   
    handleClose();
  }

  return (
    <Box p="5">
      <Box textAlign="center" mt="20px" mb="20px" maxH="42px">
        {errorMessage && (
          <AlertBox
          message={errorMessage}
          onClose={()=> setErrorMessage('')}/>
        )}
      </Box>
      {Object.keys(errorData).length > 0 && <PaperModal open={openModal}
        handleClose={handleCloseModal}>
        <ErrorCard errorData={errorData} /></PaperModal>}


      {loading && <LoadingSpinner />}
      <Formik
        initialValues={{
          institutionId: "",
          examId: "",
          studentsList: ""
        }}
        validationSchema={groupValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => {
          return (
            <>
              <DownloadCSVButton
                filename="students.csv"
                headers={studentHeaders}
                width="100%"
                buttonLabel="Export CSV Template"
              />
              <Form>
                <Stack spacing={6} mt={{ base: "4", md: "8" }}>
                  <Box minH="52px">
                    <Field name="institutionId">
                      {() => (
                        <>
                          <SelectBox
                            width="100%"
                            placeholder="Select Institution"
                            options={institutions}
                            onSelect={(option) => {
                              setFieldValue("institutionId", option.id);
                              setInstitutionValue(option.id); // Store selected institution id
                            }}
                          />
                          {errors.institutionId && touched.institutionId && (
                            <Text color="red.500" fontSize="sm">
                              {errors.institutionId}
                            </Text>
                          )}
                        </>
                      )}
                    </Field>
                  </Box>
                 
                  <Box>
                    <Field name="studentsList">
                      {({ field }) => (
                        <>
                          {values.studentsList && (
                            <Box mb={4}>
                              <Text>{values.studentsList.name}</Text>
                            </Box>
                          )}
                          <Button
                            as="label"
                            variant="solid"
                            bg="blue.500"
                            color="white"
                            width="100%"
                            _hover={{ bg: "blue.600" }}
                            leftIcon={<IoCloudUploadOutline />}
                          >
                            {values?.studentsList?.name ? "file uploaded" : "Upload file"}
                            <input
                              type="file"
                              hidden
                              accept=".csv"
                              onChange={(event) => {
                                const file = event.currentTarget.files[0];
                                setFieldValue("studentsList", file);
                              }}
                            />
                          </Button>
                          {errors.studentsList && touched.studentsList && (
                            <Text color="red.500" fontSize="sm">
                              {errors.studentsList}
                            </Text>
                          )}

                        </>
                      )}
                    </Field>
                  </Box>
                  <Flex>
                    <SubmitButton
                      type="submit"
                      colorScheme={"green"}
                      textColor="white"
                      label={buttonSave}
                      width="100%"
                      _hover={{ bg: "green" }}
                    />
                    &nbsp;
                    <ClickButton
                      type="button"
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
            </>
          );
        }}
      </Formik>
      <SuccessToast
        show={toast}
        onClose={() => setToast(false)}
        message={successMessage}
      />
    </Box>
  );
}
BulkStudentAdd.propTypes = {
  handleClose: PropTypes.func.isRequired,
};
export default BulkStudentAdd;
