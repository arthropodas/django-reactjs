import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Textarea,
    Flex,
    Checkbox,
    Image,
    IconButton,
} from "@chakra-ui/react";
import {
    Formik,
    Field,
    Form
} from "formik";
import * as Yup from "yup";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CloseIcon } from '@chakra-ui/icons';
import TextBox from "../../../components/textbox/TextBox.js";
import SelectBox from "../../../components/select/SelectBox";
import SubmitButton from "../../../components/button/SubmitButton";
import { adminServices } from "../../../services/AdminServices.js";
import SuccessToast from "../../../components/toast/Toast.jsx";
import AlertBox from "../../../components/alert/Alert.jsx";
import ClickButton from "../../../components/button/OnClickButton.jsx";
import { buttonSave } from '../../../utils/Strings.js';
import { QuestionTypes, questionsDifficultyLevel } from '../../../utils/QuestionTypes';
import adminQuestionCategoryErrorCodes from '../questionCategory/CategoryErrorCodes.jsx';
import adminQuestionErrorCodes from './QuestionsErrorCodes.jsx';
import {
    questionRequired,
    questionCategoryRequired,
    questionTypeRequired,
    questionDifficultyLevel,
    option1Required,
    option2Required
} from "../../../utils/ErrorStrings.js";

const questionValidationSchema = Yup.object().shape({
    question: Yup.string().required(questionRequired),
    // option1: Yup.string().required(option1Required),
    // option2: Yup.string().required(option2Required),
    category_id: Yup.string().required(questionCategoryRequired),
    question_type: Yup.string().required(questionTypeRequired),
    difficulty_level: Yup.string().required(questionDifficultyLevel),
    // option3: Yup.string().required('Option 3 is required'),
    // option4: Yup.string().required('Option 4 is required'),
});

