import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminServices } from "../../../services/AdminServices";
import ReusableTable from "../../../components/table/Table";
import { Box, HStack, Spacer, Text, Tooltip } from "@chakra-ui/react";
import { dashboardColor } from "../../../utils/Strings";
import { FaArrowRightToBracket } from "react-icons/fa6";

function ExaminationTable() {
  const [examData, setExamData] = useState([]);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("examsList");
  };
  const fetchTableData=()=>{
    adminServices
      .adminExamQuestionnaireAnalytics()
      .then((response) => {
        setExamData(response.data.latest_exam_details);
      })
      .catch((error) => {});
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  const examsData = examData.map((exams) => {
    return {
      examName: exams.exam_name,
      location: exams.exam_location,
      shortlistStudent: exams.number_of_shortlisted_students,
      examStatus: exams.status_of_exam,
    };
  });

  const columns = [
    { field: "examName", headerName: "Exam Name" },
    { field: "location", headerName: "Exam Location" },
    { field: "shortlistStudent", headerName: "No.of Shortlisted Students" },
    { field: "examStatus", headerName: "Exam Status" },
  ];

  return (
    <>
      <HStack>
        <Text as="b" fontSize="20px">
          Recent Examination
        </Text>
        <Spacer />
        <Tooltip label="View more" aria-label="view more">
          <Box align="right" p={2} aria-label="view more">
            <FaArrowRightToBracket
              onClick={handleNavigation}
              color="blue"
              size={25}
            />
          </Box>
        </Tooltip>
      </HStack>
      <ReusableTable
        bg={dashboardColor}
        data={examsData}
        rows={examsData}
        columns={columns}
      />
    </>
  );
}

export default ExaminationTable;
