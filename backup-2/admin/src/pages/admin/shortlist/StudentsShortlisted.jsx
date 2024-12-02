import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReusableTable from "../../../components/table/Table";
import { clickButtonColor, clickButtonHover } from "../../../utils/Strings";
import ClickButton from "../../../components/button/OnClickButton";
import { adminServices } from "../../../services/AdminServices";
import adminShortlistErrorCodes from "./ShortListedStudentsErrorCodes";
import AlertBox from "../../../components/alert/Alert";
import LoadingSpinner from "../../../components/spinner/Spinner";
import SuccessToast from "../../../components/toast/Toast";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import { IoChevronBack } from "react-icons/io5";
import { GrView } from "react-icons/gr";
import PaperModal from "../../../components/modal/PaperModal";
import StudentDetail from "../studentManagement/StudentDetail";

const StudentsShortlisted = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const questionnaireId = queryParams.get("questionnaireId");
  const { examId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({});
  const [total, setTotal] = useState(0);
  const [allStudents, setAllStudents] = useState([]);
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [shortlistCriteria, setShortlistCriteria] = useState({
    categoryCriteria: [],
    generalCutOff: 0,
  });
  const[openStudentDetailModal,setOpenStudentDetailModal] = useState(false);
  const [id, setId] = useState([]);
  const navigate = useNavigate();


  const isEmpty = Object.keys(inputs).length === 0 && total === "";

  const fetchQuestionnaireCategories = async () => {
    setLoading(true);
    try {
      const response = await adminServices.adminQuestionnaireDetailView(
        questionnaireId
      );
      if (response.status === 200) {
        setCategories(response.data.preview);
        setErrorMessages("");
      }
    } catch (error) {
      // setErrorMessage(adminQuestionnaireErrorCodes(error.response?.data?.errorCode));
      console.log("Error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (category, level, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [category]: {
        ...prevInputs[category],
        [level]: value,
      },
    }));
  };

  const fetchAllStudentDetails = async () => {
    setLoading(true);
    try {
      const response = await adminServices.adminListAllWrittenStudents(examId);
      if (response.status === 200) {
        const allStudentData = response.data.shortlisted_students.map(
          (student) => ({
            id: student.studentId,
            studentName: student.studentName,
            mark: student.mark,
            institution: student.institution,
            studentStatus:
              student.studentStatus === 5 ? "Selected" : "Not Selected",
            batchId: student.batchId,
          })
        );
        setAllStudents(allStudentData);
        setErrorMessages("");
      }
    } catch (error) {
      setAllStudents([]);
      // setErrorMessages(
      //   adminShortlistErrorCodes(error?.response?.data?.errorCode)
      // );
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlistedStudents = async (payload) => {
    setLoading(true);
    try {
      const response = await adminServices.adminSendShortlist(examId, payload);
      if (response.status === 200) {
        const shortlistedStudents = response.data.shortlisted_students.map(
          (student) => ({
            id: student.studentId,
            studentName: student.studentName,
            mark: student.mark,
            institution: student.institution,
            studentStatus:
              student.studentStatus === 5 ? "Selected" : "Not Selected",
          })
        );
        setShortlistedStudents(shortlistedStudents);
        setErrorMessages("");
      }
    } catch (error) {
      setShortlistedStudents([]);
      setErrorMessages(
        adminShortlistErrorCodes(error?.response?.data?.errorCode)
      );
      setInputs({});
    } finally {
      setLoading(false);
    }
  };

  const handleSendMailToStudents = async (payload) => {
    setOpenStatusModal(false);
    setLoading(true);
    try {
      const response = await adminServices.adminSendShortlist(examId, payload);
      if (response.status === 200) {
        setErrorMessages("");
        setToastMessage("Email sent successfully!");
        setToastOpen(true);
        setTimeout(() => {
          navigate(0);
        }, 2000);
      }
    } catch (error) {
      setErrorMessages(
        adminShortlistErrorCodes(error?.response?.data?.errorCode)
      );
    } finally {
      setLoading(false);
      setInputs({});
    }
  };

  const fetchShortlistCriteria = async () => {
    setLoading(true);
    try {
      const response = await adminServices.adminShortlistCriteria(examId);
      if (response.status === 200) {
        setShortlistCriteria(response.data);
        const shortlistedStudents = response.data.shortlistedStudents.map(
          (student) => ({
            id: student.studentId,
            studentName: student.studentName,
            mark: student.mark,
            institution: student.institution,
            studentStatus:
              student.studentStatus === 5 ? "Selected" : "Not Selected",
          })
        );
        setShortlistedStudents(shortlistedStudents);
        fetchAllStudentDetails();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error : ', error);
    }
  };

  const handleSubmit = async (event, actionValue = 0, isEmailSending = false) => {
    event.preventDefault();

    const errors = {};

    // Validate inputs
    categories.forEach((category) => {
      const hardCutOff = parseInt(inputs[category.category]?.hard || 0, 10) || 0;
      const mediumCutOff = parseInt(inputs[category.category]?.medium || 0, 10) || 0;
      const easyCutOff = parseInt(inputs[category.category]?.easy || 0, 10) || 0;

      if (
        hardCutOff >
        category.levels.find((level) => level.level === 3)?.questions.length
      ) {
        errors[`${category.category}_hard`] = `Cannot exceed ${category.levels.find((level) => level.level === 3)?.questions.length
          }`;
      }
      if (
        mediumCutOff >
        category.levels.find((level) => level.level === 2)?.questions.length
      ) {
        errors[`${category.category}_medium`] = `Cannot exceed ${category.levels.find((level) => level.level === 2)?.questions.length
          }`;
      }
      if (
        easyCutOff >
        category.levels.find((level) => level.level === 1)?.questions.length
      ) {
        errors[`${category.category}_easy`] = `Cannot exceed ${category.levels.find((level) => level.level === 1)?.questions.length
          }`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const categoryData = categories.flatMap((category, index) => {
      const hardCutOff = parseInt(inputs[category.category]?.hard || 0, 10) || 0;
      const mediumCutOff = parseInt(inputs[category.category]?.medium || 0, 10) || 0;
      const easyCutOff = parseInt(inputs[category.category]?.easy || 0, 10) || 0;

      const data = [];

      if (hardCutOff > 0) {
        data.push({
          category_id: category.categoryId,
          cut_off: hardCutOff,
          question_level: 3,
        });
      }
      if (mediumCutOff > 0) {
        data.push({
          category_id: category.categoryId,
          cut_off: mediumCutOff,
          question_level: 2,
        });
      }
      if (easyCutOff > 0) {
        data.push({
          category_id: category.categoryId,
          cut_off: easyCutOff,
          question_level: 1,
        });
      }

      return data;
    });

    if (isEmailSending) {
      const payload = {
        action_value: actionValue,
        cut_off: parseInt(total, 10),
        category: categoryData,
      };

      await handleSendMailToStudents(payload);
    } else {
      if (total === 0) {
        const payload = {
          action_value: actionValue,
          category: categoryData,
        };

        await fetchShortlistedStudents(payload);

      } else {
        const payload = {
          action_value: actionValue,
          cut_off: parseInt(total, 10),
          category: categoryData,
        };

        await fetchShortlistedStudents(payload);
      }
    }
  };

  const handleSendMail = (event) => {
    event.preventDefault();
    handleSubmit(event, 1, true);
  };

  const handleClearInputs = () => {
    setInputs({});
    setTotal("");
    setValidationErrors({});
  };

  const handleTabChange = () => {
    setErrorMessages("");
  };

  const handleOpenModal = () => {
    setOpenStatusModal(true);
  };

  const handleCloseModal = () => {
    setOpenStatusModal(false);
  };

  useEffect(() => {
    fetchShortlistCriteria();
    fetchQuestionnaireCategories();
    fetchAllStudentDetails();
  }, [questionnaireId, examId]);

  const columns = [
    { field: "studentName", headerName: "Student Name" },
    { field: "institution", headerName: "Institution Name" },
    { field: "mark", headerName: "Points" },
    { field: "studentStatus", headerName: "Status" },
  ];
  const handleViewReport = (id) => {
    // Find the batchId for the clicked student based on their id
    const student = allStudents.find(student => student.id === id);
    const batchId = student?.batchId;    
    if (batchId) {
      navigate(
        `../examsList/examDetail/batchDetails/${batchId}/summaryReport/${id}`
      );
    } 
  };
  const actions = [
    {
      label: "View Detail",
      color: "#2a9df4",
      icon: <GrView />,
      disabled: false,
      onClick: (id) => handleOpenStudentDetailModal(id),
    },
    {
      label: "View Report",
      icon: (
        <ClickButton
          _hover={{ bg: clickButtonHover, color: "white" }}
          variant="outline"
          label="View Report"
        >
          View Report
        </ClickButton>
      ),
      onClick: (id) => handleViewReport(id),
    },
  ];
  const handleOpenStudentDetailModal = async (userId) => {
    setOpenStudentDetailModal(true);
    setId(userId);
  };
  const handleStudentCloseModal = async () =>{
    setOpenStudentDetailModal(false);
  }
  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  return (
    <Box>
      <Box textAlign="center">
        {errorMessages && (
          <AlertBox
            message={errorMessages}
            onClose={() => {
              setErrorMessages("");
            }}
          />
        )}
      </Box>
      <Tabs variant="enclosed" onChange={handleTabChange}>
        <Flex justifyContent="space-between" flexDirection="row" padding={4}>

          <ClickButton
            label="back"
            bgColor={clickButtonColor}
            width={"8%"}
            height="40px"
            icon={<IoChevronBack />}
            onClick={handleGoBack}

          />

          <Flex >
          </Flex >

          <TabList>
            <Tab _selected={{ color: "white", bg: "blue.500" }}>All Students</Tab>
            <Tab _selected={{ color: "white", bg: "blue.500" }}>
              Shortlisted Students
            </Tab>
          </TabList>
        </Flex>


        <TabPanels>
          <TabPanel>
            <Text fontSize={{ base: "1xl", md: "3xl" }} mt={4} mb={4}>
              All Students
            </Text>
            <ReusableTable
              data={allStudents}
              columns={columns}
              rows={allStudents}
              actions={actions}
            />
          </TabPanel>

          <TabPanel>
            {(shortlistCriteria.generalCutOff === null && shortlistCriteria.categoryCriteria.length === 0) ? (
              <Text fontSize={{ base: "1xl", md: "3xl" }} mt={4} mb={4}>
                Shortlist Students
              </Text>
            ) : (
              <Text fontSize={{ base: "1xl", md: "3xl" }} mt={4} mb={4}>
                Shortlisted Criteria
              </Text>
            )}
            <Box boxShadow="xs" rounded="md" p="6" mb="4">
              <Text fontSize={{ base: "md", md: "xl" }} mb={4}>
                Criteria
              </Text>
              {categories.map((category, index) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={3}
                  key={category.categoryId}
                >
                  <Text fontWeight="bold" width="150px" mr={3}>
                    {category.category} cutoff
                  </Text>
                  <Box display="flex" flexDirection="row" gap={3}>
                    {/* Input for Hard */}
                    {category.levels.find((level) => level.level === 3)?.questions.length > 0 && (
                      <Box width="15rem">
                        <Input
                          type="number"
                          name={`${category.category.toLowerCase()}_hard`}
                          placeholder={`Hard (max ${category.levels.find((level) => level.level === 3)?.questions.length || 0})`}
                          bgColor="white"
                          value={shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 3)
                            ? shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 3).cutOff
                            : inputs[`${category.category}`]?.hard || ""}
                          onChange={(e) =>
                            shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 3)
                              ? null
                              : handleInputChange(category.category, "hard", e.target.value)
                          }
                          isReadOnly={
                            shortlistCriteria.generalCutOff > 0 ||
                            shortlistCriteria.categoryCriteria.length > 0 ||
                            !!shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 3)
                          }
                        />
                        {validationErrors[`${category.category}_hard`] && (
                          <Text color="red.500" fontSize="sm">
                            {validationErrors[`${category.category}_hard`]}
                          </Text>
                        )}
                      </Box>
                    )}

                    {/* Input for Medium */}
                    {category.levels.find((level) => level.level === 2)?.questions.length > 0 && (
                      <Box width="15rem">
                        <Input
                          type="number"
                          name={`${category.category.toLowerCase()}_medium`}
                          placeholder={`Medium (max ${category.levels.find((level) => level.level === 2)?.questions.length || 0})`}
                          bgColor="white"
                          value={shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 2)
                            ? shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 2).cutOff
                            : inputs[`${category.category}`]?.medium || ""}
                          onChange={(e) =>
                            shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 2)
                              ? null
                              : handleInputChange(category.category, "medium", e.target.value)
                          }
                          isReadOnly={
                            shortlistCriteria.generalCutOff > 0 ||
                            shortlistCriteria.categoryCriteria.length > 0 ||
                            !!shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 2)
                          }
                        />
                        {validationErrors[`${category.category}_medium`] && (
                          <Text color="red.500" fontSize="sm">
                            {validationErrors[`${category.category}_medium`]}
                          </Text>
                        )}
                      </Box>
                    )}

                    {/* Input for Easy */}
                    {category.levels.find((level) => level.level === 1)?.questions.length > 0 && (
                      <Box width="15rem">
                        <Input
                          type="number"
                          name={`${category.category.toLowerCase()}_easy`}
                          placeholder={`Easy (max ${category.levels.find((level) => level.level === 1)?.questions.length || 0})`}
                          bgColor="white"
                          value={shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 1)
                            ? shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 1).cutOff
                            : inputs[`${category.category}`]?.easy || ""}
                          onChange={(e) =>
                            shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 1)
                              ? null
                              : handleInputChange(category.category, "easy", e.target.value)
                          }
                          isReadOnly={
                            shortlistCriteria.generalCutOff > 0 ||
                            shortlistCriteria.categoryCriteria.length > 0 ||
                            !!shortlistCriteria.categoryCriteria.find(item => item.category === category.categoryId && item.questionLevel === 1)
                          }
                        />
                        {validationErrors[`${category.category}_easy`] && (
                          <Text color="red.500" fontSize="sm">
                            {validationErrors[`${category.category}_easy`]}
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mb={3}
              >
                <Text fontWeight="bold" width="150px" mr={3}>
                  Total cutoff
                </Text>
                <Input
                  type="number"
                  name="Total_cuttoff"
                  placeholder="Total"
                  bgColor="white"
                  width="15rem"
                  value={total || (shortlistCriteria.generalCutOff === null ? 0 : shortlistCriteria.generalCutOff) || ''}
                  onChange={(e) => setTotal(e.target.value)}
                  // isReadOnly={shortlistCriteria.generalCutOff !== undefined && shortlistCriteria.categoryCriteria.length > 0}
                  isReadOnly={
                    shortlistCriteria.generalCutOff !== null ||
                    shortlistCriteria.categoryCriteria.length > 0
                  }
                />
              </Box>
              {(shortlistCriteria.generalCutOff === null && shortlistCriteria.categoryCriteria.length === 0) && (
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  flexDirection="row"
                  gap={4}
                >
                  <Button
                    variant="outline"
                    color={clickButtonColor}
                    onClick={handleClearInputs}
                  >
                    Clear Filter
                  </Button>
                  <ClickButton
                    label="Apply Filter"
                    bgColor="#3b4891"
                    onClick={handleSubmit}
                    isDisabled={isEmpty}
                  />
                </Box>
              )}
            </Box>
            <ReusableTable
              data={shortlistedStudents}
              columns={columns}
              rows={shortlistedStudents}
              actions={actions}
            />
            <Flex justify="right">
              {loading ? (
                <LoadingSpinner />
              ) : (shortlistCriteria.generalCutOff === null && shortlistCriteria.categoryCriteria.length === 0 && shortlistedStudents.length > 0) ? (
                <ClickButton
                  label={"Save & Send Mail"}
                  bgColor={clickButtonColor}
                  mt={5}
                  onClick={handleOpenModal}
                />
              ) : null}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Toast component */}
      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
      />

      <ConfirmDialog
        open={openStatusModal}
        title="Confirm Mail Send"
        description="Are you sure you want to send the mail to listed students as shortlisted ?"
        onClose={handleCloseModal}
        onConfirm={handleSendMail}
      />
      <PaperModal
        open={openStudentDetailModal}
        handleClose={handleStudentCloseModal}
      >
        <Text p="2" as="b" fontSize="2xl">
          Profile View
        </Text>
        <StudentDetail handleClose={handleStudentCloseModal} userId={id} />
      </PaperModal>

    </Box>
  );
};

export default StudentsShortlisted;