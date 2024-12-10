import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
 Box,
 Text,
 VStack,
 Stack,
 Divider,
 Spacer,
 Heading,
 Flex,
 Image,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { TiTick, TiTimes } from "react-icons/ti";
import html2pdf from "html2pdf.js"; // Import html2pdf library
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import AlertBox from "../../../components/alert/Alert";
import { SummaryReportErrorCodes } from "./SummaryReportErrorCodes";
import { clickButtonColor } from "../../../utils/Strings";
import { IoChevronBack } from "react-icons/io5";
import ClickButton from "../../../components/button/OnClickButton";


function SummaryReport() {
 const [questions, setQuestions] = useState([]);
 const [loading, setLoading] = useState(true);
 const [errorMessage, setErrorMessage] = useState("");
 const [studentDetails, setStudentDetails] = useState({});
 const [batchDetails, setBatchDetails] = useState({});
 const [examDetails, setExamDetails] = useState({});

 const navigate = useNavigate();
 const { studentId, id: batchId } = useParams();


 // Reference to the entire content that will be downloaded
 const reportRef = useRef();


 const [questionCount, setQuestionCount] = useState(0);

 const fetchDetails = async () => {
   try {
     const response = await adminServices.adminStudentResponseSummary(
       studentId,
       batchId
     );
     let fetchedQuestions = response.data.question_bank;
     const questionCount = fetchedQuestions.length; // count of questions

     setQuestionCount(questionCount);
     let fetchedStudents = response.data.student_details;
     let fetchedBatchDetails = response.data.batch_details;

     setStudentDetails(fetchedStudents);
     setBatchDetails(fetchedBatchDetails);
     setExamDetails(response.data.exam_details);

     fetchedQuestions = fetchedQuestions.map((question) => {
       const { options, correct_answer } = question;
       correct_answer.forEach((ans) => {
         if (!options.includes(ans)) {
           options.push(ans);
         }
       });
       return { ...question, options };
     });


     setQuestions(fetchedQuestions);
     setLoading(false);
   } catch (error) {
     setErrorMessage(SummaryReportErrorCodes(error?.response?.data?.errorCode));
     setLoading(false);
   }
 };

 const handleGoBack = () => {
   navigate(-1); // This will go back to the previous page
 };

 useEffect(() => {
   fetchDetails();
 }, []);


 const downloadPDF = () => {
   const element = reportRef.current; // get the content by reference
   const opt = {
     margin: 0.4,
     filename: `${studentDetails.student_name || "SummaryReport"}.pdf`,
     image: { type: "jpeg", quality: 0.98 },
     html2canvas: { scale: 3, useCORS: true },
     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
     pagebreak: { mode: 'avoid-all' }
   };


   // converting HTML to PDF
   html2pdf().from(element).set(opt).save();
 };


 return (
   <>
     {errorMessage && (
       <Box textAlign="center" mb={4} width="500px" minH="75px">
         <AlertBox
           message={errorMessage}
           onClose={() => {
             setErrorMessage("");
           }}
         />
       </Box>
     )}
     {loading ? (
       <LoadingSpinner />
     ) : (
       <>
         {/* Button to trigger download */}
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
         <Flex justifyContent="flex-end" mb="4">
           <Box
             display="flex"
             bg="blue.500"
             height="auto"
             p="2"
             borderRadius="5px"
             alignItems="center"
             cursor="pointer"
             _hover={{ bg: "blue.600" }}
             onClick={downloadPDF}
           >
             <Text fontSize="16" color="white">
               Download Report
             </Text>
             &nbsp;&nbsp;
             <FiDownload size="18" color="white" />
           </Box>
         </Flex>


         <Box
           p="10"
           width={{ base: "100%", md: "100%" }}
           bg="white"
           boxShadow="lg"
           borderRadius="md"
           mb="1"
           ref={reportRef}
         >
           {/* Student and Exam details section */}
           <Flex>
             <Box>
               <Heading>{studentDetails.student_name}</Heading>
               <Text as="i">{studentDetails.student_email}</Text>
             </Box>
             <Spacer />
           </Flex>
           <Divider mt="5" />
           <Flex mt="4" alignItems="center">
             <Heading as="h3" size="lg" wordBreak="break-word">
               {examDetails.exam_name}
             </Heading>
             <Spacer />
             <Text fontSize="2xl" wordBreak="break-word">{batchDetails.batch_name}</Text>
           </Flex>
           <Divider mt="5" />
           <Flex mt="5">
            {examDetails.category_wise_mark.map((category) => (
                <Box key={category.category_id} mb="4">
                  <Text fontSize="24" fontWeight="bold" mr="5" color="green">
                    {category.category_name}: {category.total_correct_answer_count}
                  </Text>
                </Box>
              ))}
             <Spacer />

            <Text color="red" fontSize="24" fontWeight="bold">Total mark: {examDetails.total_mark} / {questionCount}</Text>

           </Flex>
           <Divider mt="5" />
           <Text fontSize="2xl" mt="5" color="blue.500" textAlign="center" fontWeight="bold">
             Status:{" "}
             {studentDetails.student_status ===
             "exam completed for the student"
             ? "Exam Completed"
             :"Shortlisted"}
           </Text>


           {/* Questions section */}
           <Box mt="10">
             <VStack align="start" mb="6" spacing={6}>
               <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                 Questions
               </Text>


               {questions.map((question, index) => {
                 // determine if there's at least one wrong answer but not all are wrong
                 const hasSomeIncorrect = question.student_response.some(
                   (response) => !question.correct_answer.includes(response)
                 );
                 const hasSomeCorrect = question.student_response.some(
                   (response) => question.correct_answer.includes(response)
                 );
                 const atLeastOneWrong = hasSomeIncorrect && hasSomeCorrect;
                 // Determine if the student selected all correct answers
                 // const hasSomeCorrect = question.student_response.some(response =>
                 //   question.correct_answer.includes(response)
                 // );


                 // Check if the student selected only one correct answer when multiple exist
                 const correctCount = question.correct_answer.filter(answer =>
                   question.student_response.includes(answer)
                 ).length;


                 const studentDidNotSelectAllCorrect = question.correct_answer.length > 1 &&
                                                       correctCount < question.correct_answer.length;


                 return (
                   <Box key={question.question_id} width="100%">
                     <Text fontSize="md" fontWeight="bold" mb="2">
                       {index + 1}. {question.question}
                     </Text>
                     {question.question_image && (
                       <Image
                         src={question.question_image}
                         alt={`Question ${index + 1} image`}
                         mt="2"
                         maxH="200px"
                         objectFit="contain"
                         width="100%"
                         mb={2}
                       />
                     )}
                     <Stack spacing={2} pl="4">
                       {question.options.map((option) => {
                         const isCorrect =question.correct_answer.includes(option);
                         const isSelected = question.student_response.includes(option);


                         let borderColor = "gray.200";
                         let bgColor = "gray.50";
                         let IconComponent = null;


                         if (isCorrect && isSelected) {
                           borderColor = "green.400";
                           bgColor = "green.50";
                           IconComponent = <TiTick color="green" size="28" />;
                         } else if (!isCorrect && isSelected) {
                           borderColor = "red.400";
                           bgColor = "red.50";
                           IconComponent = <TiTimes color="red" size="20" />;
                         }


                         return (
                           <Flex
                             key={option}
                             p="2"
                             borderRadius="md"
                             border="1px solid"
                             borderColor={borderColor}
                             bg={bgColor}
                             alignItems="center"
                           >
                             <Text flex="1">{option}</Text>
                             {IconComponent && <Box ml="2">{IconComponent}</Box>}
                           </Flex>
                         );
                       })}
                       {question.student_response.length === 0 && (
                         <Text color="orange.500" mt={2}>Student not attempted the question</Text>
                       )}
                       {/* {question.student_response.length > 0 && atLeastOneWrong && (
                         <Text color="orange.500" mt={2}>Student didn't select all the correct answers</Text>
                       )} */}
                        {/* Use this condition to display the appropriate message */}
                       {((question.student_response.length > 0 && studentDidNotSelectAllCorrect)|| (question.student_response.length > 0 && atLeastOneWrong))&& (
                         <Text color="orange.500" mt={2}>Student didn't select all the correct answers</Text>
                       )}
                     </Stack>
                     <Divider mt="4" />
                   </Box>
                 );
               })}
             </VStack>
           </Box>
         </Box>
       </>
     )}
   </>
 );
}


export default SummaryReport;
