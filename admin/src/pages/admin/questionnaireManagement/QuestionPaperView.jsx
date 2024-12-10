import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  Flex,
} from "@chakra-ui/react";
import { adminServices } from "../../../services/AdminServices";
import { clickButtonColor, questionLevel } from "../../../utils/Strings";
import LoadingSpinner from "../../../components/spinner/Spinner";
import AlertBox from "../../../components/alert/Alert";
import adminQuestionnaireErrorCodes from "./QuestionnaireErrorCodes";

import { FaCircle } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import ClickButton from "../../../components/button/OnClickButton";

function QuestionPaperView({ questionnaireName, data, questionnaireId }) {
  const [questionnaireDetails, setQuestionnaireDetails] = useState(data || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const actualQuestionnaireId = questionnaireId || id;
  const currentUrl = window.location.href;
  const fetchDetails = async (questionnaireId) => {
    setLoading(true);
    try {
      const response = await adminServices.adminQuestionnaireDetailView(
        questionnaireId
      );
      if (response.status === 200) {
        setQuestionnaireDetails(response.data.preview);
      }
    } catch (error) {
      setErrorMessage(
        adminQuestionnaireErrorCodes(error.response?.data?.errorCode)
      );
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level) => {
    return (
      questionLevel.find((l) => l.id === level) || {
        value: "Unknown",
        color: "gray.500",
      }
    );
  };
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const renderOption = (option) => (
    <ListItem key={option.id} display="flex" alignItems="center">
      <ListIcon
        as={FaCircle}
        color={option.isCorrect ? "green.400" : "gray.400"}
      />
      <Text fontSize="sm" wordBreak="break-word">
        {option.value}
      </Text>
      {/* </Box> */}
    </ListItem>
  );

  const renderQuestion = (question, questionIndex) => (
    <Box key={question.id} mt="4" width="100%">
      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="bold"
        wordBreak="break-word"
      >
        {questionIndex + 1}: {question.value}
      </Text>
      {question.questionImage && (
        <Image
          src={question.questionImage}
          alt={`Question ${questionIndex + 1} image`}
          mt="2"
          maxH="200px"
          objectFit="contain"
          maxW="100%"
        />
      )}
      <VStack align="start" spacing={2} mt="2">
        {/* <Text fontWeight="bold" fontSize="sm">
          Options:
        </Text> */}
        <List spacing={2}>{question.options.map(renderOption)}</List>
      </VStack>
      <Divider mt="4" />
    </Box>
  );

  const renderLevel = (categoryItem, levelItem) => {
    const { value, color } = getLevelInfo(levelItem.level);

    return (
      <VStack key={levelItem.level} align="start" width="100%">
        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="lg" color="blue.600">
            {categoryItem.category}
          </Text>
          <Text fontSize="md" fontWeight="bold" color={color}>
            {value}
          </Text>
          <Text fontSize="md">Count: {levelItem.questions.length}</Text>
        </HStack>
        <Divider />
        {levelItem.questions.map((question, index) =>
          renderQuestion(question, index)
        )}
      </VStack>
    );
  };

  const renderCategory = (categoryItem) => (
    <VStack
      key={categoryItem.categoryId}
      align="start"
      mb="6"
      spacing={4}
      width="100%"
    >
      {categoryItem.levels.map((levelItem) =>
        renderLevel(categoryItem, levelItem)
      )}
    </VStack>
  );

  useEffect(() => {
    if (actualQuestionnaireId) {
      fetchDetails(actualQuestionnaireId);
    }
  }, [actualQuestionnaireId]);

  useEffect(() => {
    setQuestionnaireDetails(data || []);
  }, [data]);

  return (
    <>
      {errorMessage && (
        <Box textAlign={{ base: "center", md: "center" }} mb={4}>
          <AlertBox
            message={errorMessage}
            onClose={() => {
              setErrorMessage("");
            }}
          />
        </Box>
      )}

      {currentUrl.includes("questionnaireList") ? (
        <></>
      ) : (
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
      )}

      <Box
        p="10"
        width="100%"
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        maxH="80vh"
        overflowY="auto"
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          mb="4"
          wordBreak="break-word"
        >
          {questionnaireName || ""}
        </Text>

        {loading ? (
          <LoadingSpinner />
        ) : (
          questionnaireDetails.map(renderCategory)
        )}
      </Box>
    </>
  );
}

QuestionPaperView.propTypes = {
  questionnaireName: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      categoryId: PropTypes.number.isRequired,
      levels: PropTypes.arrayOf(
        PropTypes.shape({
          level: PropTypes.string.isRequired,
          questions: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              value: PropTypes.string.isRequired,
              type: PropTypes.string.isRequired,
              question_image: PropTypes.string,
              options: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.number.isRequired,
                  value: PropTypes.string.isRequired,
                  isCorrect: PropTypes.bool.isRequired,
                })
              ).isRequired,
            })
          ).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  questionnaireId: PropTypes.number,
};

export default QuestionPaperView;
