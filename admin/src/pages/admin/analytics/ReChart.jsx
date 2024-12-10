import React, { useState, useEffect } from "react";
import { Box, HStack, Text, Spacer, Divider } from "@chakra-ui/react";
import { adminServices } from "../../../services/AdminServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./ReChart.css";
import { dashboardColor } from "../../../utils/Strings";
import AlertBox from "../../../components/alert/Alert";
const ReChart = () => {
  const today = new Date();
  const graph_min_date = new Date("1970");

  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
  );
  const [endDate, setEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [currentData, setCurrentData] = useState([]);
  const [prevYearData, setPrevYearData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBarGraphData = () => {
    const formattedStartDate = startDate.toLocaleDateString("en-CA");
    const formattedEndDate = endDate.toLocaleDateString("en-CA");

    const prevStartDate = new Date(startDate);
    prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);

    const prevEndDate = new Date(endDate);
    prevEndDate.setFullYear(prevEndDate.getFullYear() - 1);

    const formattedPrevStartDate = prevStartDate.toLocaleDateString("en-CA");
    const formattedPrevEndDate = prevEndDate.toLocaleDateString("en-CA");

    // Fetch data for both current and previous year
    Promise.all([
      adminServices.adminBarGraph(formattedStartDate, formattedEndDate),
      adminServices.adminBarGraph(formattedPrevStartDate, formattedPrevEndDate),
    ])
      .then(([currentDataResponse, prevYearDataResponse]) => {
        setCurrentData(currentDataResponse.data.student_institution_graph);
        setPrevYearData(prevYearDataResponse.data.student_institution_graph);
      })
      .catch((error) => {
        setErrorMessage("Error fetching the data", error);
      });
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchBarGraphData();
    }
  }, [startDate, endDate]);

  // Transform data for grouped BarChart
  const prevYearDataMap = prevYearData.reduce((acc, item) => {
    acc[item.collegeName] = item.numberOfShortlistedStudents;
    return acc;
  }, {});

  const currentYearTotalShortlistedStudent = currentData.reduce(
    (total, college) => {
      return total + college.numberOfShortlistedStudents;
    },
    0
  );

  const previousYearTotalShortlistedStudent = prevYearData.reduce(
    (total, college) => {
      return total + college.numberOfShortlistedStudents;
    },
    0
  );

  //calculating college visit variation than the previous year
  // const collegeVisitVariation=((currentData.length-prevYearData.length)/prevYearData.length)*100;
  const collegeVisitVariation =
    prevYearData.length > 0 && currentData.length > 0
      ? ((currentData.length - prevYearData.length) / prevYearData.length) * 100
      : null; // Return null or any fallback value if prevYearData is empty

  //calculating the shortlisted student variation
  const shortlistedStudentsVariation =
    previousYearTotalShortlistedStudent > 0 &&
    currentYearTotalShortlistedStudent > 0
      ? ((currentYearTotalShortlistedStudent -
          previousYearTotalShortlistedStudent) /
          previousYearTotalShortlistedStudent) *
        100
      : null;

  const chartData = currentData.map((item) => ({
    collegeName: item.collegeName,
    currentYear: item.numberOfShortlistedStudents,
    prevYear: prevYearDataMap[item.collegeName] || 0, // Use 0 if no matching college in prevYearData
  }));

  // Include colleges that are only in prevYearData
  prevYearData.forEach((item) => {
    if (!chartData.find((data) => data.collegeName === item.collegeName)) {
      chartData.push({
        collegeName: item.collegeName,
        currentYear: 0, // No data for current year
        prevYear: item.numberOfShortlistedStudents,
      });
    }
  });

  return (
    // <>
      
      <Box width="80%" height="700px" bg={dashboardColor}>
      {errorMessage && (
        <Box textAlign="center" mt={4}>
          <AlertBox
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </Box>
      )}
        <HStack p={5}>
          <Box>
            <Text as="b" fontSize="24px">
              Yearwise Data
            </Text>
          </Box>
          <Spacer />
          <HStack>
            <Box mr={5}>
              <Text>Start Date</Text>
              <DatePicker
                data-testid="weekinput"
                style={{ borderColor: "none" }}
                className="input"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                locale="en-GB"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={today}
                minDate={graph_min_date}
              />
            </Box>
            <Box>
              <Text>End Date</Text>
              <DatePicker
                data-testid="weekinput"
                style={{ borderColor: "none" }}
                className="input"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                locale="en-GB"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={today}
                minDate={graph_min_date}
              />
            </Box>
          </HStack>
        </HStack>
        <Divider borderColor="gray.400" />
        <HStack p={2} justifyContent="left">
          <Box
            width="30%"
            height="100px"
            alignContent="center"
            textAlign="center"
          >
            <Text fontSize="17px">Shortlisted Students</Text>
            <Text as="b" fontSize="26px" color="#198754">
              {currentYearTotalShortlistedStudent}
            </Text>
          </Box>
          <Box
            width="30%"
            height="100px"
            alignContent="center"
            textAlign="center"
          >
            <Text fontSize="17px">Shortlist Variation(%)</Text>
            <Text as="b" fontSize="26px" color="#3862b7">
              {shortlistedStudentsVariation !== null
                ? `${shortlistedStudentsVariation.toFixed(2)}%`
                : "0"}
            </Text>
          </Box>
          <Box
            width="30%"
            height="100px"
            alignContent="center"
            textAlign="center"
          >
            <Text fontSize="17px">College Visit Progression(%)</Text>
            <Text as="b" fontSize="26px" color="#fd7e14">
              {collegeVisitVariation !== null
                ? `${collegeVisitVariation.toFixed(2)}%`
                : "0"}
            </Text>
          </Box>
        </HStack>
        
        <Box>
        {currentData.length === 0 && prevYearData.length === 0 && !errorMessage ? (
        <Text textAlign="center" p={5} fontSize={20} color="red">
          No data available...
        </Text>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 30, left: 25, bottom: 40 }}
            >
              <XAxis dataKey="collegeName"
              tick={{
                textAnchor: "end",
                angle: -25, // Rotate labels for better visibility
                fontSize: 14, // Adjust font size for readability
              }}
              interval={0} // Ensure every label is shown
              tickFormatter={(name) => name.length > 10 ? `${name.substring(0, 15)}...` : name}
              />
              <YAxis />
              <Tooltip />
              <Legend
                layout="vertical"
                verticalAlign="top"
                iconType="circle" // Customize the icon type (circle, square, line)
                wrapperStyle={{
                  paddingTop: "0px",
                  paddingBottom: "40px",
                  left: "55px",
                }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="currentYear"
                fill="#3862b7"
                name="Current Year - Number of Shortlisted Students"
                barSize={30}
              />
              <Bar
                dataKey="prevYear"
                fill="#fd7e14"
                name="Previous Year - Number of Shortlisted Students"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        </Box>

      </Box>
    // </>
  );
};

export default ReChart;
