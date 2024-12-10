import React, { useState, useEffect } from "react";
import { Grid, GridItem, Box, Input, Text } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import * as Yup from "yup";
import SubmitButton from "../../../components/button/SubmitButton";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import CustomModal from "../../../components/modal/CommonModal";
import ReusableTable from "../../../components/table/Table";
import { adminServices } from "../../../services/AdminServices";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ClickButton from "../../../components/button/OnClickButton";
import adminInstitutionErrorCodes from "./InstitutionErrorCodes";
import CustomPagination from "../../../components/pagination/Pagination";
import { buttonSave, clickButtonColor, clickButtonHover, contentCount, submitButtonColor } from "../../../utils/Strings";
import SuccessToast from "../../../components/toast/Toast";
import {
    institutionCode,
    institutionCodeMin,
    institutionCodeMax,
    institutionName,
    institutionNameMin,
    institutionNameMax,
    institutionNameInvalid,
    institutionCodeHasLetter,
    institutionEmail,
    institutionEmailInvalid,
    institutionPhone,
    institutionPhoneInvalid,
    institutionCodeInvalid
} from "../../../utils/ErrorStrings";
import AlertBox from "../../../components/alert/Alert";

const EMAIL_REGEX = new RegExp(process.env.REACT_APP_EMAIL_REGEX_ADMIN);
const validationSchema = Yup.object().shape({
    institutionCode: Yup.string()
        .transform((value) => value.trim())
        .required(institutionCode)
        .min(3, institutionCodeMin)
        .max(10, institutionCodeMax)
        .matches(/^[A-Za-z0-9-_\.]+$/, institutionCodeInvalid)
        .test('has-letter', institutionCodeHasLetter, value => /[A-Za-z0-9]/.test(value)),
    institutionName: Yup.string()
        .transform((value) => value.trim())
        .required(institutionName)
        .min(3, institutionNameMin)
        .max(100, institutionNameMax)
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,.'()&-]*$/, institutionNameInvalid),
    institutionEmail: Yup.string()
        .transform((value) => value.trim())
        .required(institutionEmail)
        .email(institutionEmailInvalid)
        .matches(EMAIL_REGEX, "Invalid email address"),
    institutionPhone: Yup.string()
        .transform((value) => value.trim())
        .required(institutionPhone)
        .matches(/^\d{10}$/, institutionPhoneInvalid),
});

