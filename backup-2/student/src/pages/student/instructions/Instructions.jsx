import React, { useEffect, useState } from 'react'
import {
    Flex,
    Text,
    Table,
    Tbody,
    Tr,
    Td
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import ClickButton from "../../../components/button/OnClickButton";
import useExamResponseStore from '../../../components/store/ResponseStore';

function Instructions() {
    const { clearAnswers } = useExamResponseStore();

    const navigate = useNavigate();
    // const [tokenFromUrl, setTokenFromUrl] = useState('');
    const token = localStorage.getItem("token");

    const handleStartTest = async () => {
        if (token) {
            navigate("/questions", { state: { token: token } });
        }
    };

    useEffect(() => {
        
        if (!token) {
            navigate('/error');
        }

        localStorage.removeItem("response-storage");
        clearAnswers();
     
    }, []);

    return (
        <Flex my="5rem" mx="8rem" p="2rem" bg="white" borderRadius="8px" flexDirection="column">
            <Text fontSize='3xl'>Instructions for the Assessment</Text>
            <Text fontSize='xl' color="red.500" mt="2rem">Please read the instructions carefully before starting the assessment.</Text>
            <Flex p="2rem" flexDirection="column">
                <span style={{ whiteSpace: 'nowrap' }}>1. Click <strong>"Start Assessment"</strong> at the bottom of your screen to begin the test.</span>
                2. You will not be able to minimize, resize, or switch tabs during the exam. If you do so, your exam will be terminated. <br />
                3. Before starting the exam, please increase your screen time and turn off all notifications. <br />
                4. The countdown timer will be displayed at the top-right corner of your screen, showing the remaining time to complete the exam. <br />
                5. Ensure a stable internet connection throughout the exam. <br />
                6. It is highly recommended to take the exam on a laptop or desktop. <br />
                7. Close all browsers/tabs before starting the online examination. <br />
                8. Candidates can change their responses to attempted answers at any time during the examination. <br />
                9. Click the Next button to save your answer and move to the next question. <br />
                10. Click the Previous button to move to the previous question. <br />
                11. To select a question, click on the question number on the right side of the screen. <br />
                12. The color coded diagram on the screen shows the status of the question. <br />
                <Table width="30%" ml="2rem" mt="1rem">
                    <Tbody>
                        <Tr>
                            <Td border="1px" borderColor="gray.400" bg="#1b8f1b" color="white">green</Td>
                            <Td border="1px" borderColor="gray.400">Answered/ Attempted questions</Td>
                        </Tr>
                        <Tr>
                            <Td border="1px" borderColor="gray.400" bg="red" color="white">red</Td>
                            <Td border="1px" borderColor="gray.400">Not answered/ Not Attempted questions</Td>
                        </Tr>
                    </Tbody>
                </Table> <br />
                13. All questions will be counted towards calculating the final score. <br />
                <span style={{ whiteSpace: 'wrap' }}>
                    14. Submit your test by clicking the <strong>"Finish & Submit"</strong> button when you have answered all the questions or when you are ready to finish. <br />
                </span>
                15. You cannot change your answers after submitting the test, so make sure you review all your responses before submission. <br />
                16. Any attempt to bypass these restrictions will result in disqualification or termination from the exam.
            </Flex>
            <center><ClickButton mt="2rem" label="Start Assessment" onClick={handleStartTest} /></center>
        </Flex>
    )
}

export default Instructions