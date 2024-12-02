import React, { useState, useEffect } from "react";
import {
    Box,
    Stack,
    Flex,
    IconButton,
    Text,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { MinusIcon } from "@chakra-ui/icons";
import TextBox from "../../../components/textbox/TextBox";
import ClickButton from "../../../components/button/OnClickButton";
import SelectBox from "../../../components/select/SelectBox";
import SubmitButton from "../../../components/button/SubmitButton";
import AlertBox from "../../../components/alert/Alert";
import { adminServices } from "../../../services/AdminServices";
import SuccessToast from "../../../components/toast/Toast";
import QuestionPaperView from "./QuestionPaperView";
import adminQuestionnaireErrorCodes from "./QuestionnaireErrorCodes";
import { validateCategories } from "../../../utils/Strings";
import useCategories from "../../../utils/useCategories";
import { useLocation, useNavigate } from 'react-router-dom';
import useLinkStore from "../../../components/store/LinkStore";
import useExamStore from "../../../components/store/ExamStore";
import { questionnaireMaxLengthRequired, questionnaireMinLengthRequired, questionnaireNameInvalid } from "../../../utils/ErrorStrings";

function QuestionnaireAdd() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const [toastOpen, setToastOpen] = useState(false);
    const [questionList, setQuestionList] = useState([]);
    const [questionArray, setQuestionArray] = useState([]);
    const [name, setName] = useState('');
    const location = useLocation();
    const from = location.state?.from || 'unknown';
    const id = location.state?.ids || '';
    const { link } = useLinkStore();
    const { setQuestionnaireData } = useExamStore();
    const [isEditMode, setIsEditMode] = useState(false);
    const { categoryOptions, categoryDetails, fetchCategoryDetails, fetchCategoryQuestionCount } = useCategories(setErrorMessage);
    const [dynamicFields, setDynamicFields] = useState([{ category: "", level1: "", level2: "", level3: "" }]);
    const [formikValues, setFormikValues] = useState({
        questionnaireName: '',
        categories: [{ category: "", level1: "", level2: "", level3: "" }]
    });

    const fetchEditDetails = async (questionnaireId) => {
        try {
            const response = await adminServices.adminQuestionnaireEditPreviewView(questionnaireId);
            if (response.status === 200) {
                const { examCategories, questionnaireName } = response.data;
                const updatedDynamicFields = examCategories.map(category => {
                    const levels = category.levels || {};
                    return {
                        category: category.questionCategoryId,
                        level1: levels['1']?.noOfQuestions || "",
                        level2: levels['2']?.noOfQuestions || "",
                        level3: levels['3']?.noOfQuestions || "",
                    };
                });
                setName(questionnaireName);
                setDynamicFields(updatedDynamicFields);
                setFormikValues({
                    questionnaireName: questionnaireName,
                    categories: updatedDynamicFields
                });
            }
        } catch (error) {
            setErrorMessage(adminQuestionnaireErrorCodes(error.response?.data?.errorCode));
        }
    };

    const validationSchema = Yup.object().shape({
        questionnaireName: Yup.string()
            .required('Questionnaire name is required.')
            .matches(/^[a-zA-Z0-9\s]+$/, questionnaireNameInvalid)
            .min(3, questionnaireMinLengthRequired)
            .max(200, questionnaireMaxLengthRequired),
        ...((dynamicFields || []).reduce((acc, _, index) => {
            acc[`category_${index}`] = Yup.number().required('section is required.');
            acc[`level_${index}_1`] = Yup.number().min(0, 'At least one easy question is required.').required('Easy questions are required.');
            acc[`level_${index}_2`] = Yup.number().min(0, 'At least one medium question is required.').required('Medium questions are required.');
            acc[`level_${index}_3`] = Yup.number().min(0, 'At least one hard question is required.').required('Hard questions are required.');
            return acc;
        }, {})),
    });

    const addDynamicField = () => {
        setDynamicFields(prevFields => [...prevFields, { category: "", level1: "", level2: "", level3: "" }]);
    };

    const removeDynamicField = (index, setFieldValue) => {
        if (dynamicFields.length > 1) {
            const newDynamicFields = dynamicFields.filter((_, i) => i !== index);
            setDynamicFields(newDynamicFields);
            setFieldValue(`category_${index}`, "");
            setFieldValue(`level_${index}_1`, "");
            setFieldValue(`level_${index}_2`, "");
            setFieldValue(`level_${index}_3`, "");
        }
    };

    const handleAddDetails = async (data) => {
        try {
            if (!validateCategories(data, categoryDetails, setErrorMessage)) {
                return;
            }
            setName(data.questionnaireName);
            const transformedData = {
                questionnaireName: data.questionnaireName,
                examCategories: [],
            };

            let index = 0;
            while (data[`category_${index}`]) {
                const levels = [
                    { level: 1, noOfQuestions: parseInt(data[`level_${index}_1`], 10) },
                    { level: 2, noOfQuestions: parseInt(data[`level_${index}_2`], 10) },
                    { level: 3, noOfQuestions: parseInt(data[`level_${index}_3`], 10) },
                ];
                levels.forEach(level => {
                    if (!isNaN(level.noOfQuestions) && level.noOfQuestions > 0) {
                        transformedData.examCategories.push({
                            questionCategoryId: parseInt(data[`category_${index}`], 10),
                            level: level.level,
                            noOfQuestions: level.noOfQuestions,
                        });
                    }
                });
                index++;
            }

            const response = await adminServices.adminQuestionnaireAddPreviewQuestions(transformedData);
            if (response.status === 200) {
                setQuestionList(response.data.preview);
                setErrorMessage('');
                const questionIds = extractQuestionIdsFromCategories(response.data.preview);
                setQuestionArray(questionIds);
            }
        } catch (error) {
            setErrorMessage(adminQuestionnaireErrorCodes(error.response?.data?.errorCode));
        }
    };

    const extractQuestionIdsFromQuestions = (questions) => {
        return questions.map(question => question.id);
    };

    const extractQuestionIdsFromLevels = (levels) => {
        return levels.flatMap(level => extractQuestionIdsFromQuestions(level.questions));
    };

    const extractQuestionIdsFromCategories = (categories) => {
        return categories.flatMap(category => extractQuestionIdsFromLevels(category.levels));
    };

    const handleClick = () => {
        navigate(link || "/dashboard/examAdd");
    };

    const handleQuestionnaire = (id, name) => {
        setQuestionnaireData({ id, name });
    };

    const handleGenerate = async () => {
        const transformedData = { questionnaireName: name, questionArray };
        try {
            const response = isEditMode
                ? await adminServices.adminQuestionnaireUpdate(id, transformedData)
                : await adminServices.adminQuestionnaireCreate(transformedData);
    
            if (response.status === 200) {
                const questionnaireData = await response.data.questionnaire;
                setSuccessMessage(isEditMode ? 'Questionnaire Updated Successfully' : 'Questionnaire Generated Successfully');        
                setToastOpen(true); 
                setTimeout(() => {
                    if (questionnaireData) {
                        const id = questionnaireData.id;
                        const name = questionnaireData.questionnaireName;
    
                        if (from === 'examAdd') {
                            handleQuestionnaire(id, name);
                            handleClick();
                        } else {
                            navigate('/dashboard/questionnaireList');
                        }
                    }
                }, 500); 
            }
        } catch (error) {
            setErrorMessage(adminQuestionnaireErrorCodes(error?.response?.data?.errorCode));
        }
    };

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchEditDetails(id);
        }
        fetchCategoryDetails();
        fetchCategoryQuestionCount();
    }, [id]);
    return (
        <>
            <Flex alignItems="center" justifyContent="center" bg="gray.100">
                <Box p="10" width={{ base: "100%", md: "100%" }} bg="white" boxShadow="lg" borderRadius="md">
                    <Formik
                        enableReinitialize
                        initialValues={{
                            questionnaireName: formikValues.questionnaireName,
                            ...formikValues.categories.reduce((acc, _, index) => {
                                acc[`category_${index}`] = formikValues.categories[index].category || "";
                                acc[`level_${index}_1`] = formikValues.categories[index].level1 || "";
                                acc[`level_${index}_2`] = formikValues.categories[index].level2 || "";
                                acc[`level_${index}_3`] = formikValues.categories[index].level3 || "";
                                return acc;
                            }, {}),
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleAddDetails}
                    >
                        {({ setFieldValue, errors }) => (
                            <Form>
                                {errorMessage && (
                                    <Box textAlign="center" mb={4}>
                                        <AlertBox message={errorMessage} onClose={() => setErrorMessage('')} />
                                    </Box>
                                )}
                                <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                                    <GridItem colSpan={12}>
                                        <Text fontSize="3xl" fontFamily="Arial, sans-serif" textAlign="left" mb={4} mt={5}>
                                            {isEditMode ? "Edit Questionnaire" : "Add Questionnaire"}
                                        </Text>
                                        <Stack spacing={6} mt={8}>
                                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                                                <Box>
                                                    <Field name="questionnaireName">
                                                        {({ field, form }) => (
                                                            <TextBox field={field}
                                                                onChange={(e) => {
                                                                    field.onChange(e); 
                                                                    setName(e.target.value); 
                                                                }} form={form} type="text" label={'Questionnaire Name'} />
                                                        )}
                                                    </Field>
                                                </Box>
                                            </Grid>
                                            {dynamicFields.map((_, index) => (
                                                <Grid templateColumns={{ base: "1fr", md: "3fr 1fr 1fr 1fr auto" }} gap={6} alignItems="center" key={index}>
                                                    <Box mt="3">
                                                        <Field name={`category_${index}`} mb="2">
                                                            {({ field }) => {
                                                                const selectedCategory = categoryOptions.find(option => option.id === field.value);

                                                                return (
                                                                    <SelectBox
                                                                        options={categoryOptions}
                                                                        optionValue={field.value}
                                                                        placeholder={selectedCategory ? selectedCategory.value : "Select a Section"}
                                                                        width="100%"
                                                                        onSelect={(option) => {
                                                                            setFieldValue(`category_${index}`, option.id);
                                                                        }}
                                                                    />
                                                                );
                                                            }}
                                                        </Field>
                                                        {errors[`category_${index}`] && (
                                                            <Text color="red.500" fontSize="sm">{errors[`category_${index}`]}</Text>
                                                        )}
                                                    </Box>
                                                    <Box>
                                                        <Field name={`level_${index}_1`}>
                                                            {({ field, form }) => (
                                                                <TextBox field={field} form={form} type="number" title="Easy Questions" placeholder={"Easy Questions"} />
                                                            )}
                                                        </Field>
                                                    </Box>
                                                    <Box>
                                                        <Field name={`level_${index}_2`}>
                                                            {({ field, form }) => (
                                                                <TextBox field={field} form={form} type="number" title="Medium Questions" placeholder={"Medium Questions"} />
                                                            )}
                                                        </Field>
                                                    </Box>
                                                    <Box>
                                                        <Field name={`level_${index}_3`}>
                                                            {({ field, form }) => (
                                                                <TextBox field={field} form={form} type="number" title="Hard Questions" placeholder={"Hard Questions"} />
                                                            )}
                                                        </Field>
                                                    </Box>
                                                    <IconButton
                                                        aria-label="Remove field"
                                                        icon={<MinusIcon />}
                                                        isDisabled={index === 0}
                                                        title="Remove section"
                                                        onClick={() => removeDynamicField(index, setFieldValue)}
                                                        ml={2}
                                                        mt={{ base: 2, md: 0 }}
                                                    />
                                                </Grid>
                                            ))}
                                            <Flex mt={4} justifyContent="left">
                                                <ClickButton label=" + Add Section" title='Add more section' onClick={addDynamicField} />
                                            </Flex>
                                        </Stack>
                                        <Flex mt={4} justifyContent="center">
                                            <SubmitButton
                                                type="submit"
                                                title='Preview Questions'
                                                colorScheme="green"
                                                textColor="white"
                                                label="Fetch Questions"
                                                _hover={{ bg: "green" }}
                                            />
                                        </Flex>
                                    </GridItem>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Flex >
            <br />
            <Box
                p="10"
                width={{ base: "100%", md: "100%" }}
                bg="white"
                boxShadow="lg"
                borderRadius="md"
            >
                <Grid>
                    <GridItem>
                        <QuestionPaperView
                        questionnaireName="Questionnaire"
                            questionnaireId={id}
                            data={questionList}
                        />
                        <Box>
                            <Flex mt={4} justifyContent="flex-end">
                                <ClickButton
                                    onClick={handleGenerate}
                                    colorScheme="green"
                                    textColor="white"
                                    label={isEditMode ? "Update" : "Generate"}
                                    title="Generate questionnaire"
                                />
                            </Flex>
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
            {
                toastOpen && (
                    <SuccessToast
                        show={toastOpen}
                        onClose={() => setToastOpen(false)}
                        message={successMessage}
                    />
                )
            }
        </>
    );
}

export default QuestionnaireAdd;