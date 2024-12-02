import React from 'react';
import {
    Flex,
    Image,
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import logo from "../../assets/innov_logo.png";

const StudentNav = () => {
    return (
        <>
            <Flex as="nav" align="center" justify="flex-start" bg="white" pl="3rem" py="1rem">
                <Image src={logo} alt="Innovature logo" />
            </Flex>
            <Outlet />
        </>
    );
}

export default StudentNav