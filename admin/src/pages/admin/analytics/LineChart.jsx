import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { adminServices } from '../../../services/AdminServices';
import LoadingSpinner from '../../../components/spinner/Spinner';
import SelectBox from "../../../components/select/SelectBox";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sidebarColor } from '../../../utils/Strings';

const QuestionnaireGraph = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [sectionsData, setSectionsData] = useState([]);
    const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleQuestionnaireChange = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
    };

    const fetchQuestionnairesList = async () => {
        setLoadingQuestionnaires(true);
        try {
            const response = await adminServices.questionnaireLists();
            if (response.status === 200) {
                const questionnaireOptions = response?.data?.results.map(
                    (questionnaire) => ({
                        id: questionnaire.id,
                        value: questionnaire.questionnaire_name,
                    })
                );
                setQuestionnaires(questionnaireOptions);
                // Automatically select the first questionnaire if available
                if (questionnaireOptions.length > 0) {
                    setSelectedQuestionnaire(questionnaireOptions[questionnaireOptions.length - 1]);
                }
            }
            setLoadingQuestionnaires(false);
        } catch (error) {
            setErrorMessage('Failed to load questionnaires');
            setLoadingQuestionnaires(false);
        }
    };

    const fetchSectionsForQuestionnaire = async () => {
        if (!selectedQuestionnaire) return;
        setLoadingSections(true);
        try {
            const response = await adminServices.adminExamQuestionnaireAnalytics(selectedQuestionnaire.id);
            if (response.status === 200) {
                setSectionsData(response.data.questionnaire_analytics);
            }
            setLoadingSections(false);
        } catch (error) {
            setErrorMessage('Failed to load section data');
            setLoadingSections(false);
        }
    };

    useEffect(() => {
        fetchQuestionnairesList();
    }, []);

    // Fetch sections only after selected questionnaire has been set
    useEffect(() => {
        if (selectedQuestionnaire) {
            fetchSectionsForQuestionnaire();
        }
    }, [selectedQuestionnaire]);

    const chartData = sectionsData.map((section) => ({
        section_name: section.category_name,
        success_rate: section.success_rate,
    }));

    return (
        <Box mb={7} mx="auto" width="100%" height="700px">
            <Box mb={4}>
                <Text as="b" fontSize="24px" ml={5} mb={20} >
                    Questionnaire Success Rate Graph
                </Text>
            </Box>

            {loadingQuestionnaires && (
                <Box textAlign="center">
                    <LoadingSpinner />
                </Box>
            )}

            {loadingSections && !loadingQuestionnaires && !selectedQuestionnaire && (
                <Box textAlign="center">
                    <LoadingSpinner />
                </Box>
            )}

            {errorMessage && (
                <Box textAlign="center" mb={4}>
                    <Text textAlign="center">{errorMessage}</Text>
                </Box>
            )}

            <Box mb={7} align="center" >
                <SelectBox
                    placeholder={selectedQuestionnaire ? selectedQuestionnaire.value : 'Select'}
                    options={questionnaires}
                    onSelect={handleQuestionnaireChange}
                    testId="questionnaire"
                />
            </Box>

            {selectedQuestionnaire && !loadingSections && !loadingQuestionnaires && !errorMessage && (
                <Box p={15}>
                    {sectionsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                                <XAxis
                                    dataKey="section_name"
                                    dy={10}
                                    label={{
                                        value: 'Section Name',
                                        position: 'insideBottom',
                                        offset: -1,
                                        dy:5
                                        // fontSize: 14,
                                    }}
                                />

                                <YAxis
                                    angle={-45}
                                    dy={10}
                                    label={{
                                        value: 'Success Rate',
                                        angle: -90,
                                        position: 'insideLeft',
                                    }}
                                />
                                <Tooltip />
                             
                                <Line
                                    type="monotone"
                                    dataKey="success_rate"
                                    stroke={sidebarColor}
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Text color="gray.500" mt={4}>
                            No success rate data available for this questionnaire.
                        </Text>
                    )}
                </Box>
                
            )}

            {!selectedQuestionnaire && !loadingQuestionnaires && !loadingSections && !errorMessage && (
                <Text textAlign="center">
                    Select a questionnaire to view the success rate graph.
                </Text>
            )}
        </Box>
    );
};

export default QuestionnaireGraph;
