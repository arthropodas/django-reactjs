import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import { darken } from '@chakra-ui/theme-tools';

function ClickButton({ label, colorScheme, onClick, bgColor, _hover, _active, icon, variant, disabled, ...props }) {

  const hoverColor = darken(bgColor, 8);
  const activeColor = darken(bgColor, 8);

  return (
    <Button
      type="button" // Changed from "submit" to "button" for general use; adjust if needed
      colorScheme={colorScheme}
      bg={bgColor}
      variant={variant}
      py="5px"
      _hover={{
        bg: hoverColor,
        ..._hover
      }}
      _active={{
        bg: activeColor,
        ..._active
      }}
      onClick={onClick} // Added onClick handler
      isDisabled={disabled}
      {...props}
    >
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>} {/* Render icon */}
      <Text fontSize={{ base: '10px', sm: '12px', md: '14px', lg: '16px' }}>
        {label}
      </Text>
    </Button>
  );
}

ClickButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  colorScheme: PropTypes.string,
  onClick: PropTypes.func, // Added onClick prop type
};

ClickButton.defaultProps = {
  colorScheme: 'green', // Default color scheme if none is provided
  onClick: () => { }, // Default no-op function if no onClick is provided
};

export default ClickButton;
