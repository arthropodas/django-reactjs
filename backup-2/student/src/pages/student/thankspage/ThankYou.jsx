import React, { useEffect, useState } from "react";
import { Flex, Text, Image } from "@chakra-ui/react";
import PaperModal from "../../../components/modal/PaperModal";
import StudentFeedback from "../studentfeedback/StudentFeedback";
import thanks from "../../../assets/thanks.png";
function ThankYou() {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(true);

  const handleFeedbackCloseModal = () => {
    setOpenFeedbackModal(false);
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setOpenFeedbackModal(false);
    }
  });

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="70vh"
      >
        <Text fontSize="5xl" as="b" textAlign="center">
          Thank You!
        </Text>
        <Image
          sx={
            { objectFit: 'contain' }
          }
          src={thanks}
          alt="exam submission"
          w={{ base: "45vw", md: "45vw" }}
          h={{ base: "50vh", md: "50vh" }}
        />
        <Text
          fontSize={{ base: "md", sm: "lg", md: "2xl", lg: "3xl", xl: "4xl" }}
          textAlign="center"
        >
          Your responses have been submitted successfully!!!
        </Text>
      </Flex>

      <PaperModal
        open={openFeedbackModal}
        handleClose={handleFeedbackCloseModal}
        showCloseButton={false}
      >
        <StudentFeedback handleClose={handleFeedbackCloseModal} />
      </PaperModal>
    </>
  );
}

export default ThankYou;
