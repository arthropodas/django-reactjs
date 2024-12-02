import React from 'react';
import PropTypes from 'prop-types';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,

} from '@chakra-ui/react';
import SubmitButton from '../button/SubmitButton';
import { clickButtonHover, submitButtonColor } from '../../utils/Strings';

const ConfirmDialog = ({ open, title, description, onClose, onConfirm, okBoolean}) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={open}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent width="500px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          {!okBoolean && (
            <AlertDialogCloseButton onClick={onClose} />
          )}

          <AlertDialogBody>
            {description}
          </AlertDialogBody>

          <AlertDialogFooter>
            {!okBoolean && (
              <SubmitButton ref={cancelRef} onClick={onClose} label="Cancel"  _hover={{ bg: "red" }} colorScheme="red" />
            )}
            &nbsp;
            <SubmitButton onClick={onConfirm} bgColor={submitButtonColor}  _hover={{ bg: clickButtonHover }} title="confirm" label="Confirm" data-testid="confirm" />

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
