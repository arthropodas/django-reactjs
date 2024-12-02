import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Text,
  Card,
  CardHeader,
  CardBody,
  GridItem,
  Spacer,
} from "@chakra-ui/react";
import {
  clickButtonHover,
  submitButtonColor,
  toastTime,
} from "../../../utils/Strings";
import PropTypes from 'prop-types';
import * as Yup from "yup";
import { GrView } from "react-icons/gr";
import ReusableTable from "../../../components/table/Table";
import ClickButton from "../../../components/button/OnClickButton";
import CustomModal from "../../../components/modal/CommonModal";
import { adminServices } from "../../../services/AdminServices";
import { adminExamBatchErrorCodes } from "../../admin/examManagement/ExamBatchErrorCodes";
import AlertBox from "../../../components/alert/Alert";
import { MdDelete } from "react-icons/md";
import ConfirmDialog from "../../../components/alert/DialogConfirmation";
import SuccessToast from "../../../components/toast/Toast";
import LoadingSpinner from "../../../components/spinner/Spinner";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  batchName: Yup.string()
    .transform((value) => value.trim())
    .required("Batch name is required")
    .min(3, "Batch name must be at least 3 characters")
    .max(100, "Batch name must be at most 100 characters"),
});

function ExamBatch({ examStatus, fetchBatchDetails, batchData }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [batchData, setBatchData] = useState([]);
  const [openBatchDeleteModal, setOpenBatchDeleteModal] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const isDisabled = examStatus && (examStatus === 2 || examStatus === 3);

  const handleOpenBatchDeleteModal = (batchId) => {
    setOpenBatchDeleteModal(true);
    setBatchId(batchId);
  };

  const columns = [
    { field: "uuid", headerName: "Unique Code" },
    { field: "batch_name", headerName: "Batch Name" },
    { field: "no_of_students", headerName: "Total Students" },
    { field: "batch_status", headerName: "Batch Status" }
  ];

  const actions = [
    {
      label: "View Detail",
      color: "red",
      icon: <GrView />,
      onClick: (id) => handleBatchDetails(id),
    },
    ...(isDisabled
      ? []
      : [
        {
          label: "Delete batch",
          color: "red",
          icon: <MdDelete />,
          onClick: (batchId) => handleOpenBatchDeleteModal(batchId),
        }
      ]
    )
  ];

  const handleBatchDetails = (id) => {
    navigate(`../examsList/examDetail/batchDetails/${id}`);
  };

  const handleOpenBatchModal = () => {
    setOpenBatchModal(true);
  };

  const handleCloseBatchModal = () => {
    setOpenBatchModal(false);
    setOpenBatchDeleteModal(false);
    setOpenStatusModal(false);
    setErrorMessage("");
  };

  const handleSubmit = (values) => {
    adminServices
      .adminBatchCreation({
        batchName: values.batchName.trim(),
        examId: id,
      })
      .then((response) => {
        if (response.status === 200) {
          setOpenBatchModal(false);
          setSuccessMessage("Batch Created Successfully");
          setToastOpen(true);
          setTimeout(() => {
            setToastOpen(false);
          }, toastTime);
        }
        fetchBatchDetails();
      })
      .catch((error) => {
        setOpenBatchModal(true);
        setModalErrorMessage(
          adminExamBatchErrorCodes(error?.response?.data?.errorCode)
        );
      });
  };

  const handleBatchDeleteConfirmation = () => {
    setOpenBatchDeleteModal(false);

    adminServices.adminBatchDeleteById(batchId)
      .then((response) => {
        if (response.status === 200) {
          fetchBatchDetails();
        }
        setOpenBatchDeleteModal(false);
        setSuccessMessage("Batch Deleted Successfully");
        setLoading(false);
        setToastOpen(true);
        setTimeout(() => {
          setToastOpen(false);
        }, toastTime);
      })
      .catch((error) => {
        setErrorMessage(adminExamBatchErrorCodes(error?.response?.data?.errorCode));
      })
  };

  const handleStatusChange = (rowId, value) => {
    setBatchId(rowId);
    setStatus(value);
    setOpenStatusModal(true);
  };

  const handleBatchStatusConfirmation = async () => {
    setLoading(true);
    try {
      setOpenStatusModal(false);
      const statusValue = {
        batchStatus: parseInt(status, 10)
      }
      const response = await adminServices.adminBatchClose(batchId, statusValue);
      if (response.status === 200) {
        setErrorMessage('');
        fetchBatchDetails();
        setSuccessMessage('Batch Status Changed Successfully');
        setLoading(false);
        setToastOpen(true);
      }
    } catch (error) {
      setErrorMessage(adminExamBatchErrorCodes(error?.response?.data?.errorCode));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  return (
    <>
      <Box textAlign="center" mb={4} width="500px" minH="75px">
        {errorMessage && (
          <AlertBox
            message={errorMessage}
            onClose={() => {
              setErrorMessage("");
            }}
          />
        )}
      </Box>
      {loading ? (
        <LoadingSpinner />
      ) :
        (
          <GridItem colSpan={12}>
            <Card p="1rem">
              <CardHeader>
                <Text fontSize="2xl">Exam Batches</Text>
              </CardHeader>
              <CardBody>
                <Box display="flex" flexDirection="row" mb={5}>
                  <Spacer />
                  <ClickButton
                    title="Add"
                    label=" + New Batches"
                    bgColor={submitButtonColor}
                    _hover={{ bg: clickButtonHover }}
                    onClick={handleOpenBatchModal}
                    disabled={isDisabled}
                  />
                </Box>
                <ReusableTable
                  data={batchData}
                  columns={columns}
                  rows={batchData}
                  actions={actions}
                  handleStatusChange={handleStatusChange}
                />

              </CardBody>
            </Card>
          </GridItem>
        )}

      {/* Add Batches Modal */}
      <CustomModal
        open={openBatchModal}
        handleClose={handleCloseBatchModal}
        title="Create New Batch"
        buttonLabel='Add'
        validationSchema={validationSchema}
        fields={[
          { label: 'Batch Name', type: 'text', name: 'batchName' },
        ]}
        onConfirm={handleSubmit}
        error={modalErrorMessage}
        clearMessage={() => setModalErrorMessage("")}
      />

      {/* Delete Batch Modal */}
      <ConfirmDialog
        open={openBatchDeleteModal}
        title="Confirm Delete"
        description="Are you sure you want to delete the Batch?"
        onClose={handleCloseBatchModal}
        onConfirm={handleBatchDeleteConfirmation}
      />

      {/* Batch Status Change Modal */}
      <ConfirmDialog
        open={openStatusModal}
        title="Confirm Status Change"
        description="Are you sure you want to change the status of this batch?"
        onClose={handleCloseBatchModal}
        onConfirm={handleBatchStatusConfirmation}
      />

      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={successMessage}
      />
    </>
  );
}


ExamBatch.propTypes = {
  examStatus: PropTypes.number.isRequired,
};

export default ExamBatch;
