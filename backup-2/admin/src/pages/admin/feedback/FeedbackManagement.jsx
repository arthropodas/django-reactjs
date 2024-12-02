import React, { useEffect, useState } from "react";
import { Grid, GridItem, Box, Text, Flex } from "@chakra-ui/react";
import { LuFilter } from "react-icons/lu";
import CustomPagination from "../../../components/pagination/Pagination";
import ReusableTable from "../../../components/table/Table";
import LoadingSpinner from "../../../components/spinner/Spinner";
import { adminServices } from "../../../services/AdminServices";
import { contentCount, ratingValues } from "../../../utils/Strings";
import adminFeedbackErrorCodes from "./FeedbackManagementErrorCodes";
import adminInstitutionErrorCodes from "../institutions/InstitutionErrorCodes";
import AlertBox from "../../../components/alert/Alert";
import SelectBox from "../../../components/select/SelectBox";
import ClickButton from "../../../components/button/OnClickButton";
function FeedbackManagement() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratingStatus, setRatingStatus] = useState("");
  const [institutions,setInstitutions]=useState([]);
  const [institutionId, setInstitutionId] = useState("");
  const getRateValue=(value)=>{
    switch(value){
      case 1: return "Very Poor";
      case 2: return "Poor";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
    }
  }
  const fetchfeedbacks = async (page = 1) => {
    try {
      const response = await adminServices.adminListFeedbacks(ratingStatus,institutionId, page);
      if (response.status === 200) {
        const flattenedData = response.data.results.map((item) => ({
          id: item.id,
          studentName: item.student.name, // Flatten the student name
          comment: item.comment || "-",
          rating: getRateValue(item.rating),
          institutionName: item.student.institution.institution_name
        }));
        setData(flattenedData);
       
        setTotalPages(Math.ceil(response.data.count / contentCount));
        setLoading(true);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(adminFeedbackErrorCodes(error.response.data?.errorCode));
      setLoading(false);
    }
  };

  const fetchInstitutionDetails = async () => {
    try {
      const response = await adminServices.dropdownLists('institution');
      if (response.status === 200) {
        const institutionOptions = response?.data?.map(
          (institution) => ({
            id: institution.id,
            value: institution.institution_name,
          })
        );
        setInstitutions(institutionOptions);
      }
    } catch (error) {
      setErrorMessage(
        adminInstitutionErrorCodes(error?.response?.data?.errorCode)
      );
    }
  };
  useEffect(() => {
    fetchfeedbacks(currentPage);    
    fetchInstitutionDetails();
  }, [currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const columns = [
    { field: "studentName", headerName: "Student Name" },
    { field: "rating", headerName: "Rating"},
    { field: "comment", headerName: "Comment" },
    {field:"institutionName",headerName:"Institution Name"}
  ];
  const ratingOptions = ratingValues.map(option => ({
    id: option.id,
    value: option.value
  }));
  const handleChangeRateValue = (option) => {
    setRatingStatus(option?.id || ""); // Sets to an empty string if option or id is undefined
  };

  const handleInstitutionChange = (institutions) => {
    setInstitutionId(institutions?.id || "")
  }
  const handleFilter=()=>{
    fetchfeedbacks();
  }
  return (
    <>
      {/* Error Message */}
      <Box textAlign="center" mb={4} >
        {errorMessage && (
          <AlertBox
            message={errorMessage}
            onClose={() => { setErrorMessage('') }} />
        )}
      </Box>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <GridItem colSpan={12}>
            {/* list Input and Button */}
            <Text fontSize="3xl" fontFamily="Arial, sans-serif" mb={"20px"}>
              Feedbacks
            </Text>
            {/* Filtering */}
            <Flex mb={4} >
            <Box display="flex" alignItems="center" textAlign="left" mt={5} gap={2}>
            <SelectBox
              placeholder="Select rating"
              onSelect={handleChangeRateValue}
              options={ratingOptions}
            />
              <SelectBox
              placeholder="Select Institution"
              onSelect={handleInstitutionChange}
              options={institutions}
            />
              <ClickButton label={<LuFilter fontSize="20px" />} bgColor="#3b4891" width="15%" onClick={handleFilter} />
            </Box>
            
            </Flex>
            {/* Table */}
            <ReusableTable data={data} columns={columns} rows={data} />
            <br />
          </GridItem>
        )}
      </Grid>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevious={() => setCurrentPage((prev) => prev - 1)}
        handleNext={() => setCurrentPage((prev) => prev + 1)}
        setCurrentPage={handlePageChange}
      />
    </>
  );
}

export default FeedbackManagement;
