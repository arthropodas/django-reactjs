import React, { useEffect, useState } from "react";
import Card from "./Card";
import { SimpleGrid } from "@chakra-ui/react";
import { BiSolidCategory } from "react-icons/bi";
import { BsBuildingFillAdd, BsFillQuestionSquareFill } from "react-icons/bs";
import { PiExamFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { adminServices } from "../../../services/AdminServices";
import { Link } from "react-router-dom";

const Home = () => {
  const [counts, setCounts] = useState(0);

  const fetchCountDetails = () => {
    adminServices
      .adminDashboardCount()
      .then((response) => {
        setCounts(response.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCountDetails();
  }, []);

  return (
    <SimpleGrid columns={3} spacingX={"5%"} spacingY={"22%"}>
      <Link to="questionCategoryList">
        <Card
          icon={<BiSolidCategory fontSize="35px" color="white" />}
          label="Question Sections"
          count={counts.question_category_count}
        />
      </Link>
      <Link to="questions">
        <Card
          icon={<BsFillQuestionSquareFill fontSize="35px"  color="white" />}
          label="Questions"
          count={counts.question_count}
        />
      </Link>
      <Link to="institutionsList">
        <Card
          icon={<BsBuildingFillAdd fontSize="35px"  color="white" />}
          label="Institution"
          count={counts.institution_count}
        />
      </Link>
      
        <Card
          icon={<FaUsers fontSize="35px"  color="white"  />}
          label="Shortlisted Students"
          count={counts.student_count}
        />
     
      <Link to="examsList">
        <Card
          icon={<PiExamFill fontSize="35px"  color="white"  />}
          label="Exams Completed"
          count={counts.exam_count}
        />
      </Link>
      <Link to="feedback">
        <Card
          icon={<MdFeedback fontSize="35px"  color="white" />}
          label="Feedbacks"
          count={counts.feedback_count}
        />
      </Link>
    </SimpleGrid>
  );
};

export default Home;
