import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { adminServices } from "../../../services/AdminServices";
import { Box, Divider, Text } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { dashboardColor } from "../../../utils/Strings";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../../../components/spinner/Spinner";
import AlertBox from "../../../components/alert/Alert";

const DoughnutChart = () => {
  const today = new Date();
  const graph_min_date = new Date("1970");
  const [data, setData] = useState([]); // Initialize with an empty array
  const [year, setYear] = useState(today.getFullYear()); // Initialize with Jan 1 of the current year
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = () => {
    setLoading(true);
    adminServices
      .adminDashboardCount(year)
      .then((response) => {
        const { shortlisted, completed, terminated } =
          response.data.student_shortlist_donut_chart;

        // Format data for the chart
        const formattedData = [
          { name: "Shortlisted", value: shortlisted },
          { name: "Completed", value: completed },
          { name: "Terminated", value: terminated },
        ];

        setData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage("Failed to load");
      });
  };
  useEffect(() => {
    if (selectedYear) {
      fetchData();
    }
  }, [selectedYear]);

  // Colors for the segments
  const COLORS = ["#3862b7", "#198754", "#fd7e14"];

  return (
    <Box width="50%" height="700px" bg={dashboardColor}>
      {loading && (
        <Box textAlign="center">
          <LoadingSpinner />
        </Box>
      )}
      {errorMessage && (
        <Box textAlign="center" mb={4}>
          <AlertBox
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        </Box>
      )}
      <Box p={6}>
        <Text as="b" fontSize="24px">
          Shortlist Status
        </Text>
      </Box>
      <Divider borderColor="gray.400" width="500px" mt={3}/>
      <Box marginLeft="380px" width="100%">
        <Text>Year</Text>
        <DatePicker
          data-testid="weekinput"
          style={{ borderColor: "none" }}
          className="input"
          onChange={(date) => {
            const yearOnly = date.getFullYear();
            const yearDate = new Date(yearOnly, 0, 1);
            setSelectedYear(yearDate)
            setYear(yearOnly)
          }}
          selected={selectedYear}
          locale="en-GB"
          showYearPicker
          dateFormat="yyyy"
          maxDate={new Date(today.getFullYear(), 0, 1)}
          minDate={new Date(graph_min_date.getFullYear(), 0, 1)}
        />
      </Box>
      {errorMessage || loading || data.every((item) => item.value === 0) ? (
        <Text color="red" fontSize={20} p={8}>
          No Data Available...
        </Text>
      ) : (
        <ResponsiveContainer width={500} height={500}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={150}
              fill="#8884d8"
              paddingAngle={1} // spacing between segments
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="vertical"
              verticalAlign="top"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: "30px",
                paddingTop: "0px",
                paddingRight: "300px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default DoughnutChart;
