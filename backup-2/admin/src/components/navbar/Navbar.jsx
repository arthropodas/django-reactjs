import React, { useEffect, useState} from "react";
import { Flex, Spacer, Text, IconButton,Avatar,HStack } from "@chakra-ui/react";
import { appName } from "../../utils/Strings";
import { HamburgerIcon } from "@chakra-ui/icons";


const Navbar = ({ onOpen }) => {
  const [adminName, setAdminName] = useState('')
  const [profile,setProfile]=useState('')
  useEffect(() =>{
    const givenName =localStorage.getItem('name')
    const profile =localStorage.getItem('profile')
setAdminName(givenName)
setProfile(profile)
  },[])
 
  return (
    <Flex
      as="nav"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="8vh"
      align="center"
      justify="flex-end"
      bg="white"
      p="1rem"
      zIndex="10"
      boxShadow="sm"
    >
      <IconButton
        icon={<HamburgerIcon />}
        variant="outline"
        colorScheme="blue"
        aria-label="Open Sidebar"
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
      />

      <Text
        fontFamily="fangsong"
        fontSize={{base: "20px", md: "25px"}}
        fontWeight="bold"
        textAlign="center"
        color="#0F2273"
      >
        {appName}
      </Text>
      <Spacer />

      <Flex >  <HStack gap="4"> <Text  fontWeight="bold"
        textAlign="center"
        color="#0F2273" fontSize="lg" >
        {adminName}
      </Text>
      
      <Avatar size="md" src={profile} name={adminName} />
      </HStack></Flex>
    </Flex>
  );
};

export default Navbar;
