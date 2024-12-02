import React, { useEffect } from "react";
import { Flex, Text, Image } from "@chakra-ui/react";
import termination from "../../../assets/termination.png";
import { studentServices } from "../../../services/StudentServices";

function ExamTerminationPage() {
  const terminateCall=async()=>{
      try {
        const formattedAnswers = {
          action: "terminate"
        };       
        
        const response = await studentServices.answerSubmission(localStorage.getItem("token"), formattedAnswers);
        if (response.status === 200) {
          localStorage.clear();
        }
      } catch (error) {
        console.log("Error",error);
        
      }
  }
  useEffect(()=>{
    terminateCall();
  })

  return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="70vh"
      >
        <Text fontSize={{base: "3xl", md:"5xl"}} as="b" textAlign="center" color="red">
          Sorry, You are terminated from the exam
        </Text>
        <Image
          src={termination}
          alt="exam submission"
          w={{ base: "28vw", md: "20vw" }}
          h={{ base: "30vh", md: "40vh" }}
        />
      </Flex>
  );
}

export default ExamTerminationPage;
