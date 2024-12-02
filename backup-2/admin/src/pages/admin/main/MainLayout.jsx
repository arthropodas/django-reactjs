import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { Flex, Box } from "@chakra-ui/react";

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <Flex flex="1" direction="column">
      <Navbar onOpen={handleToggleSidebar} />
      <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
        <Sidebar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
        <Box ml={{ base: 0, md: isSidebarOpen ? "291px" : "290px" }} p={{base: "2rem", md: "4rem"}}
          as="main"
          flex="1"
          overflowY="auto"
          mt="70px"
          w={{ base: "full", md: "80vw" }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;
