import React from 'react';
import { 
    Text,
    VStack,
    Flex,
    Box
} from '@chakra-ui/react';
import { sidebarColor } from '../../../utils/Strings';

const CardItem = ({ icon, label, count }) => {
    return (
        <Box bg="white" borderRadius="8px" p="1.5rem" _hover={{ outline: "2px solid #91C7F8" }}>
            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap="1rem" wrap="wrap">
                <Flex bg="#3b4891" p="1rem" borderRadius="4px">
                    {icon}
                </Flex>
                <VStack align="start" gap="0.2rem" spacing={0} flex="1" >
                    <Text fontWeight="bold" color="#6f7c80" mb="0.1rem">
                        {label}
                    </Text>
                    <Text color="#47515c" fontSize="30px" m="0.3rem">
                        {count}
                    </Text>
                </VStack>
            </Flex>
        </Box>
    )
}

export default CardItem