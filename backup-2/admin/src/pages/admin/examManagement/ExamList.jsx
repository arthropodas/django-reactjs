import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem, Box, Text, Link, Button, Input } from "@chakra-ui/react";
import { LuFilter } from "react-icons/lu";
import { GrView } from "react-icons/gr";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import ReusableTable from "../../../components/table/Table";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ClickButton from "../../../components/button/OnClickButton";
import adminExamErrorCodes from "./ExamErrorCodes";
import AlertBox from "../../../components/alert/Alert";
import CustomPagination from "../../../components/pagination/Pagination";
import { clickButtonColor, clickButtonHover, contentCount, examStatuses, submitButtonColor } from "../../../utils/Strings";
import PaperModal from "../../../components/modal/PaperModal";
import SuccessToast from "../../../components/toast/Toast";
import SelectBox from "../../../components/select/SelectBox";
import SubmitButton from "../../../components/button/SubmitButton";
import ExamAdd from "./ExamAdd";
import adminQuestionnaireErrorCodes from "../questionnaireManagement/QuestionnaireErrorCodes";

function AdminExamsList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [examId, setExamId] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [toastOpen, setToastOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [yearOptions, setYearOptions] = useState([]);
    const [questionnaire, setQuestionnaire] = useState([]);
    const [questionnaireId, setQuestionnaireId] = useState('');
    const [search, setSearch] = useState('');
    const [year, setYear] = useState('');
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const getStatusLabel = (statusValue) => {
        const status = examStatuses.find((s) => s.id === statusValue);
        return status ? status.value : 'Unknown';
    };

    const fetchExamDetails = async (page = 1) => {
        try {
            const response = await adminServices.adminListExams(page, year, questionnaireId, search);
            if (response.status === 200) {
                const examData = response.data.results.map((exam) => ({
                    id: exam.id,
                    exam: exam.exam_name,
                    examLocation: exam.exam_location.location_name,
                    statuss: getStatusLabel(exam.status_of_exam),
                    date: exam.exam_date,
                    time: exam.exam_time,
                }));
                setData(examData);
                setTotalPages(Math.ceil(response.data.count / contentCount));
                setLoading(true);

            }
            setLoading(false);
        } catch (error) {
            setErrorMessage(adminExamErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setData([]);
        fetchExamDetails();
    };
    const handleFormSearch = (e) => {
        e.preventDefault();
        setErrorMessage("")
        setData([]);
        fetchExamDetails();
    };
    const columns = [
        { field: 'exam', headerName: 'Exam Name' },
        { field: 'examLocation', headerName: 'Exam Location' },
        { field: 'date', headerName: 'Scheduled Date' },
        { field: 'time', headerName: 'Time' },
    ];
    const handleSelect = (rowId, value) => {
        setExamId(rowId);
        setStatus(value);
        setData((prevData) =>
            prevData.map((row) =>
                row.id === rowId ? { ...row, status: value } : row
            )
        );
        setOpenStatusModal(true);
    };
    const actions = [
        { label: 'View Detail', color: '#2a9df4', icon: <GrView />, disabled: false, onClick: (id) => handleNavigateToDetailPage(id) },
    ];

    const handleStatusConfirmation = async () => {
        setLoading(true);
        try {
            setOpenStatusModal(false);
            const statusValue = {
                examStatus: parseInt(status, 10)
            }
            const response = await adminServices.adminDeleteExam(examId, statusValue);
            if (response.status === 200) {
                setErrorMessage('');
                fetchExamDetails();
                setSuccessMessage('Exam Status Changed Successfully');
                setLoading(false);
                setToastOpen(true);
            }
        } catch (error) {
            setErrorMessage(adminExamErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenStatusModal(false);
        setOpenAddModal(false);
        fetchExamDetails();
    };

    const handleOpenAddModal = () => {
        navigate("/dashboard/examAdd");
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNavigateToDetailPage = (id) => {
        navigate(`examDetail/${id}`);
    };

    const calculateYears = () => {
        const currentYear = new Date().getFullYear() + 4;
        const years = [];
        for (let i = 0; i <= 12; i++) {
            const yearValue = currentYear - i;
            years.push({
                id: yearValue,
                value: yearValue.toString(),
            });
        }
        setYearOptions(years);
    };

    const handleYearChange = (selectedYear) => {
        setYear(selectedYear.id);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const fetchQuestionnaires = async () => {
        try {
            const response = await adminServices.questionnaireLists();
            if (response.status === 200) {
                const questionnaireOptions = response?.data?.results.map(
                    (questionnaire) => ({
                        id: questionnaire.id,
                        value: questionnaire.questionnaire_name,
                    })
                );
                setQuestionnaire(questionnaireOptions);
            }
        } catch (error) {
            setErrorMessage(
                adminQuestionnaireErrorCodes(error?.response?.data?.errorCode)
            );
        }
    };

    const handleQuestionnaireChange = (questionnaire) => {
        setQuestionnaireId(questionnaire.id)
    }
    useEffect(() => {
        calculateYears();
        fetchQuestionnaires();
        fetchExamDetails(currentPage);
    }, [currentPage]);

    return (
        <>
            {errorMessage && (
                <Box textAlign="center" mb={4} minH="60px">
                    <AlertBox
                        message={errorMessage}
                        onClose={() => { setErrorMessage('') }} />
                </Box>
            )}
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <GridItem colSpan={12}>
                        <Text fontSize="3xl" fontFamily="Arial, sans-serif">Exam Management</Text>
                        <Box display="flex" justifyContent="space-between" mb={4}>
                            <form onSubmit={handleFormSubmit}>
                                <Box display="flex" alignItems="center" textAlign="left" mt={45} gap={2}>
                                    <SelectBox
                                        options={yearOptions}
                                        onSelect={handleYearChange}
                                        placeholder="Select Year"
                                        disableTooltip={true}
                                    />
                                    <SelectBox
                                        placeholder={"Select Questionnaire"}
                                        options={questionnaire}
                                        onSelect={handleQuestionnaireChange}
                                        testId="questionnaire"
                                    />
                                   
                                    <SubmitButton label={<LuFilter fontSize="20px" />} title='filter' bgColor={clickButtonColor}   width={{ base: "100%", md: "61px" }}/>
                                </Box>
                            </form> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <form
                                onSubmit={handleFormSearch}
                                style={{ display: 'flex', alignItems: 'right' }}>
                                <Box display="flex" alignItems="right" textAlign="left" mt={45} gap={2}>
                                    <Input
                                        type="text"
                                        bg="white"
                                        name="examName"
                                        title="Exam Search"
                                        onChange={handleSearch}
                                        placeholder="Enter Name"
                                    />
                                    <SubmitButton label="Search" data-testId='Search' bgColor={clickButtonColor} title="search exam" type="submit" />
                                </Box>
                            </form>&nbsp;
                            <Box textAlign="right" mt={0} >
                                <ClickButton label={"+ Schedule Exam"} title='schedule' bgColor={submitButtonColor} _hover={{ bg: clickButtonHover }} onClick={handleOpenAddModal} />
                            </Box>
                        </Box>
                        <ReusableTable
                            columns={columns}
                            rows={data}
                            actions={actions}
                            handleStatusChange={handleSelect}
                        />
                        <br />
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePrevious={() => setCurrentPage(prev => prev - 1)}
                            handleNext={() => setCurrentPage(prev => prev + 1)}
                            setCurrentPage={handlePageChange}
                        />
                    </GridItem>
                )}
            </Grid>
            <ConfirmDialog
                open={openStatusModal}
                title="Confirm Status Change"
                description="Are you sure you want to change the status of this exam?"
                onClose={handleCloseModal}
                onConfirm={handleStatusConfirmation}
            />
            <PaperModal
                open={openAddModal}
                handleClose={handleCloseModal}
            >
                <Text p="5" as="b" fontSize="2xl">
                    Schedule Exam
                </Text>
                <ExamAdd handleClose={handleCloseModal} />
            </PaperModal>
            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
                message={successMessage}
            />
        </>
    );
}

export default AdminExamsList;