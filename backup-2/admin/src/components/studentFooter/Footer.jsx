import React from 'react';
import {
    Button,
    Stack,
    Spacer
} from "@chakra-ui/react";
import {
    ArrowBackIcon,
    ArrowForwardIcon
} from "@chakra-ui/icons";

const Footer = ({ onPrevious, onNext, currentQuestionIndex, totalQuestions }) => {
    return (
        <Stack direction='row' spacing={4} mt="3rem">
            <Button
                leftIcon={<ArrowBackIcon />}
                bg="#04AA6D"
                _hover={{ bg: "#038D59" }}
                color="white"
                variant="solid"
                onClick={onPrevious}
                isDisabled={currentQuestionIndex === 0}
            >
                Previous
            </Button>
            <Spacer />
            <Button
                rightIcon={<ArrowForwardIcon />}
                bg="#04AA6D"
                _hover={{ bg: "#038D59" }}
                color="white"
                variant="solid"
                onClick={onNext}
                isDisabled={currentQuestionIndex === totalQuestions-1}
            >
                Next
            </Button>
        </Stack>
    );
}

export default Footer;
