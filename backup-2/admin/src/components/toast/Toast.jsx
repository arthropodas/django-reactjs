import React, { useEffect } from 'react';
import { useToast, Box, Text } from '@chakra-ui/react';
import { AiFillCheckCircle } from 'react-icons/ai'; // Correct import
import PropTypes from 'prop-types';
import { toastTime } from '../../utils/Strings';

const SuccessToast = ({ show, onClose, message }) => {
    const toast = useToast();

    useEffect(() => {
        if (show && !toast.isActive('success-toast')) { // Only trigger if not already active
            toast({
                id: 'success-toast', // Assign a unique ID to avoid multiple toasts
                position: "top",
                render: () => (
                    <Box
                        color="white"
                        title="toast"
                        data-testid="toast"
                        p={3}
                        bg="green.500"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        shadow="lg"
                    >
                        <AiFillCheckCircle size="20px" color="white" style={{ marginRight: '8px' }} />
                        <Text fontWeight="bold">Success!</Text>
                        <Text ml={2}>{message}</Text>
                    </Box>
                ),
                duration: toastTime, // Auto close after 3 seconds
                isClosable: true,
                onCloseComplete: onClose,
            });
        }
    }, [show, toast, message, onClose]);
    
    
    
    

    return null;
};

SuccessToast.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default SuccessToast;