const QuestionAdd = ({ questionId, onClose, fetchQuestions }) => {

    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [initialValues, setInitialValues] = useState({
        category_id: '',
        question_type: '',
        difficulty_level: '',
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: [],
        question_image: null
    });

    const questionTypeOptions = Object.keys(QuestionTypes).map(key => ({
        id: key,
        value: QuestionTypes[key]
    }));

    const difficultyLevel = Object.keys(questionsDifficultyLevel).map(key => ({
        id: key,
        value: questionsDifficultyLevel[key]
    }));

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

    const fetchQuestionById = async () => {
        setLoading(true);
        try {
            const response = await adminServices.adminGetQuestionsById(questionId);
            if (response.status === 200) {
                const question = response.data;

                const combinedOptions = [
                    ...new Set([
                        ...question.options,
                        ...question.correct_answer
                    ])
                ];

                setInitialValues({
                    category_id: question.category_id,
                    question_type: question.question_type,
                    difficulty_level: question.question_difficulty_level,
                    question: question.question,
                    option1: combinedOptions[0] || '',
                    option2: combinedOptions[1] || '',
                    option3: combinedOptions[2] || '',
                    option4: combinedOptions[3] || '',
                    correct_answer: question.correct_answer || [],
                    question_image: question.question_image || null
                });
            }
        } catch (error) {
            setErrorMessage(adminQuestionCategoryErrorCodes(error?.response?.data?.errorCode));
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestions = async (values) => {
        setLoading(true);
        try {
            const options = [
                values.option1,
                values.option2,
                values.option3,
                values.option4,
            ].map(option => option.trim()).filter(option => option !== '');

            const correctAnswers = values.correct_answer
                .map(answer => answer.trim())  
                .filter(answer => answer !== '');

            const dataToSend = {
                category_id: values.category_id,
                question_type: values.question_type,
                difficulty_level: values.difficulty_level,
                question: values.question.trim(),
                options: JSON.stringify(options.flat()),
                correct_answer: JSON.stringify(correctAnswers.flat()),
                question_image: values.question_image || null
            };

            const response = await adminServices.adminAddQuestions(dataToSend);
            if (response.status === 201) {
                setErrorMessage('');
                setLoading(false);
                setToastOpen(true);
                setToastMessage('Question added successfully');
                onClose();
                fetchQuestions();
            }
        } catch (error) {
            setErrorMessage(adminQuestionErrorCodes(error?.response?.data?.errorCode));
        } finally {
            setLoading(false);
        }
    };

    const handleEditQuestion = async (values) => {

        setLoading(true);
        try {
            const options = [
                values.option1.trim(),
                values.option2.trim(),
                values.option3.trim(),
                values.option4.trim(),
            ].map(option => option.trim()).filter(option => option !== '');

            const correctAnswers = values.correct_answer
                .map(answer => answer.trim())  
                .filter(answer => answer !== '');

            const dataToSend = {
                category_id: values.category_id,
                question_type: values.question_type,
                difficulty_level: values.difficulty_level,
                question: values.question.trim(),
                options: JSON.stringify(options.flat()),
                correct_answer: JSON.stringify(correctAnswers.flat()),
                question_image: values.question_image || null
            };

            const response = await adminServices.adminEditQuestions(questionId, dataToSend);
            if (response.status === 200) {
                setErrorMessage('');
                setToastMessage('Question Edited Successfully');
                setToastOpen(true);
                onClose();
                fetchQuestions();
            }

        } catch (error) {
            setErrorMessage(adminQuestionErrorCodes(error?.response?.data?.errorCode));
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue("question_image", file);
    };

    const handleClearImage = (setFieldValue) => {
        setFieldValue("question_image", null);
    };

    const handleCancelButton = () => {
        onClose();
    };

    const handleQuestionTypeChange = (option, setFieldValue) => {
        const newQuestionType = parseInt(option.id, 10);

        setFieldValue("question_type", newQuestionType);
        setFieldValue("option1", '');
        setFieldValue("option2", '');
        setFieldValue("option3", '');
        setFieldValue("option4", '');
        setFieldValue("correct_answer", []);
    };

    useEffect(() => {
        fetchCategory();
        if (questionId) {
            fetchQuestionById();
        }
    }, [questionId]);

    return (
        <>
            {errorMessage && (
                <AlertBox message={errorMessage} onClose={() => setErrorMessage('')} />
            )}
            <Box pl="1.5rem" pr="1.5rem">
                <Formik
                    initialValues={initialValues}
                    validationSchema={questionValidationSchema}
                    onSubmit={questionId ? handleEditQuestion : handleAddQuestions}
                    enableReinitialize
                >
                    {({ setFieldValue, values, errors, touched }) => {

                        return (
                            <Form>
                                <Text textAlign="center" as="b" fontSize="2xl">
                                    {questionId ? 'Edit Question' : 'Create a New Question'}
                                </Text> <br /> <br />
                                <Text textAlign="center" as="b" fontSize="18px"> Enter question details </Text>
                                <Box minH="52px" mt={5}>
                                    <Text mb={2}>Question Section</Text>
                                    <Field name="category_id">
                                        {({ field }) => {

                                            const selectedOption = options.find(option => option.id === field.value) || {};

                                            return (
                                                <SelectBox
                                                    width="100%"
                                                    placeholder={questionId ? (selectedOption.value || "Select Section") : "Select Section"}
                                                    options={options}
                                                    onSelect={(option) => {
                                                        setFieldValue("category_id", option.id);
                                                    }}
                                                />
                                            );
                                        }}
                                    </Field>
                                    {errors.category_id && touched.category_id && (
                                        <Text color="red.500" mt={1} fontSize="15px">
                                            {errors.category_id}
                                        </Text>
                                    )}
                                </Box>
                                <Box display="flex" justifyContent="space-between" minH="52px" flexDirection={{ base: "column", md: "row" }} mt={8}>
                                    <Box minH="52px" flex="1" mr={2}>
                                        <Text mb={2}>Question type</Text>
                                        <Field name="question_type">
                                            {({ field }) => {

                                                const selectedOption = questionTypeOptions.find(option => option.id === String(field.value)) || {};

                                                return (
                                                    <SelectBox
                                                        width="100%"
                                                        placeholder={questionId ? (selectedOption.value || "Question Type") : "Question Type"}
                                                        options={questionTypeOptions}
                                                        onSelect={(option) => handleQuestionTypeChange(option, setFieldValue)}
                                                        isReadOnly={questionId}
                                                    />
                                                );
                                            }}
                                        </Field>
                                        {errors.question_type && touched.question_type && (
                                            <Text color="red.500" mt={1} fontSize="15px">
                                                {errors.question_type}
                                            </Text>
                                        )}
                                    </Box>
                                    <Box minH="52px" flex="1">
                                        <Text mb={2}>Question difficulty level</Text>
                                        <Field name="difficulty_level">
                                            {({ field }) => {

                                                const selectedOption = difficultyLevel.find(option => option.id === String(field.value)) || {};

                                                return (
                                                    <SelectBox
                                                        width="100%"
                                                        placeholder={questionId ? (selectedOption.value || "Question level") : "Question level"}
                                                        options={difficultyLevel}
                                                        onSelect={(option) => {
                                                            setFieldValue("difficulty_level", parseInt(option.id, 10));
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                        {errors.difficulty_level && touched.difficulty_level && (
                                            <Text color="red.500" mt={1} fontSize="15px">
                                                {errors.difficulty_level}
                                            </Text>
                                        )}
                                    </Box>
                                </Box>
                                <Box minH="52px" mt={8} gap={3}>
                                    <Text>Question</Text>
                                    <Box display="flex" flexDirection="row" alignItems="center" gap={4}>
                                        {/* <Field name="question">
                                            {({ field, form }) => (
                                                <TextBox
                                                    field={field}
                                                    form={form}
                                                    type="text"
                                                    placeholder="Enter question here"
                                                />
                                            )}
                                        </Field> */}
                                        <Box display="flex" flexDirection="column" width="100%">
                                            <Field name="question">
                                                {({ field, form }) => (
                                                    <Textarea
                                                        {...field}
                                                        form={form}
                                                        placeholder="Enter question here"
                                                        resize="vertical"
                                                    />
                                                )}
                                            </Field>
                                            {touched.question && errors.question && (
                                                <Text color="red.500" mt={1} fontSize="15px">
                                                    {errors.question}
                                                </Text>
                                            )}
                                        </Box>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => handleImageUpload(event, setFieldValue)}
                                            style={{ display: 'none' }}
                                            id="imageUpload"
                                        />
                                        <label htmlFor="imageUpload">
                                            <IoCloudUploadOutline style={{ color: 'skyblue', fontSize: '24px', cursor: 'pointer' }} />
                                        </label>
                                    </Box>
                                </Box>
                                {values.question_image && (
                                    <Box mt={8} gap={3}>
                                        {!questionId && (
                                            <IconButton
                                                icon={<CloseIcon />}
                                                onClick={() => handleClearImage(setFieldValue)}
                                                aria-label="Clear image"
                                                top={10}
                                                size="sm"
                                            />
                                        )}
                                        <Image
                                            // src={questionId ? values.question_image : URL.createObjectURL(values.question_image)}
                                            src={typeof values.question_image === 'string'
                                                ? values.question_image
                                                : URL.createObjectURL(values.question_image)}
                                            alt={"Question image"}
                                            width="100%"
                                            maxHeight="300px"
                                            objectFit="cover"
                                        />
                                        {values.question_image && typeof values.question_image !== 'string' && (
                                            <Text ml={4}>{values.question_image.name}</Text>
                                        )}
                                    </Box>
                                )}

                                <br />

                                {values.question_type && (
                                    <>
                                        <Text textAlign="center" as="b" fontSize="18px"> Enter the options </Text>
                                        <Text fontSize="17px" color="grey"> Mark the correct options </Text>

                                        {values.question_type === 1 ? (
                                            [1, 2].map((num) => (
                                                <Box minH="52px" mt={5} key={num}>
                                                    <Text ml={8}>Option {num}</Text>
                                                    <Box display="flex" flexDirection="row" gap={4}>
                                                        <Checkbox
                                                            isChecked={values.correct_answer.includes(values[`option${num}`]) && values[`option${num}`] !== ""}
                                                            isDisabled={!values[`option${num}`]}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                const optionValue = values[`option${num}`];
                                                                if (isChecked && optionValue && !values.correct_answer.includes(optionValue)) {
                                                                    setFieldValue("correct_answer", [...values.correct_answer, optionValue]);
                                                                } else {
                                                                    setFieldValue("correct_answer", values.correct_answer.filter(answer => answer !== optionValue));
                                                                }
                                                            }}
                                                        />
                                                        <Field name={`option${num}`}>
                                                            {({ field, form }) => (
                                                                <TextBox
                                                                    field={field}
                                                                    form={form}
                                                                    width="25rem"
                                                                    type="text"
                                                                    placeholder={`Enter option ${num}`}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target.value;
                                                                        const oldValue = field.value;

                                                                        field.onChange(e);

                                                                        if (values.correct_answer.includes(oldValue)) {
                                                                            setFieldValue(
                                                                                "correct_answer",
                                                                                values.correct_answer.map(answer => (answer === oldValue ? newValue : answer))
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </Box>
                                                </Box>
                                            ))
                                        ) : (
                                            [1, 2, 3, 4].map((num) => (
                                                <Box minH="52px" mt={5} key={num}>
                                                    <Text ml={8}>Option {num}</Text>
                                                    <Box display="flex" flexDirection="row" gap={4}>
                                                        <Checkbox
                                                            isChecked={values.correct_answer.includes(values[`option${num}`]) && values[`option${num}`] !== ""}
                                                            isDisabled={!values[`option${num}`]}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                const optionValue = values[`option${num}`];
                                                                if (isChecked && optionValue && !values.correct_answer.includes(optionValue)) {
                                                                    setFieldValue("correct_answer", [...values.correct_answer, optionValue]);
                                                                } else {
                                                                    setFieldValue("correct_answer", values.correct_answer.filter(answer => answer !== optionValue));
                                                                }
                                                            }}
                                                        />
                                                        <Field name={`option${num}`}>
                                                            {({ field, form }) => (
                                                                <TextBox
                                                                    field={field}
                                                                    form={form}
                                                                    width="25rem"
                                                                    type="text"
                                                                    placeholder={`Enter option ${num}`}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target.value;
                                                                        const oldValue = field.value;

                                                                        field.onChange(e);

                                                                        if (values.correct_answer.includes(oldValue)) {
                                                                            setFieldValue(
                                                                                "correct_answer",
                                                                                values.correct_answer.map(answer => (answer === oldValue ? newValue : answer))
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </Box>
                                                </Box>
                                            ))
                                        )}
                                    </>
                                )}

                                <br /><br />
                                <Flex>
                                    <SubmitButton
                                        title="Add"
                                        type="submit"
                                        colorScheme={"green"}
                                        textColor="white"
                                        label={buttonSave}
                                        width="100%"
                                        _hover={{ bg: "green" }}
                                    />
                                    &nbsp;
                                    <ClickButton
                                        type="reset"
                                        colorScheme={"red"}
                                        textColor="white"
                                        label={"Cancel"}
                                        width="100%"
                                        _hover={{ bg: "red" }}
                                        onClick={handleCancelButton}
                                    />
                                </Flex>
                            </Form>
                        );
                    }}
                </Formik>
            </Box>

            {/* Toast component */}
            <SuccessToast
                show={toastOpen}
                onClose={() => setToastOpen(false)}
                message={toastMessage}
            />
        </>
    );
}

export default QuestionAdd