function InstitutionsList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [id, setId] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [toastOpen, setToastOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [institutionDetails, setInstitutionDetails] = useState({
        institutionCode: '',
        institutionName: '',
        institutionEmail: '',
        institutionPhone: '',

    });
    const [modalError, setModalError] = useState('');

    const fetchInstitutionDetails = async (page = 1) => {
        setLoading(true);
        setErrorMessage('');
        setSearch('');
        try {
            const response = await adminServices.adminListInstitution(page, search);
            if (response.status === 200) {
                setData(response.data.results);
                const dataCount = response.data.count;
                setTotalPages(Math.ceil(dataCount / contentCount));
            }
            setSearch('');
            setLoading(false);
        } catch (error) {
            setErrorMessage(adminInstitutionErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);

    };

    const columns = [
        // { field: 'id', headerName: 'ID' },
        { field: 'institution_code', headerName: 'Institution Code' },
        { field: 'institution_name', headerName: 'Institution Name' },
        { field: 'institution_email', headerName: 'Institution Email' },
        { field: 'institution_phone', headerName: 'Phone' },
    ];

    const actions = [
        { label: 'Edit Institution', color: 'orange', icon: <MdEdit />, onClick: (id) => handleOpenEditModal(id) },
        { label: 'Delete Institution', color: 'red', icon: <MdDelete />, onClick: (id) => handleOpenDeleteModal(id), },
    ];

    const handleOpenDeleteModal = (institutionId) => {
        setOpenDeleteModal(true);
        setId(institutionId);
    }

    const handleDeleteConfirmation = async () => {
        setLoading(true);
        setCurrentPage(1);
        try {
            setOpenDeleteModal(false);
            const response = await adminServices.adminDeleteInstitution(id);
            if (response.status === 200) {
                setErrorMessage('');
                fetchInstitutionDetails(1);
                setSuccessMessage('Institution Deleted Successfully')
                setToastOpen(true);
                setLoading(false);
            }
        } catch (error) {
            setErrorMessage(adminInstitutionErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setOpenDeleteModal(false);
        setOpenEditModal(false);
        setOpenAddModal(false);
        setModalError('');
    }

    const handleOpenEditModal = async (institutionId) => {
        setId(institutionId);
        setLoading(true);
        try {
            const response = await adminServices.adminGetInstitutionById(institutionId);
            if (response.status === 200) {
                const institution = response.data;
                setInstitutionDetails({
                    institutionCode: institution.institution_code,
                    institutionName: institution.institution_name,
                    institutionEmail: institution.institution_email,
                    institutionPhone: institution.institution_phone,
                });
                setOpenEditModal(true);
            }
            setLoading(false);
        } catch (error) {
            setErrorMessage(adminInstitutionErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
    }

    const handleEditDetails = async (data) => {
        setLoading(true);
        try {
            setOpenEditModal(false);

            const trimmedData = {
                institutionCode: data.institutionCode.trim(),
                institutionName: data.institutionName.trim(),
                institutionEmail: data.institutionEmail.trim(),
                institutionPhone: data.institutionPhone.trim(),
            };

            const response = await adminServices.adminEditInstitution(id, trimmedData);
            if (response.status === 200) {
                setErrorMessage('');
                setSuccessMessage('Institution Edited Successfully');
                fetchInstitutionDetails();
                setToastOpen(true);
                setLoading(false);
            }
        } catch (error) {
            setOpenEditModal(true);
            setModalError(adminInstitutionErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
        setLoading(false);
    };

    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    }

    const handleAddDetails = async (data) => {
        setLoading(true);
        try {
            setOpenAddModal(false);

            const trimmedData = {
                institutionCode: data.institutionCode.trim(),
                institutionName: data.institutionName.trim(),
                institutionEmail: data.institutionEmail.trim(),
                institutionPhone: data.institutionPhone.trim(),
            };

            const response = await adminServices.adminAddInstitution(trimmedData);
            if (response.status === 201) {
                setErrorMessage('');
                setSuccessMessage('Institution Added Successfully');
                fetchInstitutionDetails(currentPage);
                setToastOpen(true);
            }
        } catch (error) {
            setOpenAddModal(true);
            setModalError(adminInstitutionErrorCodes(error?.response?.data?.errorCode));
            setLoading(false);
        }
        // setLoading(false);
    };

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
        fetchInstitutionDetails();
    };

    useEffect(() => {
        fetchInstitutionDetails(currentPage);
    }, [currentPage]);

    return (
        <>
            {/* Error Message */}
            {errorMessage && (
                <Box textAlign={{ base: "center", md: "center" }} mb={4}>
                    <AlertBox
                        message={errorMessage}
                        onClose={handleCloseModal} />
                </Box>
            )}
            <Grid templateColumns="repeat(12, 1fr)" gap={6} >

                <GridItem colSpan={12}>

                    <Text
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontFamily="Arial, sans-serif"
                        textAlign={{ base: "center", md: "left" }}
                        // mb={{ base: 2, md: 4 }}
                        // mt={{ base: 2, md: 5 }}
                    >
                        Institution Management
                    </Text>

                    <Box display="flex" justifyContent="space-between" mb={4} mt={5}>
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                            <Input
                                type="text"
                                name="category"
                                bg="white"
                                onChange={handleSearch}
                                placeholder="Enter institution name"
                                mr={2}
                            />
                            <SubmitButton label={"Search"} title="Search Institution" data-testId="Search" bgColor={clickButtonColor} type="submit" />
                        </form>&nbsp;

                        <ClickButton label={"+ New Institution"} title='Create new institution' bgColor={submitButtonColor} _hover={{ bg: clickButtonHover }} onClick={handleOpenAddModal} />

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
            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={openDeleteModal}
                title="Confirm Delete"
                description="Are you sure you want to delete the Institution?"
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirmation}
            />
            {/* Edit Category Modal */}
            <CustomModal
                open={openEditModal}
                handleClose={handleCloseModal}
                validationSchema={validationSchema}
                title="Edit Institution"
                buttonLabel='Update'
                fields={[
                    { label: 'Institution Code', type: 'text', name: 'institutionCode', defaultValue: institutionDetails.institutionCode },
                    { label: 'Institution Name', type: 'text', name: 'institutionName', defaultValue: institutionDetails.institutionName },
                    { label: 'Email', type: 'text', name: 'institutionEmail', defaultValue: institutionDetails.institutionEmail },
                    { label: 'Phone', type: 'text', name: 'institutionPhone', defaultValue: institutionDetails.institutionPhone },
                ]}
                onConfirm={handleEditDetails}
                error={modalError}
            />
            {/* Add Category Modal */}
            <CustomModal
                open={openAddModal}
                handleClose={handleCloseModal}
                showDynamicFields={false}
                validationSchema={validationSchema}
                title="Create New Institution"
                buttonLabel={buttonSave}
                fields={[
                    { label: 'Institution Code', type: 'text', name: 'institutionCode' },
                    { label: 'Institution Name', type: 'text', name: 'institutionName' },
                    { label: 'Email', type: 'text', name: 'institutionEmail' },
                    { label: 'Phone', type: 'text', name: 'institutionPhone' },
                ]}
                onConfirm={handleAddDetails}
                error={modalError}
            />
            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
                message={successMessage}
            />
        </>
    );
}

export default InstitutionsList;
