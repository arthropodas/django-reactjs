import React, { useState, useEffect } from "react";
import { Grid, GridItem, Box, Input, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { MdEdit, MdDelete } from "react-icons/md";
import SubmitButton from "../../../components/button/SubmitButton";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import CustomModal from "../../../components/modal/CommonModal";
import ReusableTable from "../../../components/table/Table";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ClickButton from "../../../components/button/OnClickButton";
import adminQuestionCategoryErrorCodes from "./CategoryErrorCodes";
import SuccessToast from "../../../components/toast/Toast";
import { buttonSave, clickButtonColor, clickButtonHover, submitButtonColor } from "../../../utils/Strings";
import AlertBox from "../../../components/alert/Alert";
import {
    sectionName,
    sectionNameInvalid,
    sectionNameMax,
    sectionNameMin
} from "../../../utils/ErrorStrings";

const validationSchema = Yup.object().shape({
    categoryName: Yup.string()
        .transform((value) => value.trim())
        .required(sectionName)
        .min(2, sectionNameMin)
        .max(100, sectionNameMax)
        .matches(/^[a-zA-Z0-9\s]+$/, sectionNameInvalid)
});

function QuestionCategoryList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [id, setId] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [toastOpen, setToastOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [modalError, setModalError] = useState('');

    const fetchCategoryDetails = async () => {
        setEditCategoryName('');
        setLoading(true);
        try {
            const response = await adminServices.adminListCategory(search);
            if (response.status === 200) {
                setData(response.data);
                setLoading(false);
                setSearch('');
            }
        } catch (error) {
            setErrorMessage(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };

    const columns = [
        { field: 'question_category_name', headerName: 'Section' },
    ];

    const actions = [
        {
            label: 'Edit Section', color: 'orange', icon: <MdEdit />, onClick: (id) => handleOpenEditModal(id)
        },
        {
            label: 'Delete Section', color: 'red', icon: <MdDelete />, onClick: (id) => handleOpenDeleteModal(id)
        },
    ];

    const handleOpenDeleteModal = (categoryId) => {
        setOpenDeleteModal(true);
        setId(categoryId);
    }

    const handleDeleteConfirmation = async () => {
        try {
            setLoading(true);
            setOpenDeleteModal(false);
            const response = await adminServices.adminDeleteCategory(id);
            if (response.status === 200) {
                setErrorMessage('');
                fetchCategoryDetails();
                setMessage('Section Deleted Successfully');
                setLoading(false);
                setToastOpen(true);
            }
        } catch (error) {
            setErrorMessage(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenDeleteModal(false);
        setOpenEditModal(false);
        setOpenAddModal(false);
        setModalError('');
    };

    const handleOpenEditModal = async (categoryId) => {
        setId(categoryId);
        setLoading(true);
        try {
            const response = await adminServices.adminGetCategoryById(categoryId);
            if (response.status === 200) {
                setEditCategoryName(response.data.question_category_name);
                setOpenEditModal(true);
            }
            setLoading(false);
        } catch (error) {
            setErrorMessage(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };

    const handleEditDetails = async (data) => {
        setLoading(true);
        try {
            setOpenEditModal(false);

            const trimmedData = {
                categoryName: data.categoryName.trim()
            }

            const response = await adminServices.adminEditCategory(id, trimmedData);
            if (response.status === 200) {
                setErrorMessage('');
                setMessage('Section Updated Successfully');
                fetchCategoryDetails();
                setToastOpen(true);
                setLoading(false);
            }
        } catch (error) {

            setModalError(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
        setLoading(false);
    };

    const handleOpenAddModal = () => {
        setEditCategoryName('');
        setOpenAddModal(true);
    };

    const handleAddDetails = async (data) => {
        setLoading(true);
        try {
            setOpenAddModal(false);

            const trimmedData = {
                categoryName: data.categoryName.trim()
            }

            const response = await adminServices.adminAddCategory(trimmedData);
            if (response.status === 201) {
                setErrorMessage('');
                setMessage('Section Added Successfully');
                fetchCategoryDetails();
                setToastOpen(true);
                setLoading(false);
            }
        } catch (error) {
            setModalError(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
            setOpenAddModal(true);
            setLoading(false);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleFormSubmit = (e) => {
        setErrorMessage("")
        setData([]);
        e.preventDefault();
        fetchCategoryDetails();
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    return (
        <>
            {errorMessage && (
                <Box textAlign="center" mb={4}>
                    <AlertBox
                        message={errorMessage}
                        onClose={() => setModalError('')}
                    />
                </Box>
            )}
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                <GridItem colSpan={12}>
                    <Text fontSize={{ base: "1xl", md: "3xl" }} fontFamily="Arial, sans-serif">Question Section Management</Text>
                    <Box display="flex" justifyContent="space-between" mb={4} mt={5}>
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                            <Input
                                type="text"
                                bg="white"
                                name="category"
                                title="Section Search"
                                onChange={handleSearch}
                                placeholder="Enter Name"
                                mr={2}
                            />
                            <SubmitButton label="Search" data-testId='Search' bgColor={clickButtonColor} title="search section" type="submit" />
                        </form>&nbsp;
                        <ClickButton title="Create new section" label=" + New Section" bgColor={submitButtonColor} _hover={{ bg: clickButtonHover }} onClick={handleOpenAddModal} />
                    </Box>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <ReusableTable
                            data={data}
                            columns={columns}
                            rows={data}
                            actions={actions}
                        />
                    )}
                </GridItem>
            </Grid>
            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={openDeleteModal}
                title="Confirm Delete"
                description="Are you sure you want to delete the question section?"
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirmation}
            />
            {/* Edit Section Modal */}
            <CustomModal
                open={openEditModal}
                handleClose={handleCloseModal}
                title="Edit Section"
                buttonLabel='Update'
                validationSchema={validationSchema}
                fields={[
                    { label: 'Section', type: 'text', name: 'categoryName', defaultValue: editCategoryName },
                ]}
                onConfirm={handleEditDetails}
                error={modalError}
            />
            {/* Add Section Modal */}
            <CustomModal
                open={openAddModal}
                handleClose={handleCloseModal}
                title="New Section"
                buttonLabel={buttonSave}
                validationSchema={validationSchema}
                fields={[
                    { label: 'Name', type: 'text', name: 'categoryName' },
                ]}
                onConfirm={handleAddDetails}
                error={modalError}
            />
            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
                message={message}
            />
        </>
    );
}
export default QuestionCategoryList;
