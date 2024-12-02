import React from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  SimpleGrid,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import ClickButton from "../../../components/button/OnClickButton";

function SideNavigation({
  isSubmitting,
  questionCount,
  onQuestionClick,
  onClick,
  answers,
  questions,
}) {

  const isMobile = useBreakpointValue({ base: true, md: false });

  const totalQuestions = questions.length;
  const attendedQuestions = Object.keys(answers).filter(questionId => answers[questionId].length > 0).length;
  const remainingQuestions = totalQuestions - attendedQuestions;

  return (
    <Box
      flex="1"
      mt="0.5rem"
      mr="2rem"
      ml="2rem"
      p="2rem"
      bg="gray.50"
      borderRadius="md"
      boxShadow="sm"
      minHeight="600px"
      maxHeight="600px"
      overflowX="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Text textAlign="center" mb={5}>Total Questions: {questionCount}</Text>

        {/* Use HStack for mobile and SimpleGrid for larger screens */}
        {isMobile ? (
          <HStack
            minW={{ base: "290px" }}
            maxWidth={"10rem"}
            paddingLeft={"2rem"}
            pl={1}
            spacing={2}
            overflowX="auto"
            justifyContent="center"
          >
            {questions.map((question, index) => {
              const questionId = question.id;
              const isAnswered = answers[questionId] !== undefined && answers[questionId].length > 0;

              return (
                <Button
                  key={index}
                  colorScheme={isAnswered ? "green" : "red"}
                  onClick={() => onQuestionClick(index)}
                >
                  Q{index + 1}
                </Button>
              );
            })}
          </HStack>
        ) : (
          <Box maxHeight="340px" overflowX="auto" display="flex" justifyContent="space-between">
            <SimpleGrid columns={{ md: 6 }} minW={{ base: "290px" }} spacing={2}>
              {questions.map((question, index) => {
                const questionId = question.id;
                const isAnswered = answers[questionId] !== undefined && answers[questionId].length > 0;

                return (
                  <Button
                    key={index}
                    colorScheme={isAnswered ? "green" : "red"}
                    onClick={() => onQuestionClick(index)}
                    borderRadius="100%"
                    width="50px"
                    height="50px"
                  >
                    Q{index + 1}
                  </Button>
                );
              })}
            </SimpleGrid>
          </Box>
        )}
      </Box>

      <Box>
        <Box mt={1} display={{ base: "none", md: "block" }}>
          <Stack mt={5} spacing={2}>
            <Text fontSize="sm">
              <Box as="span" w="25px" h="20px" bg="red.300" display="inline-block" mr={2} textAlign="center" lineHeight="20px" >
                {remainingQuestions}
              </Box>
              Not Answered
            </Text>
            <Text fontSize="sm">
              <Box as="span" w="25px" h="20px" bg="green.300" display="inline-block" mr={2} textAlign="center" lineHeight="20px" >
                {attendedQuestions}
              </Box>
              Answered
            </Text>
          </Stack>
        </Box>

        <Box mt="2rem" display="flex">
          <ClickButton label="Finish & Submit" colorScheme="blue" disabled={isSubmitting} onClick={onClick} style={{ flex: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default SideNavigation;
