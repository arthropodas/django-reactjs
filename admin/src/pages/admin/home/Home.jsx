import React, { useEffect, useState } from "react";
import Card from "./Card";
import { HStack, SimpleGrid, Box, Center, Text } from "@chakra-ui/react";
import { BsBuildingFillAdd, BsFillQuestionSquareFill } from "react-icons/bs";
import { PiExamFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { adminServices } from "../../../services/AdminServices";
import ReChart from "../analytics/ReChart";
import DoughnutChart from "../analytics/DoughNutReChart";
import ExaminationTable from "../analytics/ExaminationTable";
import { dashboardColor } from "../../../utils/Strings";
import CoursePieChart from "../analytics/CoursePieChart";
import ExamPercentage from "../analytics/ExamPercentage";
import QuestionnaireGraph from "../analytics/LineChart";

const Home = () => {
  const [counts, setCounts] = useState(0);
  const fetchCountDetails = () => {
    adminServices
      .adminDashboardCount()
      .then((response) => {
        setCounts(response.data.counts);
      })
      .catch(() => { });
  };

  useEffect(() => {
    fetchCountDetails();
  }, []);

  return (
    <>
      <SimpleGrid columns={4} spacingX={"5%"} spacingY={"22%"}>
        <Card
          icon={<BsBuildingFillAdd fontSize="35px" color="white" />}
          label="Institution"
          count={counts.institution_count}
        />
        <Card
          icon={<PiExamFill fontSize="35px" color="white" />}
          label="Shortlisted Students"
          count={counts.shortlisted_student_count}
        />
        <Card
          icon={<FaUsers fontSize="35px" color="white" />}
          label="Total Students"
          count={counts.total_students}
        />
        <Card
          icon={<BsFillQuestionSquareFill fontSize="35px" color="white" />}
          label="Questionnaire Count"
          count={counts.questionnaire_count}
        />
      </SimpleGrid>
      <HStack spacing={8} pt={6}>
        <ReChart />
        <Box bg={dashboardColor} >
          <DoughnutChart />
        </Box>
      </HStack>
      <Box width="100%" mt={5}>
        <ExamPercentage />
      </Box>

      <HStack mt={4} pt={3}>
        <Box width="50%" height="700px" bg={dashboardColor} pt={8}>
          <Text as="b" fontSize="24px" ml={5} mb={20}>
            Course Pie Chart
          </Text>

          <Center>
            <CoursePieChart />
          </Center>
        </Box>
        <Box width="50%" height="700px" bg={dashboardColor} pt={8}>
          <Center>
            <QuestionnaireGraph />
          </Center>
        </Box>
      </HStack>

      <HStack spacing={8}  pt={2}>
        <Box width="100%">

          <Box mt={2}>
            <ExaminationTable />
          </Box>
        </Box>
      </HStack>

    </>
  );
};

export default Home;
