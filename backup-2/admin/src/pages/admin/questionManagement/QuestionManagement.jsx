import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Input,
  Text,
} from '@chakra-ui/react';
import { LuFilter } from "react-icons/lu";
import { MdEdit, MdDelete } from "react-icons/md";
import { adminServices } from '../../../services/AdminServices';
import ClickButton from '../../../components/button/OnClickButton';
import SelectBox from '../../../components/select/SelectBox';
import ReusableTable from '../../../components/table/Table';
import ConfirmDialog from '../../../components/alert/DialogConfirmation';
import adminQuestionErrorCodes from './QuestionsErrorCodes';
import adminQuestionCategoryErrorCodes from '../questionCategory/CategoryErrorCodes';
import LoadingSpinner from "../../../components/spinner/Spinner";
import SuccessToast from '../../../components/toast/Toast';
import { clickButtonColor, clickButtonHover, contentCount, submitButtonColor } from "../../../utils/Strings";
import { QuestionTypes, questionsDifficultyLevel } from '../../../utils/QuestionTypes';
import AlertBox from '../../../components/alert/Alert';
import CustomPagination from "../../../components/pagination/Pagination";
import PaperModal from "../../../components/modal/PaperModal";
import QuestionnaireBulkUpload from './QuestionnaireBulkUpload';
import QuestionAdd from './QuestionAdd';

const QuestionManagement = () => {

  const [options, setOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openBulkAddModal, setOpenBulkAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [questionId, setQuestionId] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');


  const columns = [
    { field: 'question_category_name', headerName: 'Section' },
    { field: 'question_difficulty_level', headerName: 'Difficulty Level' },
    { field: 'question_type', headerName: 'Question Type' },
    { field: 'question', headerName: 'Question' },
    { field: 'options', headerName: 'Options' },
    { field: 'correct_answer', headerName: 'Answer' },
  ];

  const actions = [
    { label: 'Edit', color: 'orange', icon: <MdEdit />, onClick: (id) => handleEditModal(id) },
    { label: 'Delete', color: 'red', icon: <MdDelete />, onClick: (id) => handleDeleteModal(id) },
  ];

  //api call to fetch category
  const fetchCategory = async () => {
    try {
      const response = await adminServices.dropdownLists('question_category');
      if (response.status === 200) {
        const categories = response.data.map((category) => ({
          id: category.id,
          value: category.question_category_name
        }))
        setOptions(categories);
      }
    } catch (error) {
      setErrorMessage(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
    } finally {
      setLoading(false);
    }
  };

  //api call for listing all the questions

  const fetchQuestions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminServices.adminListQuestions(selectedCategory, search, page);
      if (response.status === 200) {
        const results = response.data.results

        const transformedData = results.map(question => ({
          id: question.question_id,
          question_category_name: question.category_name,
          question: question.question,
          options: question.options.join(', '),
          correct_answer: question.correct_answer.join(', '),
          question_type: QuestionTypes[question.question_type] || "unknown",
          question_difficulty_level: questionsDifficultyLevel[question.question_difficulty_level] || "unknown",
          question_image: question.question_image || null
        }));
        setData(transformedData);
        setTotalPages(Math.ceil(response.data.count / contentCount));
      }
    } catch (error) {
      setData([]);
      // setErrorMessage(adminQuestionErrorCodes(error?.response?.data?.errorCode));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleAddBulkModalOpen = () => {
    setOpenBulkAddModal(true);
  };

  //question delete

  const handleQuestionDelete = async () => {
    try {
      setLoading(true);
      setOpenDeleteModal(false);
      const response = await adminServices.adminDeleteQuestions(questionId);
      if (response.status === 200) {
        setErrorMessage('');
        fetchQuestions(currentPage);
        setToastMessage('Question Deleted Successfully');
        setLoading(false);
        setToastOpen(true);
      }
    } catch (error) {
      setErrorMessage(adminQuestionErrorCodes(error?.response?.data?.errorCode));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModal = (questionId) => {
    setQuestionId(questionId);
    setOpenDeleteModal(true);
  }

  const handleEditModal = async (questionId) => {
    setQuestionId(questionId);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    fetchQuestions();
    setOpenAddModal(false);
    setOpenDeleteModal(false);
    setOpenEditModal(false);
    setOpenBulkAddModal(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchCategory();
    fetchQuestions(currentPage);
  }, [currentPage]);

  return (
    <>
      {errorMessage && (
        <AlertBox message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      <Grid templateColumns="repeat(12, 1fr)" gap={6} >

        <GridItem colSpan={12}>
          <Text fontSize="3xl" fontFamily="Arial, sans-serif">Question Management</Text>
          <Box display="flex" justifyContent="space-between" mb={4} >
            <Box display="flex" alignItems="center" textAlign="left" mt={5} gap={2}>
              <SelectBox
                placeholder={"Question Section"}
                options={options}
                optionValue={selectedCategory}
                onSelect={(option) => setSelectedCategory(option.id)}
              />
              <ClickButton label={<LuFilter fontSize="20px" />} bgColor="#3b4891" width="15%" onClick={() => fetchQuestions(currentPage)} />
            </Box>&nbsp;

            <Box display="flex" alignItems="right" textAlign="left" mt={5} gap={2}>
              <Input
                type="text"
                bg="white"
                name="question"
                title="Question Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter Question"
              />
              <ClickButton label="Search" data-testId='Search' bgColor={clickButtonColor} onClick={() => fetchQuestions(currentPage)} title="search question" type="submit" />
            </Box>&nbsp;

            <Box display="flex" justifyContent="flex-end" mt={5} gap={2}>
              <ClickButton label=" + New Questions" title="New questions" bgColor={submitButtonColor} _hover={{ bg: clickButtonHover }} onClick={handleOpenAddModal} />
              <ClickButton label=" + Bulk Upload"
                title="Upload questions as bulk"
                bgColor={submitButtonColor}
                _hover={{ bg: clickButtonHover }}
                onClick={handleAddBulkModalOpen} />
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
        </GridItem>

      </Grid>

      <PaperModal open={openAddModal} handleClose={handleCloseModal} width="40%">
        <QuestionAdd onClose={handleCloseModal} fetchQuestions={fetchQuestions} />
      </PaperModal>

      <PaperModal
        open={openBulkAddModal}
        handleClose={handleCloseModal}
      >
        <Text p="2" as="b" fontSize="2xl">
          Upload Bulk Questions
        </Text>
        <br />
        <QuestionnaireBulkUpload handleClose={handleCloseModal} />
      </PaperModal>

      <PaperModal open={openEditModal} handleClose={handleCloseModal} width="40%">
        <QuestionAdd questionId={questionId} onClose={handleCloseModal} fetchQuestions={fetchQuestions} />
      </PaperModal>


      {/* Delete Question Dialog */}
      <ConfirmDialog
        open={openDeleteModal}
        title="Confirm Delete"
        description="Are you sure you want to delete the question ?"
        onClose={handleCloseModal}
        onConfirm={handleQuestionDelete}
      />

      {/* Custom Pagination */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevious={() => setCurrentPage(prev => prev - 1)}
        handleNext={() => setCurrentPage(prev => prev + 1)}
        setCurrentPage={handlePageChange}
      />

      {/* Toast component */}
      <SuccessToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
      />
    </>
  )
}

export default QuestionManagement