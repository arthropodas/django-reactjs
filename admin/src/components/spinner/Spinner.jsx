import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Box } from '@chakra-ui/react';

const LoadingSpinner = ({ size, thickness, speed, color, centered, ...props }) => {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display={centered ? 'flex' : 'inline-flex'}
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(255, 255, 255, 0)" // Transparent background
      zIndex="1000" // Ensures it sits on top of other content
      {...props}
    >
      <Spinner
        size={size}
        thickness={thickness}
        speed={speed}
        color={color}
        data-testid="loading-spinner"
      />
    </Box>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  thickness: PropTypes.string,
  speed: PropTypes.string,
  color: PropTypes.string,
  centered: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  size: 'xl',
  thickness: '4px',
  speed: '0.65s',
  color: 'blue.500',
  centered: true,
};

export default LoadingSpinner;
