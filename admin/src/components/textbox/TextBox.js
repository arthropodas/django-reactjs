import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

import {
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,Box,Text
} from "@chakra-ui/react";

const TextBox = ({
  field, // Field prop from Formik
  form: { errors, touched }, // Formik form props to handle errors and touched state
  type = "text", // Default type is text, can be overridden
  placeholder,
  icon, // The icon component to display inside the input
  isPasswordField=false,
  width,
  borderRadius,
  backgroundColor,
  boxShadow,
  label,
  ...props
}) => {


  const today = new Date().toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'

  if (type === "date") {
    return (
      <FormControl isInvalid={errors[field.name] && touched[field.name]}>
       <Text>Exam Date</Text>
       <Input
          type="date"
          placeholder={placeholder}
          {...field}
          {...props}
          min={today}
          _focus={{ boxShadow: "none" }}
          sx={{
            boxShadow: "1px 1px 1px #B09F9F",
            borderRadius: "8px",
            bg: backgroundColor || "white"
          }}
          width={width}
        />
        <Box position="absolute" left="0" width="100%">
          <FormErrorMessage>{errors[field.name]}</FormErrorMessage>
        </Box>
      </FormControl>
    );
  }
  // Render a time picker if the type is time
  if (type === "time") {
    return (
      <FormControl isInvalid={errors[field.name] && touched[field.name]}>
        <Text>Exam Time</Text>
        <Input
          type="time"
          placeholder={placeholder}
          {...field}
          {...props}
          _focus={{ boxShadow: "none" }}
          sx={{
            boxShadow: "1px 1px 1px #B09F9F",
            borderRadius: "8px",
            bg: backgroundColor || "white"
          }}
          width={width}
        />
        <Box position="absolute" left="0" width="100%">
          <FormErrorMessage>{errors[field.name]}</FormErrorMessage>
        </Box>
      </FormControl>
    );
  }


  return (
    <FormControl isInvalid={errors[field.name] && touched[field.name]}>
      <Text mb="2">{label}</Text>
      <InputGroup>
        <InputRightElement pointerEvents={!isPasswordField ? "auto" : "none"} width="4.5rem">
          {icon}
        </InputRightElement>
        <Input
          type={type}
          placeholder={placeholder}
          {...field}
          {...props}
          _focus={{ boxShadow: "none" }}
          sx={{
            // minW:"320px",
            boxShadow: "1px 1px 1px #B09F9F", // Drop shadow effect
            borderRadius: "8px",
            bg: "white"|{backgroundColor}
          }}
          width={width}
        />
      </InputGroup>
      <Box position="absolute" left="0" width="100%">
      <FormErrorMessage>{errors[field.name]}</FormErrorMessage>
      </Box>
    </FormControl>
  );
};
TextBox.propTypes = {
  field: PropTypes.object.isRequired, 
  form: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
  }).isRequired, 
  type: PropTypes.string, 
  placeholder: PropTypes.string,
  icon: PropTypes.element, 
  isPasswordField: PropTypes.bool, 
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  backgroundColor: PropTypes.string,
  boxShadow: PropTypes.string,
};

export default TextBox;