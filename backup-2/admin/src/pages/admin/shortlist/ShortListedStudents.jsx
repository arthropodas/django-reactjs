import React, { useEffect, useState } from "react";
import { Grid, GridItem, Box, Input, Text, Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import SubmitButton from "../../../components/button/SubmitButton";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ReusableTable from "../../../components/table/Table";
import CustomPagination from "../../../components/pagination/Pagination";
import ClickButton from "../../../components/button/OnClickButton";
import { adminServices } from "../../../services/AdminServices";
import { useParams } from "react-router-dom";
import { contentCount } from "../../../utils/Strings";
import adminShortlistErrorCodes from "./ShortListedStudentsErrorCodes";
import SuccessToast from "../../../components/toast/Toast";
import AlertBox from "../../../components/alert/Alert";
import { clickButtonColor } from "../../../utils/Strings";

function ShortListedStudents() {
  const [errorMessages, setErrorMessages] = useState("");
  const [mark, setMark] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [data, setData] = useState([]);
  const [studentIds, setStudentIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [institutionIds, setInstitutionIds] = useState(null);
  const { id } = useParams();
  const [toastOpen, setToastOpen] = useState(false);
  const [message, setMessage] = useState("");

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "studentName", headerName: "Student Name" },
    { field: "institution", headerName: "Institution Name" },
    { field: "mark", headerName: "Mark" },
    { field: "selected", headerName: "Selected" },
  ];
  const [loading, setLoading] = useState(false);
  const handleList = (e) => {
    const value = parseFloat(e.target.value);
    setMark(value);
    if (isNaN(value)) {
      setErrorMessages("Please enter a valid number for the cutoff mark.");
    }

    if (value < 0) {
      setErrorMessages("Mark should be a positive number");
    }
    if (value == "") {
      setErrorMessages("Cutoff mark cannot be null");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessages("");
    setData([]);
    fetchShortList();
  };
  const fetchAllList = async (page = 1) => {
    setLoading(true);
    
    try {
      const response = await adminServices.adminListAllWrittenStudents(
        page,
        id
      );
      if (response.status === 200) {
        const allData = response.data.results.map((item, index) => ({
          id: item.student_id__id, 
          studentName: item.student_id__name,
          mark: item.student_id__marksofstudents__mark,
          institution: item.student_id__institution__institution_name,
          selected: item.student_id__examstudents__is_shortlisted ? 'Selected':'Not Selected'
        }));
        setAllStudents(allData);
        setTotalPages(Math.ceil(response.data.count / contentCount));
      }
      setLoading(false);
    } catch (error) {
      setErrorMessages( adminShortlistErrorCodes(error?.response?.data?.errorCode) );
      setLoading(false);
    }
  };

  const fetchShortList = async () => {
    setLoading(true);
    try {
      const response = await adminServices.adminListShortListedStudents(mark, id);
  
      if (response.status === 200) {
        const shortListData = response.data.results.map((item) => ({
          id: item.student_id__id, 
          studentName: item.student_id__name,
          mark: parseInt(item.student_id__marksofstudents__mark, 10), 
          institution: item.student_id__institution__institution_name, 
        }));
        setData(shortListData)
        const studentIdsArray = shortListData.map((data) => data.id);
        const institutionIdCopy =
          response?.data?.results[0]?.student_id__institution;
        setInstitutionIds(institutionIdCopy);
        setStudentIds(studentIdsArray);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessages(
        adminShortlistErrorCodes(error?.response?.data?.errorCode)
      );
      setLoading(false);
    }
  };
  
  const handleSendMail = async () => {
    setLoading(true);
    try {
      const response = await adminServices.adminSendShortlistMail({
        studentId: studentIds,
        institutionId: institutionIds,
      });
      if (response.status === 200) {
        setLoading(false);
        setMessage("Email send successfully");
        setToastOpen(true);
      }
    } catch (error) {
      setErrorMessages(
        adminShortlistErrorCodes(error?.response?.data?.errorCode)
      );
      setLoading(false);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchAllList(currentPage);
  }, [currentPage])

  return (
    <>
      <Box textAlign="center" mb={4} minH="32px">
        {errorMessages && (
          <AlertBox
            message={errorMessages}
            onClose={() => { setErrorMessages('') }} />
        )}
      </Box>
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab
            bg="gray.100"
            _selected={{ bg: "blue.500", color: "white" }}
            _hover={{ bg: "gray.200" }}
          >All Students</Tab>
          <Tab
            bg="gray.100"
            _selected={{ bg: "blue.500", color: "white" }}
            _hover={{ bg: "gray.200" }}
          >Shortlisted Students</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={12}>
                <Text fontSize="3xl" fontFamily="Arial, sans-serif" mb={4}>
                  All Students
                </Text>
                <ReusableTable  columns={columns} rows={allStudents} />
              </GridItem>
            </Grid>
            <br />
            <br />
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePrevious={() => setCurrentPage((prev) => prev - 1)}
              handleNext={() => setCurrentPage((prev) => prev + 1)}
              setCurrentPage={handlePageChange}
            />
          </TabPanel>
          <TabPanel>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={12}>
                <Text fontSize="3xl" fontFamily="Arial, sans-serif" mb={4}>
                  Shortlisted Students
                </Text>
                <Box display="flex" justifyContent="space-between" mb={4}>
                  <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Input
                      type="text"
                      name="category"
                      bgColor="white"
                      onChange={handleList}
                      placeholder="Enter cutoff mark"
                      mr={2}
                    />
                    <SubmitButton label="List" bgColor={clickButtonColor} type="submit" />
                  </form>
                </Box>
                <ReusableTable data={data} columns={columns} rows={data} />
                <br />
                <Flex justify="right">
                  {loading ? (
                    <LoadingSpinner  /> 
                  ) : (
                    <ClickButton
                      label={"Send Mail"}
                      bgColor={clickButtonColor}
                      // _hover={{ bg: "#005bb5" }}
                      onClick={handleSendMail}
                    />
                  )}
                </Flex>
              </GridItem>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={message}
      />
    </>
  );
}

export default ShortListedStudents;
