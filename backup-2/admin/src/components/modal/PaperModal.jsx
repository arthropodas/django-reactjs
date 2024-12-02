import React from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function PaperModal({ open, onClose, children, handleClose, width, height }) {
  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        p="5"
        maxWidth={width ? width : { base: "100vw", md: "30vw" }}  // Use width prop if passed, otherwise default
        height={height ? height : "auto"}  // Use height prop if passed, otherwise default to "auto"
      >
        <ModalCloseButton title="close" />
        {children}
      </ModalContent>
    </Modal>
  );
}

PaperModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),  // Optional width prop
  height: PropTypes.string,  // Optional height prop
};

export default PaperModal;
