import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TableContainer,
} from "@chakra-ui/react";
import PropTypes from 'prop-types';
import LoadingSpinner from "../../../components/spinner/Spinner.jsx";
import AlertBox from "../../../components/alert/Alert.jsx";
import { adminServices } from "../../../services/AdminServices.js";
import { FaUserAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { IoMdSchool } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { PiExam } from "react-icons/pi";
import { iconSize } from "../../../utils/Strings.js";
import ReusableTable from "../../../components/table/Table.jsx";
import { StudentManagementErrorCodes } from "./StudentManagementErrorCodes.jsx";
import { GrHistory } from "react-icons/gr";
import { IoBookOutline } from "react-icons/io5";

function StudentDetail({ userId }) {
  const [studentDetails, setStudentDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
 
  // Fetch student details by ID
  const fetchStudentDetails = async (studentId) => {
    setLoading(true);
    try {
      const response = await adminServices.adminGetStudentById(studentId);
      if (response.status === 200) {
        const studentData = {
          id: response.data.id,
          name: response.data.name,
          institutionId: response.data.institution?.id || null,
          institutionName: response.data.institution?.institution_name || "",
          courseName: response.data.course.name || "",
          email: response.data.email,
          passOutYear: response.data.pass_out_year,
          examId: response.data.exam?.id || null,
          examName: response.data.exam?.exam_name || "",
          phone: response.data.phone,
          cgpa: response.data.cgpa,
          backlog: response.data.no_of_backlogs,
        };
        setStudentDetails(studentData);
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(
        StudentManagementErrorCodes(error.response?.data?.errorCode)
      );
      setLoading(false);
    }
  };
 
 
  useEffect(() => {
    if (userId) {
      fetchStudentDetails(userId);
    }
  }, [userId]);

  // Define columns
  const columns = [
    { field: "icon", headerName: "" },
    { field: "label", headerName: "" },
    { field: "value", headerName: "" },
  ];

  // rows with the data for ReusableTable
  const rows = [
    { id: 1, icon: <FaUserAlt size={iconSize} color="green" />, label: "Name", value: studentDetails.name },
    { id: 2, icon: <HiOutlineMail size={iconSize} color="skyblue" />, label: "Email", value: studentDetails.email },
    { id: 3, icon: <MdOutlinePhoneIphone size={iconSize} color="violet" />, label: "Phone", value: studentDetails.phone },
    { id: 4, icon: <IoMdSchool size={iconSize} />, label: "Institution", value: studentDetails.institutionName },
    { id: 5, icon: <IoBookOutline size={iconSize} color="skyblue"/>, label: "Qualification", value: studentDetails.courseName },
    { id: 6, icon: <SlCalender size={iconSize} color="brown" />, label: "Passout Year", value: studentDetails.passOutYear },
    { id: 7, icon: <PiExam size={iconSize} color="blue" />, label: "CGPA", value: studentDetails.cgpa },
    { id: 8, icon: <GrHistory size={24} color="red" />  , label:"Backlogs", value: studentDetails.backlog}
  ];

  return (
    <>
      <Box textAlign="center" maxH="32px">
        {errorMessage && (
          <AlertBox
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Stack spacing="4" mb="35px" p="2" mt="20px">
          
          <TableContainer>
            <ReusableTable
              columns={columns}
              rows={rows}
              showCheckboxes={false}
            />
          </TableContainer>
        </Stack>
      )}
    </>
  );
}

StudentDetail.propTypes = {
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default StudentDetail;
