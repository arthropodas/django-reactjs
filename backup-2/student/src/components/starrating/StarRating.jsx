import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdOutlineStarBorder } from "react-icons/md";

import { HStack, Box } from "@chakra-ui/react";

export default function StarRating({ rating, setRating, count, size }) {
  const [hover, setHover] = useState(null);
  console.log("raaaaa",rating);
  
  return (
    <HStack spacing={"2px"}>
      {[...Array(count || 5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <Box
            as="span"
            key={index}
            color={ratingValue <= (hover || rating) ? "#ffc107" : "#9a9a9b"}
            onClick={() => setRating(ratingValue)} // Handle click directly on the star
            onMouseEnter={() => setHover(ratingValue)} // Handle hover state
            onMouseLeave={() => setHover(null)} // Reset hover state
            cursor={"pointer"}
            transition="color 200ms"
          >
            <MdOutlineStarBorder size={size || 20} />
          </Box>
        );
      })}
    </HStack>
  );
}
