import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Box, FormLabel, Stack } from '@chakra-ui/react';

function CheckboxGroup({ label, options, value, onChange, colorScheme }) {
  const handleChange = (optionId) => {
    const updatedValues = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];

    onChange(updatedValues);
  };

  return (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      {options.length > 0 ? (
        <Stack spacing={4} direction="column" pl={9}>
          {options.map((option) => (
            <Checkbox
              key={option.id}
              value={option.id}
              isChecked={value.includes(option.id)}
              onChange={() => handleChange(option.id)}
              colorScheme={colorScheme}
            >
              {option.value}
            </Checkbox>
          ))}
        </Stack>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}

CheckboxGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  onChange: PropTypes.func.isRequired,
  colorScheme: PropTypes.string,
};

CheckboxGroup.defaultProps = {
  label: '',
  value: [],
  colorScheme: 'blue',
};

export default CheckboxGroup;
