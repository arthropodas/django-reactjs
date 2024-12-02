import React from 'react'
import {Flex,Text, Image} from "@chakra-ui/react";
import { appName } from '../../utils/Strings';
import logo from "../../assets/innov_logo.png";
function Header() {
  return (
    <Flex
        justify="space-between"
        align="center"
        px={{ base: "4", md: "10" }}
        py="4"
        direction={{ base: "column", md: "row" }}
      >
        <Text
          as="b"
          fontSize={{ base: "40px", md: "20px", lg: "40px" }}
          color="#181E3E"
        >
          {appName}
        </Text>
        <Flex align="center" pt={{ base: "4", md: "0" }}>
          <Image
            src={logo}
            alt="logo"
            w={{ base: "30vw", md: "10vw" }}
            h={{ base: "5vh", md: "5vh" }}
          />
        </Flex>
      </Flex>

  )
}

export default Header