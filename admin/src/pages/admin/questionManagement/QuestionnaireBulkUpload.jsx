import React, { useState } from "react";
import {
  Grid,
  GridItem,
  Box,
  Input,
  Flex,
  Text,
  Icon,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import { IoCloudUploadOutline } from "react-icons/io5";
import * as Yup from "yup";
import ClickButton from "../../../components/button/OnClickButton";
import LoadingSpinner from "../../../components/spinner/Spinner";
import SuccessToast from "../../../components/toast/Toast";
import AlertBox from "../../../components/alert/Alert";
import DownloadCSVButton from "../../../components/downloadCSVButton/DownloadCSVButton";
import { adminServices } from "../../../services/AdminServices";
import TextBox from "../../../components/textbox/TextBox";
import adminQuestionErrorCodes from "../questionManagement/QuestionsErrorCodes";
import ErrorCard from "../studentManagement/ErrorCard";
import PaperModal from "../../../components/modal/PaperModal";
import SubmitButton from "../../../components/button/SubmitButton";
import { buttonSave } from "../../../utils/Strings";

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required("Please upload a CSV file"),
});

function QuestionnaireBulkUpload({ handleClose }) {
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [modalCsvError, setModalCsvError] = useState({});
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireError, setQuestionnaireError] = useState(false);
  const questionHeaders = [
    "Question",
    "Question_type",
    "Category",
    "Difficulty_level",
    "Option_1",
    "Option_2",
    "Option_3",
    "Option_4",
    "Answer_1",
    "Answer_2",
    "Answer_3",
    "Answer_4",
  ];

  const handleAddBulkQuestions = async (values) => {
    if (showQuestionnaire && values.questionnaireName === '') {
      setQuestionnaireError("Questionnaire is required");
      return; 
    }
    setLoading(true); 
    const data = {
      csvFileUpload: values.file,
    };
    
    if (values.questionnaireName) {
      data.questionnaireName = values.questionnaireName;
    }
    try {
      setQuestionnaireError('');
      const response = await adminServices.adminAddBulkQuestions(data);
      if (response.status === 200) {
        setToastOpen(true);
        setToastMessage('Questions added successfully');
        setQuestionnaireError('');
        handleClose();
      }
    } catch (error) {
      const errorCode = error?.response?.data?.errorCode;
      if (errorCode === 'e4300') {
        setModalCsvError(error?.response?.data);
        setOpenErrorModal(true);
      } else {
        setErrorMessage(adminQuestionErrorCodes(error?.response?.data?.errorCode));
      }
    } finally {
      setLoading(false); 
    }
  };
  
  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          questionnaireName: "",
          file: null,
          showQuestionnaire: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddBulkQuestions}
      >
        {({ setFieldValue, errors, touched, values }) => (
          <Form>
            {errorMessage && (
              <Box textAlign={{ base: "center", md: "center" }} mb={4}>
                <AlertBox
                  message={errorMessage}
                  onClose={() => { setErrorMessage('') }} />
              </Box>
            )}
            {Object.keys(modalCsvError).length > 0 && (
              <PaperModal open={openErrorModal} handleClose={handleCloseErrorModal}>
                <ErrorCard errorData={modalCsvError} />
              </PaperModal>
            )}
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                <GridItem colSpan={12} textAlign="center">
                    <FormControl>
                      <FormLabel textAlign="center" fontSize="lg" mb={4}>
                        Create Questionnaire
                      </FormLabel>
                      <RadioGroup
                        onChange={(value) => {
                          setShowQuestionnaire(value === "yes");
                          setFieldValue("showQuestionnaire", value === "yes");
                          if (value === "no") {
                            setFieldValue("questionnaireName", "");
                          }
                        }}
                      >
                        <Flex justify="center" gap={6}>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Flex>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>

                  {showQuestionnaire && (
                    <GridItem colSpan={12}>
                      <Field name="questionnaireName">
                        {({ field, form }) => (
                          <TextBox
                            field={field}
                            form={form}
                            label={"Questionnaire Name"}
                            type="text"
                            placeholder="Questionnaire Name"
                          />
                        )}
                      </Field>
                      <Text color="red.500" mt={2}>
                        {questionnaireError}
                      </Text>
                    </GridItem>
                  )}
                  <GridItem colSpan={12} textAlign="center">
                    <DownloadCSVButton
                      filename="questions.csv"
                      headers={questionHeaders}
                      buttonLabel="Export CSV Template"
                      title="export csv"
                      width={'100%'}
                    />
                  </GridItem>

                  <GridItem colSpan={12} textAlign="center">
                    <Flex
                      as="label"
                      htmlFor="file-upload"
                      align="center"
                      justify="center"
                      height={'70%'}
                      p={4}
                      border="2px"
                      bg="blue.500"
                      _hover={{ bg: "blue.600" }}
                      borderColor="blue.500"
                      rounded="md"
                      cursor="pointer"
                    >
                      <Icon as={IoCloudUploadOutline} w={6} h={6} mr={2} color="white" title="upload csv" />
                      <Text fontSize="md" color="white">
                        {values.file ? values.file.name : "Upload File"}
                      </Text>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={(event) => setFieldValue("file", event.target.files[0])}
                        display="none"
                      />
                    </Flex>
                    {touched.file && errors.file && (
                      <Text color="red.500" mt={2}>
                        {errors.file}
                      </Text>
                    )}
                  </GridItem>

                  <GridItem colSpan={12} textAlign="center">
                    <SubmitButton
                      type="submit"
                      title="Save file"
                      colorScheme="green"
                      label={buttonSave}
                    /> &nbsp;
                    <ClickButton
                      colorScheme="red"
                      title="Cancel"
                      label="Cancel"
                      onClick={handleClose}
                    />
                  </GridItem>
                </>
              )}
            </Grid>
          </Form>
        )}
      </Formik>
      <SuccessToast
        show={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

export default QuestionnaireBulkUpload;
