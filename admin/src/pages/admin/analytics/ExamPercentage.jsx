import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminServices } from "../../../services/AdminServices";
import ReusableTable from "../../../components/table/Table";
import { Box, HStack, Link, Spacer, Text, Tooltip } from "@chakra-ui/react";
import { FaArrowRightToBracket } from "react-icons/fa6";

function ExamPercentage() {
  const [examData, setExamData] = useState([]);
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("examsList");
  };
  useEffect(() => {
    adminServices
      .adminExamAnalytics()
      .then((response) => {
        setExamData(response.data.results);
      })
      .catch((error) => {});
  }, []);

  const examsData = examData.map((exams) => {
    return {
      examName: exams.exam_name,
      totalStudents: exams.total_students,
      averageScore: exams.average_score,
      averageRating: exams.average_rating,
      successRate: exams.success_rate,
      failureRate: exams.failure_rate,
      terminationRate: exams.termination_rate,
    };
  });

  const columns = [
    { field: "examName", headerName: "Exam Name" },
    { field: "totalStudents", headerName: "Total Students" },
    { field: "averageScore", headerName: "Average Score" },
    { field: "averageRating", headerName: "Average Rating" },
    { field: "successRate", headerName: "Success Rate" },
    { field: "failureRate", headerName: "Failure Rate" },
    { field: "terminationRate", headerName: "Termination Rate" },
  ];

  return (
    <>
      <HStack>
        <Text as="b" fontSize="20px" mb={0}>
          Exam Analytics
        </Text>
        <Spacer />
        <Tooltip label="View more" aria-label="view more">
          <Box align="right" p={2}>
            <FaArrowRightToBracket
              onClick={handleNavigation}
              color="blue"
              size={25}
            />
          </Box>
        </Tooltip>
      </HStack>
      <ReusableTable data={examsData} rows={examsData} columns={columns} />
    </>
  );
}

export default ExamPercentage;