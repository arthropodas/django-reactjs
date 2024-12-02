import React from "react";
import PropTypes from 'prop-types';
import { Button, Flex, Box, Text } from "@chakra-ui/react";
import { FcPrevious, FcNext } from "react-icons/fc";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";

function CustomPagination({ currentPage, totalPages, handlePrevious, handleNext, setCurrentPage }) {

    const numPage = 1;

    function generatePageNumbers() {
        const pages = [];
        const showLeftEllipsis = currentPage > numPage + 2 && totalPages > 3;
        const showRightEllipsis = currentPage < totalPages - numPage - 1 && totalPages > 3;
        const startPage = Math.max(2, currentPage - numPage);
        const endPage = Math.min(totalPages - 1, currentPage + numPage);

        // Always show the first page
        pages.push(
            <Button
                style={{ fontWeight: currentPage === 1 ? 'bold' : 'normal' }}
                key={1}
                onClick={() => setCurrentPage(1)}
                isDisabled={currentPage === 1}
                mr={2}
            >
                1
            </Button>
        );

        if (showLeftEllipsis) {
            pages.push(
                <Button
                    key="leftEllipsis"
                    onClick={() => setCurrentPage(currentPage - numPage)}
                    mr={2}
                >
                    ...
                </Button>
            );
        }

        // Generate middle page buttons
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    style={{ fontWeight: i === currentPage ? 'bold' : 'normal' }}
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    isDisabled={i === currentPage}
                    mr={2}
                >
                    {i}
                </Button>
            );
        }

        if (showRightEllipsis) {
            pages.push(
                <Button
                    key="rightEllipsis"
                    onClick={() => setCurrentPage(currentPage + numPage)}
                    mr={2}
                >
                    ...
                </Button>
            );
        }

        if (totalPages > 1) {
            pages.push(
                <Button
                    style={{ fontWeight: currentPage === totalPages ? 'bold' : 'normal' }}
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    isDisabled={currentPage === totalPages}
                    mr={2}
                >
                    {totalPages}
                </Button>
            );
        }

        return pages;
    }

    if (totalPages < 1) {
        return null;
    }

    return (
        <Flex
            // position="fixed"
            bottom={0}
            left="100%"
            // transform="translateX(-20%)"
            width="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
            mb={4}
        >


            <Flex>
                <Button
                    onClick={() => setCurrentPage(1)}
                    isDisabled={currentPage === 1}
                    title='First'
                    mr={2}
                >
                    <LuChevronFirst />
                </Button>

                <Button
                    onClick={() => handlePrevious(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    title='Previous'
                    mr={2}
                >
                    <FcPrevious />
                </Button>

                {generatePageNumbers()}

                <Button
                    onClick={() => handleNext(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    title='Next'
                    ml={2}
                >
                    <FcNext />
                </Button>

                <Button
                    onClick={() => setCurrentPage(totalPages)}
                    isDisabled={currentPage === totalPages}
                    title='Last'
                    ml={2}
                >
                    <LuChevronLast />
                </Button>
            </Flex>
            <Box mt={1}>
                <Text>{"Page"}: {currentPage} of {totalPages}</Text>
            </Box>

        </Flex>
    );
}

CustomPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handlePrevious: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    setCurrentPage: PropTypes.func.isRequired
};

export default CustomPagination;
