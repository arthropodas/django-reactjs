import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Card,
    CardHeader,
    CardBody,
    GridItem,
    FormLabel,
    Select,
    Flex,
    VStack
} from "@chakra-ui/react";
import { examStatuses } from "../../../utils/Strings";
import adminExamErrorCodes from './ExamErrorCodes';
import { adminServices } from '../../../services/AdminServices';
import ConfirmDialog from '../../../components/alert/DialogConfirmation';
import SuccessToast from '../../../components/toast/Toast';
import AlertBox from '../../../components/alert/Alert';

const ExamStatus = ({ examStatus, examId, onExamStatusChange, fetchBatchDetails }) => {

    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openWarningModal, setOpenWarningModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [batchStudents, setBatchStudents] = useState([]);
    const [toastOpen, setToastOpen] = useState(false);

    const statusObject = examStatuses.find(status => status.id === examStatus);
    const statusValue = statusObject ? statusObject.value : 'Unknown Status';

    const isDisabled = statusValue === "COMPLETED" || statusValue === "CANCELLED";

    const handleStatusChange = (value) => {
        setStatus(value);
        setOpenStatusModal(true);
    };

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
                setToastMessage('Exam Status Changed Successfully');
                setToastOpen(true);
                onExamStatusChange();
            }
        } catch (error) {
            if (error.response.data.errorCode === 'e1126') {
                setOpenWarningModal(true);
            } else {
                setErrorMessage(adminExamErrorCodes(error?.response?.data?.errorCode));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForceDeleteConfirmation = async () => {
        setLoading(true);
        try {
            setOpenWarningModal(false); 
            
            const statusValue = { 
                examStatus: parseInt(status, 10) 
            };

            const response = await adminServices.adminForceCompleteExam(examId, statusValue);

            if (response.status === 200) {
                setErrorMessage('');
                setToastMessage('Exam Completed Successfully and Batches Closed');
                setToastOpen(true);
                onExamStatusChange();
                fetchBatchDetails();
            }
        } catch (error) {
            setErrorMessage(adminExamErrorCodes(error?.response?.data?.errorCode));
        } finally {
            setLoading(false);
        }
    };

    const fetchBatchStudentDetails = async () => {
        setLoading(true);
        try {
            const response = await adminServices.adminBatchStudentDetails(examId);
            setBatchStudents(response.data);
        } catch (error) {
            setErrorMessage()
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setStatus(examStatus);
        setOpenStatusModal(false);
    };

    const handleCloseWarningModal = () => {
        setStatus(examStatus);
        setOpenWarningModal(false);
    };

    useEffect(() => {
        fetchBatchStudentDetails();
        setStatus(examStatus);
    }, [examStatus]);

    return (
        <GridItem colSpan={12}>
            <Card p="1rem">
                {errorMessage && (
                    <Box textAlign="center" mb={4}>
                        <AlertBox message={errorMessage} onClose={() => { setErrorMessage('') }} />
                    </Box>
                )}
                <CardHeader>
                    <Text fontSize="2xl">Exam Status</Text>
                </CardHeader>
                <CardBody>
                    <Box display="flex" flexDirection="row" gap={12}>
                        <Box bg="#ddddddbd" borderRadius="8px" p="1.5rem" width="30%">
                            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap="1rem" wrap="wrap">
                                <VStack align="start" gap="0.2rem" spacing={0} flex="1" >
                                    <Text fontWeight="bold" color="#6f7c80" mb="0.1rem">
                                        Students Completed
                                    </Text>
                                    <Text color="#47515c" fontSize="30px" m="0.3rem">
                                        {batchStudents.total_students_completed}
                                    </Text>
                                </VStack>
                            </Flex>
                        </Box>
                        <Box bg="#ddddddbd" borderRadius="8px" p="1.5rem" width="30%">
                            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap="1rem" wrap="wrap">
                                <VStack align="start" gap="0.2rem" spacing={0} flex="1" >
                                    <Text fontWeight="bold" color="#6f7c80" mb="0.1rem">
                                        Students Remaining
                                    </Text>
                                    <Text color="#47515c" fontSize="30px" m="0.3rem">
                                        {batchStudents.total_students_remaining}
                                    </Text>
                                </VStack>
                            </Flex>
                        </Box>
                        <Box bg="#ddddddbd" borderRadius="8px" p="1.5rem" width="30%">
                            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap="1rem" wrap="wrap">
                                <VStack align="start" gap="0.2rem" spacing={0} flex="1" >
                                    <Text fontWeight="bold" color="#6f7c80" mb="0.1rem">
                                        Total Students
                                    </Text>
                                    <Text color="#47515c" fontSize="30px" m="0.3rem">
                                        {batchStudents.total_students_in_exam}
                                    </Text>
                                </VStack>
                            </Flex>
                        </Box>
                    </Box>
                    <br /><br />
                    <FormLabel htmlFor="exam_duration" fontSize="lg" fontWeight="bold" >
                        Exam Status
                    </FormLabel>
                    <Select
                        width="40%"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        data-testid={`select-status`}
                        isDisabled={isDisabled}
                        style={{ fontWeight: isDisabled ? 'bold' : 'normal', color: 'black' }}
                    >
                        {examStatuses.map((status) => {
                            const isOptionDisabled =
                                (statusValue === "STARTED" && status.value === "SCHEDULED") ||
                                isDisabled;

                            return (
                                <option
                                    key={status.id}
                                    value={status.id}
                                    disabled={isOptionDisabled}
                                >
                                    {status.value}
                                </option>
                            );
                        })}
                    </Select>
                </CardBody>
            </Card>

            {/* Confirm dialog box for status confirmation */}
            <ConfirmDialog
                open={openStatusModal}
                title="Confirm Status Change"
                description="Are you sure you want to change the status of this exam?"
                onClose={handleCloseModal}
                onConfirm={handleStatusConfirmation}
            />

            {/* Warning dialog for batch close confirmation when exam is completed */}
            <ConfirmDialog
                open={openWarningModal}
                title="Confirm Batch Close"
                description="There are still some batches open. Do you really want to close them and complete the exam?"
                onClose={handleCloseWarningModal}
                onConfirm={handleForceDeleteConfirmation}
            />

            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
                message={toastMessage}
            />

        </GridItem>
    );
}

export default ExamStatus