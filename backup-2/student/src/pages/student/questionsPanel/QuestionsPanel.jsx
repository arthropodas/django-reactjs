import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { jwtDecode } from "jwt-decode";
import {
  Flex,
  Box,
  Text,
  Checkbox,
  CheckboxGroup,
  Stack,
  Radio,
  RadioGroup,
  Image,
} from "@chakra-ui/react";
import { MdOutlineTimer } from "react-icons/md";
import Timer from "../../../components/timer/Timer";
import Footer from "../../../components/studentFooter/Footer";
import SideNavigation from "./SideNavigation";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import { studentServices } from "../../../services/StudentServices";
import useExamResponseStore from "../../../components/store/ResponseStore";
import LoadingSpinner from "../../../components/spinner/Spinner";
import useIsOnline from "../../../utils/useIsOnline";
import { saveExamData } from "../../../utils/indexedDB";
import setExamPrevData from "../../../utils/setExamPrevData";

function QuestionsPanel() {
  const tokenFromUrl = localStorage.getItem("token");
  const isOnline = useIsOnline();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [examTitle, setExamTitle] = useState("");
  const [examConfirm, setExamConfirm] = useState(false);

  const resizeRef = useRef(1);
  const tabSwitchRef = useRef(1);
  const [violated, setViolated] = useState(false);
  const blurTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  // Zustand store
  const { answers, setAnswer, submitAnswers, time, setTime } =
    useExamResponseStore();
  const [hours, setHours] = useState(time?.hours);
  const [minutes, setMinutes] = useState(time?.minutes);
  const [seconds, setSeconds] = useState(time?.seconds);

  const shuffleQuestions = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const stateToken = location.state?.token;
      localStorage.setItem("token", stateToken);
      const userData = location?.state?.userData;

      if (userData) {
        const examData = {
          answers: userData.answers,

          time: userData.time,
          status: userData.status,
          examTitle: userData.examTitle,
          email: userData.email,
          token: userData.token,
          currentQuestionIndex: 0,
          id: 5,
        };

        // Initialize the store with the exam data
        setExamPrevData(examData);
      }

      const response = await studentServices.studentTokenValidation(stateToken);
      if (response.status === 200) {
        setExamTitle(response?.data?.examName);
        setTotalQuestions(response?.data?.questionsCount);
        const fetchedQuestions = response?.data?.questions;

        const shuffledQuestions = shuffleQuestions(fetchedQuestions);
        setQuestions(shuffledQuestions);

        // Set exam time if it's the first load
        if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
          const durationInMinutes = response?.data?.examDuration;
          setHours(Math.floor(durationInMinutes / 60));
          setMinutes(durationInMinutes % 60);
          setSeconds(0);
        }
      }
    } catch (error) {
      console.log("error is", error);
      navigate("/errorPage");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer changes
  const handleAnswerChange = (questionId, selectedOptions) => {
    setAnswer(
      questionId,
      selectedOptions.map((option) => parseInt(option, 10))
    );
  };

  // Submit answers
  async function saveSubmissionOffline(data) {
    storeExamDataOnTermination("submit");

    if ("serviceWorker" in navigator && "SyncManager" in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register("submitAnswers");
    }
  }
  // Submit answers
  const handleSubmitAnswer = async () => {
    setLoading(true);
    try {
      setExamConfirm(false);
      if (isOnline) {
        const response = submitAnswers(tokenFromUrl);
        if (response?.status === 200) {
          navigate("/thanks");
        }
      } else {
        const decoded = jwtDecode(tokenFromUrl);
        const email = decoded["email"];
        saveSubmissionOffline({ token: tokenFromUrl, answers, email: email });
      }
    } catch (error) {
      // Save offline if the network request fails
      navigate("/thanks");
    } finally {
      setLoading(false);
    }
  };

  // Submit answers on time out

  // Submit answers on time out
  const handleSubmitAnswerOnTimeOut = async () => {
    try {
      const response = await submitAnswers(tokenFromUrl);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Handle next/previous question navigation
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionChange = (index) => {
    setCurrentQuestionIndex(index);
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    fetchQuestions();
    setToken(localStorage.getItem("token"));
  }, []);

  // Disable context menu and shortcuts
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const disableShortcuts = (event) => {
      if (
        event.keyCode === 123 || // F12
        (event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
        (event.ctrlKey && event.shiftKey && event.keyCode === 67) // Ctrl+Shift+C
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", disableShortcuts);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", disableShortcuts);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Check if window size is less than 80% of screen size
      if (
        width < window.screen.width * 0.8 ||
        height < window.screen.height * 0.8
      ) {
        if (resizeRef.current === 1) {
          alert("Warning: Resizing the window will terminate the exam.");

          resizeRef.current++;
        } else if (resizeRef.current === 2) {
          alert("You have now been disqualified from the exam!");
          setViolated(true);
          resizeRef.current++;
        }

        // Prevent the blur event from firing immediately after resize
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
        }
        blurTimeoutRef.current = setTimeout(() => {
          blurTimeoutRef.current = null;
        }, 200); // Adjust the timeout as needed
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle window blur (minimize or switch tabs)
  useEffect(() => {
    const handleWindowBlur = () => {
      // Prevent this from firing right after a resize
      if (blurTimeoutRef.current) return;

      if (tabSwitchRef.current === 1) {
        alert(
          "Warning: Switching tabs will terminate the exam on the next attempt."
        );
        tabSwitchRef.current++;
      } else if (tabSwitchRef.current === 2) {
        alert("You have switched tabs again. The exam is now terminated.");
        setViolated(true);
        tabSwitchRef.current++;
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);
  const storeExamDataOnTermination = (status) => {
    const decodedToken = jwtDecode(token);
    const email = decodedToken["email"];
    const examData = {
      answers,
      time: time,
      status: status,
      examTitle,
      email: email,
      token: tokenFromUrl,
      questions,
      currentQuestionIndex,
    };

    saveExamData(examData)
      .then(() => {
        console.log("Exam data saved successfully.");
      })
      .catch((error) => {
        console.error("Error saving exam data: ", error);
      });
  };

  // Redirect on violation
  // if (violated) {
  //   storeExamDataOnTermination("terminated");
  //   navigate("/termination");
  // }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Flex
            direction={{ base: "column", md: "row" }}
            m={{ base: "1rem", md: "2rem" }}
            ml={{ md: "6rem" }}
            mr={{ md: "3rem" }}
            justify="space-between"
            borderRadius="md"
          >
            <Text fontSize="2xl" fontWeight="bold" color="gray">
              {" "}
              {examTitle}{" "}
            </Text>
            <Flex align="center">
              <MdOutlineTimer size={30} />
              <Timer
                initialHour={hours}
                initialMinutes={minutes}
                initialSeconds={seconds}
                onTimeOut={handleSubmitAnswerOnTimeOut}
                setTime={setTime} // Pass setTime to Timer
              />
            </Flex>
          </Flex>

          <Flex
            direction={{ md: "row", base: "column-reverse" }}
            justifyContent={{ base: "center", md: "flex-start" }}
            alignItems={{ base: "center", md: "flex-start" }}
            p={4}
          >
            <Box
              flex="3"
              mt="0.5rem"
              ml={{ base: "0", md: "5rem" }}
              p="2rem"
              bg="gray.50"
              borderRadius="md"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              minHeight="600px"
              justifyContent="space-between"
            >
              <Box maxHeight="500px" overflowX="auto">
                {currentQuestion ? (
                  <>
                    <Text fontSize={{ base: "small", md: "large" }} mb="4%">
                      {" "}
                      Q{currentQuestionIndex + 1}: {currentQuestion.value}{" "}
                    </Text>
                    {currentQuestion.questionImage && (
                      <Image
                        src={currentQuestion.questionImage}
                        alt="Question Image"
                        m="1rem"
                        maxW="70%"
                        height="auto"
                        alignSelf={"center"}
                      />
                    )}
                    {currentQuestion.type === 1 ? (
                      <Box>
                        <RadioGroup
                          colorScheme="blue"
                          value={
                            answers[currentQuestion.id]
                              ? answers[currentQuestion.id][0].toString()
                              : ""
                          }
                          onChange={(selectedOption) =>
                            handleAnswerChange(currentQuestion.id, [
                              parseInt(selectedOption, 10),
                            ])
                          }
                        >
                          <Stack spacing={4} direction="column" pl={9}>
                            {currentQuestion.options.map((option) => (
                              <Box
                                height="4rem"
                                display="flex"
                                alignItems="center"
                                bgColor="#edeff7"
                                borderRadius="5px"
                                p="1.5rem"
                              >
                                <Radio
                                  key={option.id}
                                  value={option.id.toString()}
                                >
                                  {option.value}
                                </Radio>
                              </Box>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Box>
                    ) : (
                      <CheckboxGroup
                        colorScheme="blue"
                        value={answers[currentQuestion.id] || []}
                        onChange={(selectedOptions) =>
                          handleAnswerChange(
                            currentQuestion.id,
                            selectedOptions.map((option) =>
                              parseInt(option, 10)
                            )
                          )
                        }
                      >
                        <Stack spacing={4} direction="column" pl={9} pr={9}>
                          {currentQuestion.options.map((option) => (
                            <Box
                              height="4rem"
                              display="flex"
                              alignItems="center"
                              bgColor="#edeff7"
                              borderRadius="5px"
                              p="1.5rem"
                            >
                              <Checkbox
                                key={option.id}
                                value={option.id}
                                sx={{
                                  "&.chakra-checkbox": {
                                    borderColor: "gray.400",
                                  },
                                }}
                              >
                                {option.value}
                              </Checkbox>
                            </Box>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                  </>
                ) : (
                  <Text>Loading...</Text>
                )}
              </Box>

              <Box>
                <Footer
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                />
              </Box>
            </Box>

            <SideNavigation
              isSubmitting={loading}
              questionCount={totalQuestions}
              onQuestionClick={handleQuestionChange}
              onClick={() => setExamConfirm(true)}
              answers={answers}
              questions={questions}
              display={{ base: "none", md: "block" }} // Hide on mobile
            />
          </Flex>
        </>
      )}

      <ConfirmDialog
        open={examConfirm}
        title="Confirm Submission"
        description="Are you sure you want to submit the exam? Once submitted, you cannot change your answers."
        onClose={() => setExamConfirm(false)}
        onConfirm={handleSubmitAnswer}
        label="Ok"
        color="blue"
      />
    </>
  );
}

export default QuestionsPanel;
