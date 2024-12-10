import React from 'react';
import { Box, Text, VStack, Stack, Badge, Code, Divider } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function ErrorCard({ errorData }) {
  const { errorMsg } = errorData;

  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      p={4}
      shadow="md"
      bg="gray.50"
      margin="auto"
      overflowX="auto"
    >
      <VStack spacing={4} align="start" p={4} width="22vw">
        <Text fontSize={{ base: "sm", md: "md" }}>
          <Badge colorScheme="red">File Errors Overview</Badge>
        </Text>
       
        {errorMsg.errors && Object.entries(errorMsg.errors).length > 0 ? (
          Object.entries(errorMsg.errors).map(([key, errors]) => (
            <Box key={key} p={4} borderWidth={1} borderRadius="md" borderColor="red.500" bg="white" width="100%">
              <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                Row {key}
              </Text>
              <Divider my={2} />
              {Object.entries(errors).map(([field, { errorCode, errorMsg }]) => (
                <Stack key={field} spacing={1} mb={2}>
                  <Text fontSize={{ base: "xs", sm: "sm" }}>
                    <Code>{field}</Code>: {errorMsg}
                  </Text>
                  {/* <Text fontSize="xs" color="gray.500">
                    Error Code: {errorCode}
                  </Text> */}
                </Stack>
              ))}
            </Box>
          ))
        ) : (
          <Text fontSize={{ base: "xs", sm: "sm" }}>No errors found.</Text>
        )}

        <Divider my={4} />
     
        <Text fontSize={{ base: "xs", sm: "sm" }} color="red.500">
          Invalid Count: {errorMsg.invalidCount}
        </Text>
      </VStack>
    </Box>
  );
}

ErrorCard.propTypes = {
  errorData: PropTypes.shape({
    errorCode: PropTypes.string.isRequired,
    errorMsg: PropTypes.shape({
      errors: PropTypes.objectOf(
        PropTypes.objectOf(
          PropTypes.shape({
            errorCode: PropTypes.string.isRequired,
            errorMsg: PropTypes.string.isRequired
          }).isRequired
        ).isRequired
      ).isRequired,
      processedCount: PropTypes.number.isRequired,
      invalidCount: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default ErrorCard;