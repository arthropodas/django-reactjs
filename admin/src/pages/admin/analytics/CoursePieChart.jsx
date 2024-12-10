import React, { useState, useEffect } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip, LabelList } from "recharts";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import AlertBox from "../../../components/alert/Alert";
import { Box } from "@chakra-ui/react";

function CoursePieChart() {
  const COLORS = ["#3862b7", "#198754", "#fd7e14", "#8884d8"];
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const year = "";
  const [errorMessage, setErrorMessage] = useState("");
  const fetchCourseData = () => {
    setLoading(true);
    adminServices
      .adminDashboardCount(year)
      .then((res) => {
        // Transform the student_passing_rate data
        const formattedData = Object.entries(res.data.student_passing_rate).map(
          ([name, value]) => ({
            name, // Course name
            value: parseFloat(value), // Use the numeric part fo  r chart rendering
            label: value, // Keep the original string with '%' for display
          })
        );
        setCourseData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Failed to load");
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchCourseData();
  }, []);

  return (
    <>
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
      <PieChart width={500} height={500}>
        <Pie
          data={courseData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          paddingAngle={1} // spacing between segments
          labelLine={false}
          // label={({ name, label, cx, cy, midAngle, innerRadius, outerRadius }) => {
          //   const RADIAN = Math.PI / 180;
          //   const radius = outerRadius + (innerRadius - outerRadius) / 5;
          //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
          //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

          //   return (
          //     <text
          //       x={x}
          //       y={y}
          //       textAnchor="middle"
          //       dominantBaseline="middle"
          //       style={{
          //         fontSize: "14px",
          //         fontWeight: "bold",
          //         fill: "white",
          //         // whiteSpace: "nowrap", // Ensures text stays within the box
          //         // maxWidth: "100px", // Set a max width for the labels
          //         // overflow: "hidden",
          //         // textOverflow: "ellipsis", // Truncate if the text is too long
          //       }}
          //     >
          //       {`${label}`}
          //     </text>
          //   );
          // }}
        >
          <LabelList
            dataKey="value"
            position="outside" // Position the labels outside the pie chart
            formatter={(value) => `${value}%`} // Format the values to display as percentage
            style={{
              fill: "red",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          />
          {courseData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
        <Legend
          width="100%"
          layout="vertical"
          verticalAlign="top" // Place it at the top of the chart
          iconType="circle" // Optional: Customize the icon type (circle, square, line)
          wrapperStyle={{
            right: "0px",
            paddingLeft: "0px",
            marginTop: "10px",
          }}
        />
      </PieChart>
    </>
  );
}

export default CoursePieChart;
