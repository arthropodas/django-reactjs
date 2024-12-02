import React, { useState, useEffect } from "react";
import { Grid, GridItem, Box, Text, Flex, Input } from "@chakra-ui/react";
import { GrView } from "react-icons/gr";
import { MdEdit, MdDelete } from "react-icons/md";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import CustomModal from "../../../components/modal/CommonModal";
import ReusableTable from "../../../components/table/Table";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ClickButton from "../../../components/button/OnClickButton";
import CustomPagination from "../../../components/pagination/Pagination";
import {
  clickButtonHover,
  submitButtonColor,
  toastTime,
  examMapStatus,
  linkSharedStatus,
  clickButtonColor,
  contentCount,
  courses,
} from "../../../utils/Strings";
import SelectBox from "../../../components/select/SelectBox";
import { LuFilter } from "react-icons/lu";
import { StudentManagementErrorCodes } from "./StudentManagementErrorCodes";
import * as Yup from "yup";
import PaperModal from "../../../components/modal/PaperModal";
import StudentMap from "../studentManagement/StudentMap";
import adminInstitutionErrorCodes from "../institutions/InstitutionErrorCodes";
import SuccessToast from "../../../components/toast/Toast";
import AlertBox from "../../../components/alert/Alert";
import StudentDetail from "../studentManagement/StudentDetail";
import {
  backlogInteger,
  backlogMaxValue,
  backlogNegative,
  backlogRequired,
  backlogType,
  cgpaDecimal,
  cgpaRange,
  cgpaRequired,
  cgpaType,
  emailInvalid,
  emailRequired,
  nameMaxLength,
  nameMinLength,
  nameRegex,
  passYearRequired,
  passYearType,
  phoneLength,
  phoneRegex,
  phoneRequired,
  studentName,
} from "../../../utils/ErrorStrings";

const currentYear = new Date().getFullYear();
const EMAIL_REGEX = new RegExp(process.env.REACT_APP_EMAIL_REGEX);

const individualValidationSchema = Yup.object({
  name: Yup.string()
    .required(studentName)
    .min(3, nameMinLength)
    .max(100, nameMaxLength)
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z\s.]+$/, nameRegex),
  phone: Yup.string()
    .required(phoneRequired)
    .matches(/^\d+$/, phoneRegex)
    .length(10, phoneLength),
  email: Yup.string()
    .required(emailRequired)
    .email(emailInvalid)
    .matches(EMAIL_REGEX, emailInvalid),
  passOutYear: Yup.number()
    .required(passYearRequired)
    .integer(passYearType)
    .min(currentYear - 1, `Year must be ${currentYear - 1} or later`)
    .max(currentYear + 1, `Year must be ${currentYear + 1} or earlier`)
    .typeError(passYearType),
  cgpa: Yup.number()
    .typeError(cgpaType)
    .required(cgpaRequired)
    .min(0, cgpaRange)
    .max(10, cgpaRange)
    .test("is-decimal", cgpaDecimal, (value) =>
      /^\d+(\.\d{1,2})?$/.test(value)
    ),
  noOfBacklogs: Yup.number()
    .typeError(backlogType)
    .required(backlogRequired)
    .min(0, backlogNegative)
    .max(20, backlogMaxValue)
    .integer(backlogInteger),
});

