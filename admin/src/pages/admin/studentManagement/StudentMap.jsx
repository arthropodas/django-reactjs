import React, { useEffect, useState } from "react";
import { Box, Stack, RadioGroup, Radio, Flex } from "@chakra-ui/react";
import StudentAdd from "./StudentAdd"; // Import the StudentAdd component
import BulkStudentAdd from "./BulkStudentAdd";
import PropTypes from "prop-types";
function StudentMap({handleClose}) {
  const [selectedOption, setSelectedOption] = useState("individual");

  useEffect(() => {

  }, [selectedOption]);

  return (
    <>
    <Flex width="100%" justifyContent="center">
      <RadioGroup value={selectedOption} onChange={setSelectedOption}>
        <Stack direction="row" spacing={10}>
          <Radio value="individual">
            New Student
          </Radio>
          <Radio value="group">
            Bulk Upload
          </Radio>
        </Stack>
      </RadioGroup>
      </Flex>
    <Box>
      {selectedOption === "individual" && <StudentAdd handleClose={handleClose}/>}
      {selectedOption === "group" && <BulkStudentAdd handleClose={handleClose}/>}
      </Box>
      </>
  );
}

StudentMap.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default StudentMap;
