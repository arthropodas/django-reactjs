import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SidebarItems = ({ icon, label, path, onClick, isActive }) => {

  return (
    <HStack
      as={Link}
      to={path}
      onClick={onClick}  // Call onClick when an item is selected
      spacing={4}
      p={2}
      align="center"
      role="group"
      borderRadius="md"
      w="full"
      bg={isActive && 'red.500'}
    >
      <Box fontSize="24px" color={isActive ? 'white' : 'inherit'}>
        {icon}
      </Box>
      <Text fontSize="18px" color={isActive ? 'white' : 'inherit'}>
        {label}
      </Text>
    </HStack>
  );
};

SidebarItems.propTypes = {
  icon: PropTypes.node.isRequired,   
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

SidebarItems.defaultProps = {
  onClick: () => {},
  isActive: false,
};

export default SidebarItems;
