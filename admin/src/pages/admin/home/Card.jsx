import React from 'react';
import { 
    Text,
    VStack,
    Flex,
    Box
} from '@chakra-ui/react';
import { dashboardColor, sidebarColor } from '../../../utils/Strings';

const CardItem = ({ icon, label, count }) => {
    return (
        <Box bg={dashboardColor} p="1.5rem" _hover={{ outline: "2px solid #91C7F8" }} height="18vh" width="100%" alignContent="center">
            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap="1rem" wrap="wrap">
                <Flex bg="#3b4891" p="1rem" borderRadius="4px" verticalAlign="center">
                    {icon}
                </Flex>
                <VStack align="start" gap="0.2rem" spacing={0} flex="1" verticalAlign="center">
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