import React from 'react';
import {
    Alert,
    AlertIcon,
    AlertDescription,
    Box,
    CloseButton
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const AlertBox = ({ message, onClose, width }) => {
    return (
        <Alert status='error'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            borderRadius='md'
            title='errorMessage'
            data-testId='errorMessage'
            padding={2}
            maxWidth='400px'
            width={width || 'auto'}
            mx='auto'
            mb="1.5rem"
        >
            <Box flex='1' textAlign='center' display='flex' flexDirection="row">
                <AlertIcon />
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Box>
            <CloseButton
                data-testId='close'
                title="close"
                alignSelf='flex-end'
                onClick={onClose}
            />
        </Alert>
    );
};


AlertBox.propTypes = {
    message: PropTypes.string.isRequired,  // Ensures message is a required string
    onClose: PropTypes.func.isRequired,    // Ensures onClose is a required function
};
export default AlertBox;