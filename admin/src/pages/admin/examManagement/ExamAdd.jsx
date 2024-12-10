import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Flex, Text, Checkbox } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import TextBox from "../../../components/textbox/TextBox.js";
import SelectBox from "../../../components/select/SelectBox";
import SubmitButton from "../../../components/button/SubmitButton";
import AlertBox from "../../../components/alert/Alert.jsx";
import { adminServices } from "../../../services/AdminServices.js";
import adminExamErrorCodes from "./ExamErrorCodes.jsx";
import SuccessToast from "../../../components/toast/Toast";
import {
  examNameMax,
  examNameMin,
  examNameRequired,
  examDateNotBePastOrFuture,
  examDateRequired,
  examDurationRequired,
  examDurationInvalid,
  examTimeRequired,
  questionnaireIdRequired,
  examLocationRequired,
  examNameInvalid,
  examLocationMinimum,
  examLocationMaximum,
  examLocationInvalid,
} from "../../../utils/ErrorStrings.js";
import { clickButtonColor } from "../../../utils/Strings.js";
import ClickButton from "../../../components/button/OnClickButton.jsx";
import useLinkStore from "../../../components/store/LinkStore.jsx";
import useExamStore from "../../../components/store/ExamStore.jsx";

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear + 1];
const validationSchema = Yup.object({
  examName: Yup.string()
    .transform((value) => value.trim())
    .required(examNameRequired)
    .min(3, examNameMin)
    .max(100, examNameMax)
    .matches(/^(?=.*[a-zA-Z]).*$/, examNameInvalid),
  examDate: Yup.date()
    .required(examDateRequired)
    .test("is-current-year-or-next", examDateNotBePastOrFuture, (value) => {
      if (!value) return false;
      const examYear = new Date(value).getFullYear();
      return years.includes(examYear);
    }),

  examDuration: Yup.string()
    .required(examDurationRequired)
    .matches(/^[0-9\s]+$/, examDurationInvalid),

  examTime: Yup.string().required(examTimeRequired),
  examLocation: Yup.string()
    .transform((value) => value.trim())
    .required(examLocationRequired)
    .min(3, examLocationMinimum)
    .max(200, examLocationMaximum)
    .matches(/^(?=.*[a-zA-Z]).*$/, examLocationInvalid),
  questionnaireId: Yup.string()
    .required(questionnaireIdRequired),
});
function ExamAdd() {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [questionnaire, setQuestionnaire] = useState([]);
  const navigate = useNavigate();

  const { examData, setExamData, setLink, clearExamData, clearLink } = useLinkStore();
  const { questionnaireData, clearQuestionnaireData } = useExamStore();
  const [defaultQuestionnaireId, setDefaultQuestionnaireId] = useState("");

  const fetchQuestionnaire = async () => {
    try {
      const response = await adminServices.dropdownLists("questionnaire");
      console.log(response.data)
      const questionnaireOptions = response.data.map((paper) => ({
        id: paper.id,
        value: paper.questionnaire_name,
      }));

      setQuestionnaire(questionnaireOptions);
      if (questionnaireData) {
        setDefaultQuestionnaireId(questionnaireData.id)
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleAddDetails = async (data) => {
    try {
      const transformedData = {
        examLocation: data.examLocation.trim(),
        examName: data.examName.trim(),
        examDate: new Date(data.examDate).toISOString().split("T")[0],
        examTime: data.examTime + ":00",
        examDuration: parseInt(data.examDuration.trim(), 10),
        questionnaireId: data.questionnaireId,
        isPool: data.isPool
      };

      const response = await adminServices.adminAddExam(transformedData);

      if (response.status === 200) {
        setErrorMessage("");
        setSuccessMessage("Exam Scheduled Successfully");
        setToastOpen(true);
        clearExamData();
        clearLink();
        clearQuestionnaireData();
        setTimeout(() => {
          navigate('/dashboard/examsList');
        }, 500);
      }
    } catch (error) {
      setErrorMessage(adminExamErrorCodes(error?.response?.data?.errorCode));
    }
  };


  useEffect(() => {
    fetchQuestionnaire();
  }, []);

  const handleQuestionnaireCreation = (
    examLocation,
    examDuration,
    examDate,
    examTime,
    examName,
    isPool
  ) => {
    // the current form data before navigating
    setExamData({
      examLocation,
      examDuration,
      examDate,
      examTime,
      examName,
      isPool,
    });
    setLink(`/dashboard/examAdd`);
    navigate("/dashboard/questionnaireList/questionnaireAdd", { state: { from: 'examAdd' } });
  };
  return (
    <>
      <Flex alignItems="center" justifyContent="center" bg="gray.100">
        <Box
          p="6"
          width={{ base: "100%", md: "40%" }}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
        >
          <Formik
            initialValues={{
              examLocation: examData?.examLocation || "",
              examDuration: examData?.examDuration || "",
              examDate: examData?.examDate || "",
              examTime: examData?.examTime || "",
              examName: examData?.examName || "",
              isPool: examData?.isPool || false,
              questionnaireId: questionnaireData?.id || "",  // Set the questionnaire ID if available
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleAddDetails(values);
            }}
          >
            {({ setFieldValue, values, errors, touched }) => {
              return (
                <Form>
                  {errorMessage && (
                    <Box textAlign="center" mb={4}>
                      {errorMessage && (
                        <AlertBox
                          message={errorMessage}
                          onClose={() => setErrorMessage("")}
                        />
                      )}
                    </Box>
                  )}
                  <Stack spacing={6} mt={{ base: "4", md: "8" }}>
                    <Text textAlign="center" as="b" fontSize="2xl">
                      Schedule Exam
                    </Text>
                    <Box minH="52px">
                      <Field name="examName">
                        {({ field, form }) => (
                          <TextBox
                            field={field}
                            form={form}
                            type="text"
                            placeholder="Exam name"
                            label="Exam Name"
                          />
                        )}
                      </Field>
                    </Box>
                    <Box minH="52px">
                      <Field name="examLocation">
                        {({ field, form }) => (
                          <TextBox
                            field={field}
                            form={form}
                            type="text"
                            placeholder="Exam Location"
                            label="Exam Location"
                          />
                        )}
                      </Field>
                    </Box>
                    <Box minH="52px">
                      <Field name="examDate">
                        {({ field, form }) => (
                          <TextBox
                            field={field}
                            form={form}
                            type="date"
                            placeholder="Date"
                          />
                        )}
                      </Field>
                    </Box>
                    <Box minH="52px">
                      <Field name="examTime">
                        {({ field, form }) => (
                          <TextBox
                            field={field}
                            form={form}
                            type="time"
                            placeholder="Time"
                          />
                        )}
                      </Field>
                    </Box>
                    <Box minH="52px">
                      <Field name="examDuration">
                        {({ field, form }) => (
                          <TextBox
                            field={field}
                            form={form}
                            type="text"
                            placeholder="Exam Duration"
                            label="Exam Duration in minutes"
                          />
                        )}
                      </Field>
                    </Box>
                    <Box minH="52px">
                      <Field name="isPool">
                        {({ field }) => (
                          <Checkbox
                            {...field}
                            isChecked={values.isPool}
                          >
                            Is this a pool drive?
                          </Checkbox>
                        )}
                      </Field>
                    </Box>

                    <Flex justifyContent="space-between" width={{ base: "50%", sm: "60%", md: "100%" }}>
                      <Box minH="52px" width={{ base: "25%", md: "50%" }}>
                        <Text>Questionnaire</Text>
                        <Field name="questionnaireId">
                          {({ field, form }) => {
                            // If questionnaireData exists in ExamStore, pre-select its ID
                            const selectedValue = questionnaireData ? questionnaireData.id : field.value;
                            return (
                              <SelectBox
                                title='Choose Questionnaire'
                                testId="questionnaire-select"
                                options={questionnaire}
                                optionValue={selectedValue} // either the current field value or the questionnaireData ID
                                form={form}
                                width={{ base: "100%", sm: "10rem", md: "95%" }}
                                placeholder={questionnaireData ? questionnaireData.name : "Select"}
                                onSelect={(option) => {
                                  setFieldValue(field.name, option.id);
                                }}
                              />
                            );
                          }}
                        </Field>


                        {errors.questionnaireId && touched.questionnaireId && (
                          <Text color="red.500" mt={1} fontSize="13px">
                            {errors.questionnaireId}
                          </Text>
                        )}
                      </Box>
                      <Box mt="6" width={{ base: "25%", md: "50%" }}>
                        <ClickButton
                          label="Create "
                          bgColor={clickButtonColor}
                          onClick={() =>
                            handleQuestionnaireCreation(
                              values.examLocation,
                              values.examDuration,
                              values.examDate,
                              values.examTime,
                              values.examName,
                              values.isPool
                            )
                          }
                          width={{ base: "100%", sm: "10rem", md: "95%" }}
                        />
                      </Box>
                    </Flex>
                    <Flex>
                      <SubmitButton
                        type="submit"
                        title="Add"
                        colorScheme={"green"}
                        textColor="white"
                        label={"Schedule"}
                        width="100%"
                        _hover={{ bg: "green" }}
                      />
                      &nbsp;
                      <SubmitButton
                        type="reset"
                        colorScheme={"red"}
                        textColor="white"
                        label={"Clear"}
                        width="100%"
                        _hover={{ bg: "red" }}
                      />
                    </Flex>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Flex>
      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={successMessage}
      />
    </>
  );
};
export default ExamAdd;
