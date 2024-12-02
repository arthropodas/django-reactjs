import React, { useState, useEffect } from "react";
import {
  GridItem,
  Box,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { adminServices } from "../../../services/AdminServices";
import ClickButton from "../../../components/button/OnClickButton";
import SuccessToast from "../../../components/toast/Toast";
import { useParams } from "react-router-dom";
import adminExamMappingErrorCodes from "./ExamMappingErrorCodes";
import CustomPagination from "../../../components/pagination/Pagination";
import { contentCount } from "../../../utils/Strings";
import LoadingSpinner from "../../../components/spinner/Spinner";
import AlertBox from "../../../components/alert/Alert";

function ExamMapping() {
  const [errorMessage, setErrorMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]); // Store enrolled students
  const [selectedStudents, setSelectedStudents] = useState([]); // Track selected students
  const [availableStudentsArray, setAvailableStudentsArray] = useState([]); // Track selected students in "Available to Add"
  const [isSendLinkEnabled, setIsSendLinkEnabled] = useState(false); // Manage button state
  const [isRemoveButtonEnabled, setIsRemoveButtonEnabled] = useState(false); // Manage button state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isAddToExamEnabled, setIsAddToExamEnabled] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Registered";
      case 1:
        return "Started";
      case 2:
        return "Completed";
      case 3:
        return "Not Completed";
      default:
        return "Unknown";
    }
  };

  const fetchEnrolledStudents = async (page = 1) => {
    let active = 1;
    try {
      const response = await adminServices.adminListStudentsInExam(
        id,
        active,
        page
      );
      if (response.status === 200) {
        const students = response.data.results;
        const sortedStudents = students.sort((a, b) => {
          return a.exam_mapping_details?.link_sent - b.exam_mapping_details?.link_sent;
        });
        setEnrolledStudents(sortedStudents);
        setTotalPages(Math.ceil(response.data.count / contentCount));
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(adminExamMappingErrorCodes(error.response?.data?.errorCode));
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async (page = 1) => {
    let active = 0;
    try {
      const response = await adminServices.adminListStudentsInExam(
        id,
        active,
        page
      );
      if (response.status === 200) {
        setAvailableStudents(response.data.results);
        setTotalPages(Math.ceil(response.data.count / contentCount));
      }
    } catch (error) {
      setErrorMessage(adminExamMappingErrorCodes(error.response?.data?.errorCode));
    }
  };

  const handleSendLink = async () => {
    setLoading(true);
    const examId = parseInt(id);
    try {
      await adminServices.adminSendExamLink({
        examId,
        studentId: selectedStudents,
      });
      setSuccessMessage("Links sent successfully!");
      setToastOpen(true);
      setSelectedStudents([]);
      setIsSendLinkEnabled(false);
      setIsRemoveButtonEnabled(false);
      await fetchEnrolledStudents();
      setLoading(false);
    } catch (error) {
      setErrorMessage(adminExamMappingErrorCodes(error?.response?.data?.errorCode));
      setLoading(false);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleAddtoExam = async () => {
    const examId = parseInt(id);
    try {
      await adminServices.adminStudentExamMapping({
        examId,
        studentId: availableStudentsArray,
        removeStudentId: [],
      });
      setSuccessMessage("Students added to exam successfully!");
      setToastOpen(true);
      setAvailableStudentsArray([]);
      setIsAddToExamEnabled(false);
      await fetchAvailableStudents();
      await fetchEnrolledStudents();
    } catch (error) {
      setErrorMessage(adminExamMappingErrorCodes(error.response?.data?.errorCode));
    }
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId];
      setIsSendLinkEnabled(newSelected.length > 0);
      setIsRemoveButtonEnabled(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleAvailableCheckboxChange = (studentId) => {
    setAvailableStudentsArray((prevAvailable) => {
      const newAvailable = prevAvailable.includes(studentId)
        ? prevAvailable.filter((id) => id !== studentId)
        : [...prevAvailable, studentId];
      setIsAddToExamEnabled(newAvailable.length > 0);
      return newAvailable;
    });
  };
  const handleRemoveStudents = async () => {
    const examId = parseInt(id);
    try {
      await adminServices.adminStudentExamMapping({
        examId: examId,
        studentId: [],
        removeStudentId: selectedStudents,
      });
      setSuccessMessage("Students are removed successfully!");
      setToastOpen(true);
      setSelectedStudents([]);
      setIsRemoveButtonEnabled(false);
      setIsSendLinkEnabled(false);
      await fetchEnrolledStudents();
      await fetchAvailableStudents();
    } catch (error) {
      setErrorMessage(adminExamMappingErrorCodes(error.response?.data?.errorCode));
    }
  };
  useEffect(() => {
    fetchEnrolledStudents(currentPage);
    fetchAvailableStudents(currentPage);
  }, [currentPage]);
  return (
    <>
      {errorMessage && (
        <Box textAlign="center" mb={4} minW="50vw">
          <AlertBox
            message={errorMessage}
            onClose={() => { setErrorMessage('') }}
          />
        </Box>
      )}
      {loading ? (
        <GridItem colSpan={12}>
          <LoadingSpinner />
        </GridItem>
      ) : (
        <GridItem colSpan={12}>
          <Card mt={6}>
            <CardHeader>
              <Text fontSize="2xl">Students</Text>
            </CardHeader>
            <CardBody>
              <Tabs variant="enclosed">
                <TabList>
                  <Tab>Already Added</Tab>
                  <Tab>Available to Add</Tab>
                  <Tab>Started</Tab>
                  <Tab>Completed</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Box>
                      <Text fontSize="2xl" mb={4}>
                        Enrolled Students
                      </Text>
                      {enrolledStudents.length > 0 ? (
                        <Table variant="striped">
                          <Thead>
                            <Tr>
                              <Th>Selection</Th>
                              <Th>Student Name</Th>
                              <Th>Link Shared Status</Th>
                              <Th>Exam Status</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {enrolledStudents.map((student) => (
                              <Tr key={student.student_id}>
                                <Td>
                                  <Checkbox
                                    aria-label={`Select ${student.name}`}
                                    bgColor="white"
                                    isChecked={selectedStudents.includes(
                                      student.student_id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(student.student_id)
                                    }
                                  />
                                </Td>
                                <Td>{student.name}</Td>
                                <Td>
                                  {student.exam_mapping_details?.link_sent
                                    ? "Shared"
                                    : "Not shared"}
                                </Td>
                                <Td>
                                  {getStatusLabel(student.exam_mapping_details?.status_exam_student)}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>No students enrolled yet.</Text>
                      )}
                    </Box>
                    <CardFooter mt={4}>
                      <ClickButton
                        onClick={handleSendLink}
                        label="Send Link"
                        buttonColor="green"
                        isDisabled={!isSendLinkEnabled} // Disable based on checkbox selection
                      />
                      &nbsp;
                      <ClickButton
                        onClick={handleRemoveStudents}
                        isDisabled={!isRemoveButtonEnabled}
                        label="Remove Students"
                        buttonColor="green"
                      />
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevious={() => setCurrentPage((prev) => prev - 1)}
                        handleNext={() => setCurrentPage((prev) => prev + 1)}
                        setCurrentPage={handlePageChange}
                      />
                    </CardFooter>
                  </TabPanel>

                  <TabPanel>
                    <Box>
                      <Text fontSize="2xl" mb={4}>
                        Unenrolled Students
                      </Text>
                      {availableStudents.length > 0 ? (
                        <Table variant="striped">
                          <Thead>
                            <Tr>
                              <Th>Selection</Th>
                              <Th>Student Name</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {availableStudents.map((student) => (
                              <Tr key={student.id}>
                                <Td>
                                  <Checkbox
                                    aria-label={`Select ${student.name}`}
                                    bgColor="white"
                                    isChecked={availableStudentsArray.includes(
                                      student.id
                                    )}
                                    onChange={() =>
                                      handleAvailableCheckboxChange(student.id)
                                    }
                                  />
                                </Td>
                                <Td>{student.name}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>No available students to add.</Text>
                      )}
                    </Box>
                    <CardFooter mt={4}>
                      <ClickButton
                        onClick={handleAddtoExam}
                        label="Add to Exam"
                        buttonColor="green"
                        isDisabled={!isAddToExamEnabled}
                      />
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevious={() => setCurrentPage((prev) => prev - 1)}
                        handleNext={() => setCurrentPage((prev) => prev + 1)}
                        setCurrentPage={handlePageChange}
                      />
                    </CardFooter>
                  </TabPanel>

                  <TabPanel>
                    <Box>
                      <Text fontSize="2xl" mb={4}>
                        Exam Attending
                      </Text>
                      {enrolledStudents.length > 0 ? (
                        <Table variant="striped">
                          <Thead>
                            <Tr>
                              <Th>Student Name</Th>
                              <Th>Exam Status</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {enrolledStudents
                              .filter((student) => student.exam_mapping_details?.status_exam_student === 1)
                              .map((student) => (
                                <Tr key={student.student_id}>
                                  <Td>{student.name}</Td>
                                  <Td>
                                    {getStatusLabel(student.exam_mapping_details?.status_exam_student)}
                                  </Td>
                                </Tr>
                              ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>No students attended exam yet.</Text>
                      )}
                    </Box>
                    <CardFooter mt={4}>
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevious={() => setCurrentPage((prev) => prev - 1)}
                        handleNext={() => setCurrentPage((prev) => prev + 1)}
                        setCurrentPage={handlePageChange}
                      />
                    </CardFooter>
                  </TabPanel>


                  <TabPanel>
                    <Box>
                      <Text fontSize="2xl" mb={4}>
                        Exam Completed
                      </Text>
                      {enrolledStudents.length > 0 ? (
                        <Table variant="striped">
                          <Thead>
                            <Tr>
                              <Th>Student Name</Th>
                              <Th>Exam Status</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {enrolledStudents
                              .filter(student => student.exam_mapping_details.status_exam_student === 2) // Filter students who have started the exam
                              .map(student => (

                                <Tr key={student.student_id}>
                                  <Td>{student.name}</Td>
                                  <Td>
                                    {getStatusLabel(student.exam_mapping_details?.status_exam_student)}
                                  </Td>
                                </Tr>
                              ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>No students completed exam yet.</Text>
                      )}
                    </Box>
                    <CardFooter mt={4}>
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevious={() => setCurrentPage((prev) => prev - 1)}
                        handleNext={() => setCurrentPage((prev) => prev + 1)}
                        setCurrentPage={handlePageChange}
                      />
                    </CardFooter>
                  </TabPanel>

                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </GridItem>)}
      <SuccessToast
        show={toastOpen}
        message={successMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

export default ExamMapping;