function StudentManagement() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [student, setStudent] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    institution: [],
  });
  const [openStudentDeleteModal, setOpenStudentDeleteModal] = useState(false);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const [openStudentEditModal, setOpenStudentEditModal] = useState(false);
  const [openStudentAddModal, setOpenStudentAddModal] = useState(false);
  const [id, setId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [checkedIds, setCheckedIds] = useState([]);
  const [bulkDeleteDisabled, setBulkDeleteDisabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearOptions, setYearOptions] = useState([]);
  const [institutionId, setInstitutionId] = useState(null);
  const [year, setYear] = useState();
  const [institutions, setInstitutions] = useState([]);

  const [openStudentDetailModal, setOpenStudentDetailModal] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");

  const columns = [
    { field: "name", headerName: "Student Name" },
    { field: "email", headerName: "Email" },

    { field: "passOutYear", headerName: "Passout Year" },
    { field: "institutionName", headerName: "Institution" },
  ];

  const handleCheckboxChange = (e, id) => {
    let updatedCheckedIds;
    if (e.target.checked) {
      updatedCheckedIds = [...checkedIds, id];
    } else {
      updatedCheckedIds = checkedIds.filter((checkedId) => checkedId !== id);
    }
    setCheckedIds(updatedCheckedIds);
    setBulkDeleteDisabled(updatedCheckedIds.length === 0);
  };

  useEffect(() => {}, [checkedIds]);

  const actions = [
    {
      label: "Edit",
      color: "orange",
      icon: <MdEdit />,
      onClick: (id) => handleOpenStudentEditModal(id),
    },
    {
      label: "Delete",
      color: "red",
      icon: <MdDelete />,
      onClick: (id) => handleOpenStudentDeleteModal(id),
    },
    {
      label: "View Detail",
      color: "#2a9df4",
      icon: <GrView />,
      disabled: false,
      onClick: (id) => handleOpenStudentDetailModal(id),
    },
  ];

  const handleStudentCloseModal = () => {
    setOpenStudentDeleteModal(false);
    setOpenBulkDeleteModal(false);
    setOpenStudentEditModal(false);
    setOpenStudentAddModal(false);
    setOpenStudentDetailModal(false);
    fetchStudentDetails();
  };

  const handleFormSubmit = () => {};

  const handleOpenStudentAddModal = () => {
    setOpenStudentAddModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenStudentEditModal = async (userId) => {
    try {
      const response = await adminServices.adminGetStudentById(userId);
      setStudent(response?.data);
    } catch (error) {}

    setOpenStudentEditModal(true);
    setId(userId);
  };
  const handleOpenStudentDetailModal = async (userId) => {
    setOpenStudentDetailModal(true);
    setId(userId);
  };

  const handleOpenStudentDeleteModal = (studentId) => {
    setOpenStudentDeleteModal(true);
    setId([studentId]);
  };

  const handleOpenBulkDeleteModal = () => {
    setBulkDeleteDisabled(true);
    setOpenBulkDeleteModal(true);
  };

  const fetchStudentDetails = async (page = 1) => {
    setLoading(true);

    try {
      const response = await adminServices.adminGetStudents(
        page,
        institutionId,
        year,
        searchTerm
      );
      if (response.status === 200) {
        const studentData = response?.data?.results.map((student) => ({
          id: student.id,
          name: student.name,
          institutionName: student.institution.institution_name,
          email: student.email,
          passOutYear: student.pass_out_year,
          cgpa: student.cgpa,
          backlog: student.no_of_backlogs,
          examStatus: examMapStatus[student.status_exam_student],
          linkSent: linkSharedStatus[student.link_sent],
          phone: student.phone,
        }));

        setData(studentData);
        setTotalPages(Math.ceil(response?.data?.count / contentCount));
      }

      setLoading(false);
    } catch (error) {
      setFetchErrorMessage(
        adminInstitutionErrorCodes(error.response?.data?.errorCode)
      );
      setLoading(false);
    }
  };
  const calculateYears = () => {
    const currentYear = new Date().getFullYear() + 4;
    const years = [];
    for (let i = 0; i <= 10; i++) {
      const yearValue = currentYear - i;
      years.push({
        id: yearValue,
        value: yearValue.toString(),
      });
    }
    setYearOptions(years);
  };
  useEffect(() => {
    calculateYears();
    fetchInstitutionDetails();
    fetchStudentDetails(currentPage);
  }, [currentPage]);

  const fetchInstitutionDetails = async () => {
    try {
      const response = await adminServices.dropdownLists("institution");
      if (response.status === 200) {
        const institutionOptions = response?.data?.map((institution) => ({
          id: institution.id,
          value: institution.institution_name,
        }));
        setInstitutions(institutionOptions);
      }
    } catch (error) {
      setErrorMessage(
        adminInstitutionErrorCodes(error?.response?.data?.errorCode)
      );
    }
  };

  const handleEditStudentDetails = async (data) => {
    setLoading(true);
    try {

      const trimmedData = {
        name: data.name.trim(),
        phone: data.phone,
        email: data.email,
        institutionId: Number(data.institutionId),  
        passOutYear: data.passOutYear,
        cgpa: data.cgpa.trim(),
        noOfBacklogs: data.noOfBacklogs.trim(),
        course: Number(data.course)                 
      };

      const response = await adminServices.adminEditStudent(id, trimmedData);
      
      if (response.status === 200) {
        setErrorMessage("");
        fetchStudentDetails();
        setSuccessMessage("Student Details Updated Successfully");
        setLoading(false);
        setToastOpen(true);
        setTimeout(() => {
          setToastOpen(false);
        }, toastTime);
      }
    } catch (error) {
      setOpenStudentEditModal(true);
      setErrorMessage(
        StudentManagementErrorCodes(error?.response?.data?.errorCode)
      );
      setLoading(false);
    }
    fetchStudentDetails();
  };

  const handleStudentDeleteConfirmation = async () => {
    setLoading(true);
    try {
      setOpenStudentDeleteModal(false);
      const response = await adminServices.adminDeleteStudent(id);
      if (response.status === 200) {
        setErrorMessage("");
        fetchStudentDetails();
        setSuccessMessage("Student Deleted Successfully");
        setLoading(false);
        setToastOpen(true);
        setTimeout(() => {
          setToastOpen(false);
        }, toastTime);
      }
    } catch (error) {
      setErrorMessage(
        StudentManagementErrorCodes(error?.response?.data?.errorCode)
      );
      setLoading(false);
      // setOpenStudentDeleteModal(true);
    }
  };

  const handleBulkDeleteConfirmation = async () => {
    setLoading(true);
    try {
      const response = await adminServices.adminDeleteStudent(checkedIds);
      if (response.status === 200) {
        setErrorMessage("");
        fetchStudentDetails();
        setSuccessMessage("Student Deleted Successfully");
        setLoading(false);
        setToastOpen(true);
        setTimeout(() => {
          setToastOpen(false);
        }, toastTime);
      }
    } catch (error) {
      setErrorMessage(
        StudentManagementErrorCodes(error?.response?.data?.errorCode)
      );
    }
    setCheckedIds([]);
    setOpenBulkDeleteModal(false);
    setLoading(false);
  };

  const handleFilter = () => {
    fetchStudentDetails();
  };
  const handleYearChange = (yearOptions) => {
    setYear(yearOptions.id);
  };
  const handleInstitutionChange = (institutions) => {
    setInstitutionId(institutions.id);
  };
  return (
    <>
      <Box textAlign="center" maxH="32px">
        {fetchErrorMessage && (
          <AlertBox
            message={fetchErrorMessage}
            onClose={() => setFetchErrorMessage("")}
          />
        )}
      </Box>
      <Grid templateColumns="repeat(12, 1fr)" gap={2}>
        <GridItem colSpan={12}>
          <Text fontSize="3xl" fontFamily="Arial, sans-serif">
            Student Management
          </Text>
          <Box
            display="flex"
            justifyContent="space-between"
            mb={4}
            // flexDirection={{ base: "column", md: "row" }}
            // alignItems={{ base: "stretch", md: "center" }}
          >
            <form
              onSubmit={handleFormSubmit}
              // style={{
              //   display: "flex",
              //   flexDirection: "column",
              //   alignItems: "stretch",
              //   width: "100%",
              // }}
            >
              <Box
                display="flex"
                // flexDirection={{ base: "column", md: "row" }}
                // alignItems={{ base: "stretch", md: "center" }}
                textAlign="left"
                mt={45}
                gap={2}
                // width="100%"
              >
                <SelectBox
                  placeholder={"Select Institution"}
                  options={institutions}
                  onSelect={handleInstitutionChange}
                  testId="institution"
                />
                <SelectBox
                  options={yearOptions}
                  onSelect={handleYearChange}
                  placeholder="Select year"
                  testId="year"
                  disableTooltip={true}
                  width="10rem"
                />
                <ClickButton
                  label={<LuFilter fontSize="20px" />}
                  data-testid="filter-button"
                  bgColor={clickButtonColor}
                  width={{ base: "100%", md: "61px" }}
                  height="40px"
                  onClick={handleFilter}
                />
              </Box>
            </form>{" "}
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <Box
              display="flex"
              alignItems="right"
              textAlign="left"
              mt={45}
              gap={2}
            >
              <Input
                type="text"
                bg="white"
                name="student"
                title="Question Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Name"
              />
              <ClickButton
                label="Search"
                data-testId="Search"
                onClick={() => {
                  const page = 1;
                  fetchStudentDetails((page));
                }}
                bgColor={clickButtonColor}
                title="search student"
                type="submit"
              />
            </Box>
            <Flex
              textAlign="right"
              mt={0}
              flexDirection={{ base: "column", md: "row" }}
              spacing={{ base: "5px", md: "10px" }}
              gap={2}
            >
              <ClickButton
                colorScheme="red"
                isDisabled={bulkDeleteDisabled}
                label=" Bulk Delete"
                onClick={handleOpenBulkDeleteModal}
                width={{ base: "100%", md: "auto" }}
              />
              <ClickButton
                label=" + New Students"
                bgColor={submitButtonColor}
                onClick={handleOpenStudentAddModal}
                _hover={{ bg: clickButtonHover }}
                width={{ base: "100%", md: "auto" }}
              />
            </Flex>
          </Box>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ReusableTable
              columns={columns}
              rows={data}
              actions={actions}
              showCheckboxes={true}
              onCheckboxChange={handleCheckboxChange}
              checkedIds={checkedIds}
            />
          )}
          <br />
        </GridItem>
      </Grid>
      <ConfirmDialog
        open={openStudentDeleteModal}
        title="Confirm Delete"
        description="Are you sure you want to delete the Student?"
        onClose={handleStudentCloseModal}
        onConfirm={handleStudentDeleteConfirmation}
      />
      <ConfirmDialog
        open={openBulkDeleteModal}
        title="Confirm Delete"
        description="Are you sure you want to delete the Students?"
        onClose={handleStudentCloseModal}
        onConfirm={handleBulkDeleteConfirmation}
      />
      <PaperModal
        open={openStudentAddModal}
        handleClose={handleStudentCloseModal}
      >
        <Text p="5" as="b" fontSize="2xl">
          New Student
        </Text>
        <StudentMap handleClose={handleStudentCloseModal} />
      </PaperModal>

      <CustomModal
        open={openStudentEditModal}
        handleClose={handleStudentCloseModal}
        title="Edit Student Details"
        validationSchema={individualValidationSchema}
        buttonLabel="Update"
        fields={[
          {
            label: "Name",
            type: "text",
            name: "name",
            defaultValue: student?.name,
          },
          {
            label: "Phone",
            type: "text",
            name: "phone",
            defaultValue: student?.phone,
          },
          {
            label: "Email",
            type: "email",
            name: "email",
            defaultValue: student?.email,
          },
          {
            label: "Select Course",
            componentType: "select",
            component: (
              <SelectBox
                options={courses}
                placeholder={student?.course?.name}
                width="100%"
              />
            ),
            defaultValue: student?.course?.value,
            name: "course",
          },
          {
            label: "Passout year",
            type: "text",
            name: "passOutYear",
            defaultValue: student?.pass_out_year,
          },
          {
            label: "CGPA",
            type: "text",
            name: "cgpa",
            defaultValue: student?.cgpa,
          },
          {
            label: "Backlogs",
            type: "text",
            name: "noOfBacklogs",
            defaultValue: student?.no_of_backlogs,
          },
        ]}
        onConfirm={handleEditStudentDetails}
        error={errorMessage}
        clearMessage={() => setErrorMessage("")}
      />
      <PaperModal
        open={openStudentDetailModal}
        handleClose={handleStudentCloseModal}
      >
        <Text p="2" as="b" fontSize="2xl">
          Profile View
        </Text>
        <StudentDetail handleClose={handleStudentCloseModal} userId={id} />
      </PaperModal>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevious={() => setCurrentPage((prev) => prev - 1)}
        handleNext={() => setCurrentPage((prev) => prev + 1)}
        setCurrentPage={handlePageChange}
      />
      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={successMessage}
      />
    </>
  );
}

export default StudentManagement;
