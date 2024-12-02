import React from "react";
import { Box, Text } from "@chakra-ui/react";
function PageNotFound() {
  return (
    <Box align="center" p="20px">
      <Text fontSize="6xl" color="black">
        404
      </Text>
      <Text fontSize="5xl" color="black" as="b">
        Page Not Found
      </Text>
    </Box>
  );
}

export default PageNotFound;
