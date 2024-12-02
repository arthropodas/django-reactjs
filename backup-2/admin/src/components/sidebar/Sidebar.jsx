import React, { useEffect, useRef } from "react";
import {
  Box,
  VStack,
} from '@chakra-ui/react';
import SidebarItems from './SidebarItems';
import { IoMdHome } from "react-icons/io";
import { IoNewspaperOutline } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { BsBuildingFillAdd, BsFillQuestionSquareFill } from "react-icons/bs";
import { PiExamFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { MdFeedback, MdOutlineLogout } from "react-icons/md";
import { sidebarColor } from '../../utils/Strings';
import PropTypes from "prop-types";

const Sidebar = ({ isOpen, onClose }) => {
  const activePathRef = useRef('');

  const handleLogout = () => {
    activePathRef.current = '';
    localStorage.clear();
    window.location.replace('/');
  };

  const handleItemClick = (path) => {
    activePathRef.current = path;
    onClose();
  };

  const isActive = (path) => activePathRef.current === path;

  return (
    <Box
      pos="fixed"
      left={0}
      top={{ base: "8vh", md: "8vh" }}
      minW={{ base: 'full', md: '15vw' }}
      minH={{ base: "100vh", md: "92vh" }}
      bg={sidebarColor}
      color="white"
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      p={4}
      boxShadow="md"
      zIndex="100"
    >
      <VStack align="start" pl="0rem" pt="3rem" flex="1">
        <SidebarItems
          icon={<IoMdHome />}
          label="Home"
          path=''
          isActive={isActive('')}
          onClick={() => handleItemClick('')}
        />
        <SidebarItems
          icon={<BiSolidCategory />}
          label="Sections"
          path='questionCategoryList'
          isActive={isActive('questionCategoryList')}
          onClick={() => handleItemClick('questionCategoryList')}
        />
        <SidebarItems
          icon={<BsFillQuestionSquareFill />}
          label="Question Bank"
          path='questions'
          isActive={isActive('questions')}
          onClick={() => handleItemClick('questions')}
        />
        <SidebarItems
          icon={<BsBuildingFillAdd />}
          label="Institution"
          path='institutionsList'
          isActive={isActive('institutionsList')}
          onClick={() => handleItemClick('institutionsList')}
        />
        <SidebarItems
          icon={<IoNewspaperOutline />}
          label="Questionnaire"
          path='questionnaireList'
          isActive={isActive('questionnaireList')}
          onClick={() => handleItemClick('questionnaireList')}
        />
        <SidebarItems
          icon={<PiExamFill />}
          label="Exam"
          path='examsList'
          isActive={isActive('examsList')}
          onClick={() => handleItemClick('examsList')}
        />
        <SidebarItems
          icon={<FaUsers />}
          label="Students"
          path='students'
          isActive={isActive('students')}
          onClick={() => handleItemClick('students')}
        />
        <SidebarItems
          icon={<MdFeedback />}
          label="Feedbacks"
          path='feedback'
          isActive={isActive('feedback')}
          onClick={() => handleItemClick('feedback')}
        />
      </VStack>

      <Box sx={{
        position: "fixed",
        bottom: 0,
      }}>
        <SidebarItems
          icon={<MdOutlineLogout />}
          label="Logout"
          onClick={handleLogout}
          isActive={false}
        />
      </Box>
    </Box>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default Sidebar;