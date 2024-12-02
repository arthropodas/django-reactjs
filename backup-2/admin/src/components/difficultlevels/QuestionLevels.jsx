// QuestionLevels.js
import React, { useState, useEffect } from "react";
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Input,
  HStack,
  Text
} from "@chakra-ui/react";

function QuestionLevels({ onLevelChange }) {
  const [hardLevelValues, setHardLevelValues] = useState([0, 30]);
  const [mediumLevelValues, setMediumLevelValues] = useState([0, 50]);
  const [easyLevelValues, setEasyLevelValues] = useState([0, 50]);

  useEffect(() => {
    onLevelChange({
      hard: hardLevelValues[1],
      medium: mediumLevelValues[1],
      easy: easyLevelValues[1],
    });
  }, [hardLevelValues, mediumLevelValues, easyLevelValues, onLevelChange]);

  // Handle slider change for Hard level
  const handleHardLevelChange = (values) => {
    setHardLevelValues([0, values[1]]);
  };

  // Handle slider change for Medium level
  const handleMediumLevelChange = (values) => {
    setMediumLevelValues([0, values[1]]);
  };

  // Handle slider change for Easy level
  const handleEasyLevelChange = (values) => {
    setEasyLevelValues([0, values[1]]);
  };

  // Handle input change for Hard level max value
  const handleHardLevelInputChange = (event) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setHardLevelValues([0, newValue]);
    }
  };

  // Handle input change for Medium level max value
  const handleMediumLevelInputChange = (event) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setMediumLevelValues([0, newValue]);
    }
  };

  // Handle input change for Easy level max value
  const handleEasyLevelInputChange = (event) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setEasyLevelValues([0, newValue]);
    }
  };

  return (
    <Box p={5} width="100%">
      {/* Hard Level Slider */}
      <HStack spacing={4}>
        <Box width="50%">
          <Text>Hard level</Text>
        </Box>
        <RangeSlider
          colorScheme="blue"
          value={hardLevelValues}
          onChange={handleHardLevelChange}
          min={0}
          max={100}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} isDisabled />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Box>
          <Input
            value={hardLevelValues[1]}
            onChange={handleHardLevelInputChange}
            placeholder="Max Value"
            mt={2}
          />
        </Box>
      </HStack>

      {/* Medium Level Slider */}
      <HStack spacing={4}>
        <Box width="50%">
          <Text>Medium level</Text>
        </Box>
        <RangeSlider
          colorScheme="blue"
          value={mediumLevelValues}
          onChange={handleMediumLevelChange}
          min={0}
          max={100}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} isDisabled />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Box>
          <Input
            value={mediumLevelValues[1]}
            onChange={handleMediumLevelInputChange}
            placeholder="Max Value"
            mt={2}
          />
        </Box>
      </HStack>
      
      {/* Easy Level Slider */}
      <HStack spacing={4}>
        <Box width="50%">
          <Text>Easy level</Text>
        </Box>
        <RangeSlider
          colorScheme="blue"
          value={easyLevelValues}
          onChange={handleEasyLevelChange}
          min={0}
          max={100}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} isDisabled />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Box>
          <Input
            value={easyLevelValues[1]}
            onChange={handleEasyLevelInputChange}
            placeholder="Max Value"
            mt={2}
          />
        </Box>
      </HStack>
    </Box>
  );
}

export default QuestionLevels;
