import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Input,
} from "@chakra-ui/react";
import ReusableTable from "../../../components/table/Table";
import { adminServices } from "../../../services/AdminServices";
import { MdDelete } from "react-icons/md";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import { adminExamBatchErrorCodes } from "./ExamBatchErrorCodes";
import SuccessToast from "../../../components/toast/Toast";
import LoadingSpinner from "../../../components/spinner/Spinner";
import { clickButtonColor, toastTime } from "../../../utils/Strings";
import AlertBox from "../../../components/alert/Alert";
import ClickButton from "../../../components/button/OnClickButton";
import { IoChevronBack } from "react-icons/io5";
import SubmitButton from "../../../components/button/SubmitButton";

const BatchDetails = () => {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [startedRows, setStartedRows] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [terminatedRows, setTerminatedRows] = useState([]);
  const [shortlistedRows, setShortlistedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [openBatchStudentModal, setOpenBatchStudentModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentStatusModal, setStudentStatusModal] = useState(false);
  const [studentStatus, setStudentStatus] = useState(null);

  const navigate = useNavigate();

  const handleOpenBatchStudentDeleteModal = (studentId) => {
    setOpenBatchStudentModal(true);
    setStudentId(studentId);
  };

  const handleCloseBatchStudentModal = () => {
    setOpenBatchStudentModal(false);
    setStudentStatusModal(false);
  };

  const handleViewReport = (studentId) => {
    navigate(
      `../examsList/examDetail/batchDetails/${id}/summaryReport/${studentId}`
    );
  };

  const columns = [
    { field: "studentName", headerName: "Student Name" },
    { field: "studentEmail", headerName: "Student Email" },
    { field: "status", headerName: "Status" },
  ];
  const actions = [
    {
      label: "Remove Student",
      color: "red",
      icon: <MdDelete />,
      onClick: (studentId) => handleOpenBatchStudentDeleteModal(studentId),
    },
  ];
  const getStatus = (status) => {
    switch (status) {
      case 0:
        return "Scheduled";
      case 1:
        return "Started";
      case 2:
        return "Completed";
      case 3:
        return "Terminated";
      case 4:
        return "Rejected";
      case 5:
        return "Shortlisted";
      default:
        return "Unknown";
    }
  };

  const fetchBatchStudents = () => {
    adminServices
      .adminBatchStudents(id, search)
      .then((response) => {
        if (response.status === 200) {
          const responseData = response.data.map((student) => ({
            id: student.student_id,
            studentName: student.student_name,
            studentEmail: student.student_email,
            status: getStatus(student.batch_mapping_status),
          }));

          setRows(responseData);

          // Filter the data based on status
          setStartedRows(
            responseData.filter((student) => student.status === "Started")
          );
          setCompletedRows(
            responseData.filter((student) => student.status === "Completed")
          );
          setTerminatedRows(
            responseData.filter((student) => student.status === "Terminated")
          );
          setShortlistedRows(
            responseData.filter((student) => student.status === "Shortlisted")
          );
        }
      })
      .catch((error) => {
        setErrorMessage(
          adminExamBatchErrorCodes(error?.response?.data?.errorCode)
        );
      });
  };

  const handleBatchStudentDeleteConfirmation = () => {
    setOpenBatchStudentModal(false);
    adminServices
      .adminBatchDeleteStudents(id, studentId)
      .then((response) => {
        if (response.status === 200) {
          fetchBatchStudents(); // Assuming you have this function to refresh data
        }
        setOpenBatchStudentModal(false);
        setSuccessMessage("Student Deleted Successfully");
        setLoading(false);
        setToastOpen(true);
        setTimeout(() => {
          setToastOpen(false);
        }, toastTime);
      })
      .catch((error) => {
        setErrorMessage(
          adminExamBatchErrorCodes(error?.response?.data?.errorCode)
        );
      });
  };

  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleStudentStatusChange = (studentId) => {
    setStudentId(studentId);
    setStudentStatusModal(true);
  }

  const handleStudentStatusConfirmation = async () => {
    setLoading(true);
    try {
      setStudentStatusModal(false);

      const response = await adminServices.adminStudentStatusChange(id, studentId);
      if (response.status === 200) {
        fetchBatchStudents();
        setErrorMessage('');
        setSuccessMessage('Student Status Changed Successfully');
        setLoading(false);
        setToastOpen(true);
      }
    } catch (error) {
      setErrorMessage(adminExamBatchErrorCodes(error?.response?.data?.errorCode));
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    setErrorMessage("")
    setCompletedRows([]);
    setStartedRows([]);
    setTerminatedRows([]);
    setShortlistedRows([]);
    e.preventDefault();
    fetchBatchStudents();
  };

  useEffect(() => {
    fetchBatchStudents();
  }, [id]);

  return (
    <>
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
      <Flex justify="space-between" align="center" mb={4}>
        <ClickButton
          label="back"
          bgColor={clickButtonColor}
          width={"8%"}
          height="40px"
          icon={<IoChevronBack />}
          onClick={handleGoBack}
        />
      </Flex>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <Text fontSize={{ base: "1xl", md: "3xl" }}>
            Batch Students Details
          </Text>

          <Tabs mt={7}>
            <TabList>
              <Tab>All Students</Tab>
              <Tab>Started</Tab>
              <Tab>Completed</Tab>
              <Tab>Terminated</Tab>
              <Tab>Shortlisted</Tab>
            </TabList>
            <Box display="flex" justifyContent="space-between" mb={4} mt={5} ml={4} >
              <form
                onSubmit={handleFormSubmit}
                style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  type="text"
                  bg="white"
                  name="student"
                  title="Student Search"
                  onChange={handleSearch}
                  placeholder="Enter Student Name/Email"
                  mr={2}
                />
                <SubmitButton label="Search" data-testId='Search' bgColor={clickButtonColor} title="search" type="submit" />
              </form>&nbsp;
            </Box>
            <TabPanels>

              {/* All Students */}
              <TabPanel>
                <ReusableTable
                  columns={columns}
                  rows={rows}
                  actions={actions}
                  handleViewReport={handleViewReport}
                  handleStatusChange={handleStudentStatusChange}
                />
              </TabPanel>

              {/* Started Students */}
              <TabPanel>
                <ReusableTable
                  columns={columns}
                  rows={startedRows}
                  actions={actions}
                />
              </TabPanel>

              {/* Completed Students */}
              <TabPanel>
                <ReusableTable
                  columns={columns}
                  rows={completedRows}
                  actions={actions}
                  handleViewReport={handleViewReport}
                />
              </TabPanel>

              {/* Terminated Students */}
              <TabPanel>
                <ReusableTable
                  columns={columns}
                  rows={terminatedRows}
                  actions={actions}
                  handleStatusChange={handleStudentStatusChange}
                />
              </TabPanel>

              {/* ShortlistedStudents */}
              <TabPanel>
                <ReusableTable
                  columns={columns}
                  rows={shortlistedRows}
                  actions={actions}
                  handleViewReport={handleViewReport}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}

      <ConfirmDialog
        open={openBatchStudentModal}
        title="Confirm Delete"
        description="Are you sure you want to remove the Student from the batch?"
        onClose={handleCloseBatchStudentModal}
        onConfirm={handleBatchStudentDeleteConfirmation}
      />

      {/*Student status change confirmation */}
      <ConfirmDialog
        open={studentStatusModal}
        title="Confirm Status Change"
        description="Are you sure you want to change the status of this student to schedule ?"
        onClose={handleCloseBatchStudentModal}
        onConfirm={handleStudentStatusConfirmation}
      />

      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={successMessage}
      />
    </>
  );
};

export default BatchDetails;
