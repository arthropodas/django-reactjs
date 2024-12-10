import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import { darken } from '@chakra-ui/theme-tools';

function SubmitButton({ label, bgColor, colorScheme, width, height, ...props }) {

  const hoverColor = darken(bgColor, 8);

  return (
    <Button
      type="submit"
      colorScheme={colorScheme}   
      width={width || '150px'}   // Default width if not provided
      height={height || '40px'}  // Default height if not provided
      bg={bgColor}
      textColor="white"
      _hover={{ bg: hoverColor }}
      {...props}
    >
      {label}
    </Button>
  );
}

SubmitButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  colorScheme: PropTypes.string,
  bgColor: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bg: PropTypes.string,
  hover: PropTypes.string,
};

export default SubmitButton;
