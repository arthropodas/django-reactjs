import React, { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  Box,
  Flex,
  Text,
  IconButton,
  Card,
  Input,
  FormLabel,
  CardBody,
  Spacer,
  HStack,
  Checkbox
} from "@chakra-ui/react";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ClickButton from "../../../components/button/OnClickButton";
import SuccessToast from "../../../components/toast/Toast";
import { FaEdit, FaSave } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import adminExamErrorCodes from "./ExamErrorCodes";
import SelectBox from "../../../components/select/SelectBox";
import AlertBox from "../../../components/alert/Alert";
import ExamBatch from "./ExamBatch";
import { clickButtonColor, examReportButtonColor } from "../../../utils/Strings";
import ExamStatus from "./ExamStatus";
import { IoChevronBack } from "react-icons/io5";

function AdminExamDetail() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPool, setIsPool] = useState(false); // New state for is_pool
  const [questionnaire, setQuestionnaire] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState("");
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState("");
  const [examStatus, setExamStatus] = useState("");
  const [batchData, setBatchData] = useState([]);

  const { id } = useParams();

  const navigate = useNavigate();

  const handleNavigateToShortlistPage = () => {
    navigate(`shortlisted/?questionnaireId=${questionnaireId}`);
  };

  const fetchExamDetails = async () => {
    try {
      const response = await adminServices.adminGetExamById(id);
      if (response.status === 200) {
        setData(response.data);
        setQuestionnaireId(response.data.questionnaire.id);
        setExamStatus(response.data.status_of_exam);
        setIsPool(response.data.is_pool); // Set initial value for is_pool
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(adminExamErrorCodes(error.response?.data?.errorCode));
      setLoading(false);
    }
  };

  const handleUpdateExam = async () => {
    try {
      const examTime =
        data.exam_time.includes(":") && data.exam_time.length === 5
          ? `${data.exam_time}:00`
          : data.exam_time;

      const transformedData = {
        examName: data.exam_name.trim(),
        examLocation: data.exam_location.location_name.trim(),
        examDate: data.exam_date,
        examTime: examTime, // Ensure correct time format
        examDuration: parseInt(data.exam_duration, 10),
        questionnaireId: selectedQuestionnaires || questionnaireId,
        isPool: isPool, // Add the updated value of is_pool here
      };

      const response = await adminServices.adminEditExam(id, transformedData);
      if (response.status === 200) {
        setSuccessMessage("Exam details updated successfully!");
        setToastOpen(true);
        setIsEditing(false);
      }
      fetchExamDetails();
    } catch (error) {
      setErrorMessage(adminExamErrorCodes(error.response?.data?.errorCode));
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (name, value) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchQuestionnaire = async () => {
    try {
      const response = await adminServices.questionnaireLists();

      const questionnaireOptions = response.data.results.map((paper) => ({
        id: paper.id,
        value: paper.questionnaire_name,
      }));
      setQuestionnaire(questionnaireOptions);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleQuestionnaireChange = (selectedQuestionnaire) => {
    setSelectedQuestionnaires(selectedQuestionnaire.id);
  };

  const handleQuestionnaireView = () => {
    navigate(`/dashboard/questionnairePaperView/${questionnaireId}`);
  }

  const handleExamStatusChange = () => {
    fetchExamDetails();
  };

  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const downloadExamReport = async () => {
    try {
      const res = await adminServices.adminDownloadExamReport(id)
      const blob = new Blob([res.data], { type: 'text/csv' });


      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ExamReport_${id}.csv`);

      document.body.appendChild(link);
      link.click();


      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setErrorMessage(adminExamErrorCodes(error.response?.data?.errorCode));

    }
  };

  const fetchBatchDetails = () => {
    adminServices
      .adminGetExamById(id)
      .then((response) => {
        const batches = response.data.batches.map((batch) => ({
          id: batch.id,
          uuid: batch.uuid,
          batch_name: batch.batch_name,
          no_of_students: batch.count_of_students,
          batch_status: batch.batch_status
        }));

        setBatchData(batches); // Set the batch data
      })
      .catch((error) => {
        console.error("Error fetching exam details:", error);
      });
  };

  useEffect(() => {
    fetchExamDetails();
    fetchQuestionnaire();
  }, []);

  return (
    <>
      <Flex justify="space-between" align="center" mb={4} >

        <ClickButton
          label="back"
          bgColor={clickButtonColor}
          width={"8%"}
          height="40px"
          icon={<IoChevronBack />}
          onClick={handleGoBack}

        />
      </Flex>
      {errorMessage && (
        <Box textAlign="center" mb={4}>
          <AlertBox
            message={errorMessage}
            onClose={() => {
              setErrorMessage("");
            }}
          />
        </Box>
      )}
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        {loading ? (
          <GridItem colSpan={12}>
            <LoadingSpinner />
          </GridItem>
        ) : (
          <>
            <GridItem colSpan={12}>
              <Card p="1rem">
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="3xl">Exam Details</Text>
                  <IconButton
                    icon={isEditing ? <FaSave /> : <FaEdit />}
                    onClick={isEditing ? handleUpdateExam : toggleEditMode}
                    colorScheme="green"
                    title={isEditing ? "Save" : "Edit"}
                    aria-label={isEditing ? "Save" : "Edit"}
                    ml={4}
                  />
                </Flex>
                <CardBody>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <Box>
                      <FormLabel
                        htmlFor="exam_name"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Exam Name
                      </FormLabel>
                      <Input
                        id="exam_name"
                        value={data.exam_name || ""}
                        onChange={(e) =>
                          handleInputChange("exam_name", e.target.value)
                        }
                        type="text"
                        placeholder="Exam Name"
                        size="md"
                        isReadOnly={!isEditing}
                      />
                    </Box>
                    <Box>
                      <FormLabel
                        htmlFor="exam_location"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Exam Location
                      </FormLabel>
                      <Input
                        id="exam_location"
                        value={data.exam_location.location_name || ""}
                        onChange={(e) =>
                          handleInputChange("exam_location", { location_name: e.target.value })
                        }
                        type="text"
                        placeholder="Exam Location"
                        size="md"
                        isReadOnly={!isEditing}
                      />
                    </Box>
                    <Box>
                      <FormLabel
                        htmlFor="exam_date"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Date
                      </FormLabel>
                      <Input
                        id="exam_date"
                        value={data.exam_date || ""}
                        onChange={(e) =>
                          handleInputChange("exam_date", e.target.value)
                        }
                        type="date"
                        placeholder="Exam Date"
                        size="md"
                        isReadOnly={!isEditing}
                      />
                    </Box>
                    <Box>
                      <FormLabel
                        htmlFor="exam_time"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Time
                      </FormLabel>
                      <Input
                        id="exam_time"
                        value={data.exam_time || ""}
                        onChange={(e) =>
                          handleInputChange("exam_time", e.target.value)
                        }
                        type="time"
                        placeholder="Exam Time"
                        size="md"
                        isReadOnly={!isEditing}
                      />
                    </Box>
                    <Box>
                      <FormLabel
                        htmlFor="exam_duration"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Duration (Minutes)
                      </FormLabel>
                      <Input
                        id="exam_duration"
                        value={data.exam_duration || ""}
                        onChange={(e) =>
                          handleInputChange("exam_duration", e.target.value)
                        }
                        type="number"
                        placeholder="Duration"
                        size="md"
                        isReadOnly={!isEditing}
                      />
                    </Box>
                    <Box>
                      <FormLabel
                        htmlFor="questionnaire_name"
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Questionnaire Name
                      </FormLabel>
                      <SelectBox
                        testId="questionnaire-select"
                        options={questionnaire}
                        width={{ base: "100%", sm: "10rem", md: "100%" }}
                        placeholder={data.questionnaire.questionnaire_name}
                        onSelect={handleQuestionnaireChange}
                        isReadOnly={!isEditing} // Make it read-only when !isEditing
                      />
                    </Box>
                    <Box>
                      <FormLabel
                        htmlFor="is_pool"
                        fontSize="lg"
                        fontWeight="bold"
                      ></FormLabel>
                      <Checkbox
                        isChecked={isPool} // Bind the checkbox to isPool state
                        isDisabled={!isEditing} // Only allow editing if in edit mode
                        onChange={(e) => setIsPool(e.target.checked)} // Update isPool when checkbox is clicked
                      >
                        Is this a pool drive?
                      </Checkbox>
                    </Box>
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>
            <ExamStatus examStatus={examStatus} examId={id} onExamStatusChange={handleExamStatusChange} fetchBatchDetails={fetchBatchDetails} />
            <HStack >
              <Box>
                <ClickButton
                  onClick={handleQuestionnaireView}
                  label="View Questionnaire"
                  width="auto"
                  bgColor={clickButtonColor}
                />
              </Box>
              <Spacer />
              <Box>
                {data.status_of_exam === 2 && (
                  <ClickButton
                    onClick={handleNavigateToShortlistPage}
                    label="Shortlist"
                    data-testId="Shortlist"
                    buttonColor="green"
                  />
                )}
              </Box>
              <Box>
                {data.status_of_exam === 2 && (
                  <ClickButton
                    onClick={downloadExamReport}
                    label="Exam Report"
                    data-testId="examReport"
                    buttonColor="green"
                    bgColor={examReportButtonColor}
                  />
                )}
              </Box>
            </HStack>
            <ExamBatch examStatus={examStatus} fetchBatchDetails={fetchBatchDetails} batchData={batchData} />
          </>
        )}
      </Grid>
      <SuccessToast
        show={toastOpen}
        message={successMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

export default AdminExamDetail;
