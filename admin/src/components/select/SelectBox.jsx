import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Input,
  Button,
  List,
  ListItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Tooltip,
  useDisclosure,
  
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';  // Import the ChevronDownIcon

const SearchableDropdown = ({ options, placeholder, onSelect, width, testId, isReadOnly, disableTooltip }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const filteredOptions = options.filter(option =>
    option.value?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option.value);
    setSearchTerm('');
    onSelect(option);
    onClose();
  };

  return (
    <Popover isOpen={isOpen && !isReadOnly} onClose={onClose} placement="bottom-start" bg="white">
      <PopoverTrigger>
        <Button
          data-testId={testId}
          color={isReadOnly ? "grey" : "black"}
          onClick={isReadOnly ? undefined : onOpen}
          variant="outline"
          width={width || '20rem'}
          bg="white"
          justifyContent="space-between" // To space out the content (selected option and icon)
          textAlign="left"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          title={selectedOption || placeholder}
          style={{ cursor: isReadOnly ? 'not-allowed' : 'pointer' }}
        >
          {selectedOption || placeholder}
          <ChevronDownIcon ml={2} /> {/* Add the dropdown icon */}
        </Button>
      </PopoverTrigger>
      {!isReadOnly && (
        <PopoverContent width={width || '20rem'} bg="white">
          <PopoverArrow />
          <Box p={2} color="black" bg="white" width="100%">
            <Input
              placeholder='Search..'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb={2}
            />
            <Box maxHeight="200px" overflowY="auto">
              <List spacing={1}>
                <ListItem
                  p={2}
                  fontWeight="bold"
                  color="black"
                  cursor="pointer"
                  onClick={() => handleSelect({ id: '' })}
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  textAlign="left"
                  maxWidth="180px"
                >
                  {placeholder}
                </ListItem>
                {filteredOptions.length ? (
                  filteredOptions.map((option) => (
                    disableTooltip ? (
                      <ListItem
                        key={option.id}
                        p={2}
                        cursor="pointer"
                        onClick={() => handleSelect(option)}
                        _hover={{ bg: 'gray.100' }}
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        textAlign="left"
                        overflow="hidden"
                        maxWidth="180px"
                      >
                        {option.value}
                      </ListItem>
                    ) : (
                      <Tooltip 
                        key={option.id}
                        label={option.tooltip || option.value}
                        hasArrow
                        placement="top"
                        bg="gray.700"
                      >
                        <ListItem
                          p={2}
                          cursor="pointer"
                          onClick={() => handleSelect(option)}
                          _hover={{ bg: 'gray.100' }}
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                          overflow="hidden"
                          textAlign="left"
                          maxWidth="180px"
                        >
                          {option.value}
                        </ListItem>
                      </Tooltip>
                    )
                  ))
                ) : (
                  <ListItem p={2} textAlign="center" color="gray.500">
                    No options found
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        </PopoverContent>
      )}
    </Popover>
  );
};

SearchableDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      tooltip: PropTypes.string,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  width: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  testId: PropTypes.string,
  isReadOnly: PropTypes.bool,
  disableTooltip: PropTypes.bool,
};

SearchableDropdown.defaultProps = {
  placeholder: 'Select',
  isReadOnly: false,
  disableTooltip: false,
};

export default SearchableDropdown;
