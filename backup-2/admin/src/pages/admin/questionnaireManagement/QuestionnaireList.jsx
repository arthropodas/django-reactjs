import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem, Box, Input, Text } from "@chakra-ui/react";
import { GrView } from "react-icons/gr";
import { MdEdit, MdDelete } from "react-icons/md";
import SubmitButton from "../../../components/button/SubmitButton";
import ReusableTable from "../../../components/table/Table";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ClickButton from "../../../components/button/OnClickButton";
import CustomPagination from "../../../components/pagination/Pagination";
import { clickButtonColor, clickButtonHover, contentCount, submitButtonColor } from "../../../utils/Strings";
import SuccessToast from "../../../components/toast/Toast";
import AlertBox from "../../../components/alert/Alert";
import QuestionPaperView from "./QuestionPaperView";
import PaperModal from "../../../components/modal/PaperModal";
import adminQuestionnaireErrorCodes from "./QuestionnaireErrorCodes";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import SelectBox from "../../../components/select/SelectBox";
import { LuFilter } from "react-icons/lu";

function QuestionnaireList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState();
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [toastOpen, setToastOpen] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [year, setYear] = useState('');
    const [message, setMessage] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const navigate = useNavigate();
    const fetchQuestionnaireDetails = async (page = 1) => {
        setLoading(true);
        setErrorMessage('');
        setSearch('');
        try {
            const response = await adminServices.adminQuestionnaireLists(search, year, page);
            if (response.status === 200) {
                setData(response.data.results);
                const dataCount = response.data.count;
                setTotalPages(Math.ceil(dataCount / contentCount));
            }
            setSearch('');
            setLoading(false);
        } catch (error) {
            setErrorMessage(adminQuestionnaireErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const columns = [
        // { field: 'id', headerName: 'ID' },
        { field: 'questionnaire_name', headerName: 'Questionnaire Name' },
        { field: 'total_questions', headerName: 'Questions Count' },
    ];
    const handleOpenModal = (id) => {
        setOpenDetailModal(true);
        setId(id);
    };
    const handleEdit = (id) => {
        navigate(`/dashboard/questionnaireList/questionnaireAdd`, { state: { ids: id } });
    };
    const handleCloseModal = () => {
        setOpenDetailModal(false);
        setOpenDeleteModal(false);
    }
    const handleDeleteConfirmation = async () => {
        try {
            setLoading(true);
            setOpenDeleteModal(false);
            const response = await adminServices.adminQuestionnaireDelete(id);
            if (response.status === 200) {
                setErrorMessage('');
                fetchQuestionnaireDetails();
                setMessage('Questionnaire Deleted Successfully');
                setLoading(false);
                setToastOpen(true);
            }
        } catch (error) {
            setErrorMessage(adminQuestionnaireErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };
    const handleOpenDeleteModal = (categoryId) => {
        setOpenDeleteModal(true);
        setId(categoryId);
    }
    const actions = [
        { label: 'Edit Questionnaire', color: "orange", icon: <MdEdit />, disabled: false, onClick: (id) => handleEdit(id) },
        {
            label: 'Delete Questionnaire', color: 'red', icon: <MdDelete />, onClick: (id) => handleOpenDeleteModal(id)
        },
        { label: 'View Detail', color: '#2a9df4', icon: <GrView />, disabled: false, onClick: (id) => handleOpenModal(id) },
    ];
    const handleOpenAddPage = () => {
        navigate('questionnaireAdd');
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("")
        setData([]);
        setSearch('');
        setCurrentPage(1);
        setTotalPages(0);
        fetchQuestionnaireDetails();
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
    const handleFilter = () => {
        fetchQuestionnaireDetails();
    };
    const handleYearChange = (yearOptions) => {
        setYear(yearOptions.id);
    };
    useEffect(() => {
        calculateYears();
        fetchQuestionnaireDetails(currentPage);
    }, [currentPage]);
    return (
        <>
            {errorMessage && (
                <Box textAlign={{ base: "center", md: "center" }} mb={4}>
                    <AlertBox
                        message={errorMessage}
                        onClose={() => { setErrorMessage('') }} />
                </Box>
            )}
            <Grid templateColumns="repeat(12, 1fr)" gap={6} >
                <GridItem colSpan={12}>
                    <Text fontSize="3xl" fontFamily="Arial, sans-serif">
                        Questionnaire Management
                    </Text>
                    <Box display="flex" justifyContent="space-between" mb={4} >
                        <Box display="flex" alignItems="center" textAlign="left" mt={5} gap={2}>
                            <form
                                onSubmit={handleFormSubmit}
                                style={{ display: 'flex', alignItems: 'center' }}>
                                <Input
                                    type="text"
                                    name="category"
                                    bg="white"
                                    onChange={handleSearch}
                                    placeholder="Enter questionnaire name"
                                    mr={2}
                                />
                                <SubmitButton label={"Search"}
                                    data-testId="Search"
                                    title="search"
                                    bgColor={clickButtonColor}
                                    type="submit" />
                            </form>
                        </Box> &nbsp;
                        <Box
                            display="flex"
                            textAlign="left"
                            mt={5}
                            mr={2}
                            gap={2}
                        >
                            <form
                                onSubmit={handleFormSubmit}
                                style={{ display: 'flex', alignItems: 'center' }} >
                                <SelectBox
                                    options={yearOptions}
                                    onSelect={handleYearChange}
                                    placeholder="Select year"
                                    testId="year"
                                    disableTooltip={true}
                                    width="10rem"

                                /> &nbsp;
                                <ClickButton
                                    label={<LuFilter fontSize="20px" />}
                                    data-testid="filter-button"
                                    bgColor={clickButtonColor}
                                    width={{ base: "100%", md: "61px" }}
                                    height="40px"
                                    onClick={handleFilter}
                                />
                            </form>
                        </Box>
                        <Box display="flex" justifyContent="flex-end" mt={5} gap={2}>

                            <ClickButton label={" + New Questionnaire"}
                                title='Create new questionnaire'
                                bgColor={submitButtonColor}
                                _hover={{ bg: clickButtonHover }}
                                onClick={handleOpenAddPage} />&nbsp;

                        </Box>
                    </Box>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <ReusableTable
                            columns={columns}
                            rows={data}
                            actions={actions}
                        />
                    )}
                    <br />
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevious={() => setCurrentPage(prev => prev - 1)}
                        handleNext={() => setCurrentPage(prev => prev + 1)}
                        setCurrentPage={handlePageChange}
                    />
                </GridItem>

            </Grid>
            <PaperModal
                open={openDetailModal}
                handleClose={handleCloseModal}
                width={"50vw"}
            >
                <Text p="2" as="b" fontSize="2xl" justifyContent='center' alignItems='center'>
                    Fetched Questions
                </Text>
                <br />
                <QuestionPaperView questionnaireId={id} />
            </PaperModal>
            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
            />
            <ConfirmDialog
                open={openDeleteModal}
                title="Confirm Delete"
                description="Are you sure you want to delete the questionnaire?"
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirmation}
            />
            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
                message={message}
            />
        </>
    );
}

export default QuestionnaireList;
