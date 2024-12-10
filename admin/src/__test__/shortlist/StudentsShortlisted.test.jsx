import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentsShortlisted from "../../pages/admin/shortlist/StudentsShortlisted";
import { adminServices } from "../../services/AdminServices";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';


jest.mock("../../services/AdminServices", () => ({
    adminServices: {
        adminQuestionnaireDetailView: jest.fn(),
        adminListAllWrittenStudents: jest.fn(),
        adminSendShortlist: jest.fn(),
        adminShortlistCriteria: jest.fn()
    },
}));

const criteria = {
    status: 200,
    data: {
        "examId": 2,
        "examName": "Mid Year Recruitment 2024",
        "generalCutOff": null,
        "categoryCriteria": [],
        "shortlistedStudents": []
    }
}

const shortlistedstudents = {
    status: 200,
    data: {
        "shortlisted_students": [
            {
                "studentId": 4,
                "studentName": "Jojo",
                "institution": "Nirmala",
                "batchId": 2,
                "batchName": "Batch1",
                "mark": 0,
                "studentStatus": 5,
                "matchedCategories": [
                    {
                        "categoryName": "Verbal",
                        "categoryId": 4,
                        "questionLevel": 1,
                        "scoreAcquired": 0
                    }
                ],
                "responses": [
                    {
                        "category_name": "Verbal",
                        "category_id": 4,
                        "total": 0
                    }
                ]
            },
            {
                "studentId": 5,
                "studentName": "Emy Varghese",
                "institution": "Nirmala",
                "batchId": 2,
                "batchName": "Batch1",
                "mark": 1,
                "studentStatus": 2,
                "matchedCategories": [
                    {
                        "categoryName": "Verbal",
                        "categoryId": 4,
                        "questionLevel": 1,
                        "scoreAcquired": 1
                    }
                ],
                "responses": [
                    {
                        "category_name": "Verbal",
                        "category_id": 4,
                        "total": 1
                    }
                ]
            }
        ]
    }
}

const questionnaires = {
    status: 200,
    data: {
        "preview": [
            {
                "category": "Verbal",
                "categoryId": 4,
                "levels": [
                    {
                        "level": 1,
                        "questions": [
                            {
                                "id": 30,
                                "value": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?aserdcftgvhbu",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 120,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 118,
                                        "value": "Sister",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 117,
                                        "value": "Brother",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 119,
                                        "value": "No relation",
                                        "isCorrect": false
                                    }
                                ]
                            },
                            {
                                "id": 14,
                                "value": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?zsedxdrftfcvgy",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 56,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 53,
                                        "value": "Brother",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 54,
                                        "value": "Sister",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 55,
                                        "value": "No relation",
                                        "isCorrect": false
                                    }
                                ]
                            },
                            {
                                "id": 18,
                                "value": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?ijnyhbtgb",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 72,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 71,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 69,
                                        "value": "Brother",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 70,
                                        "value": "Sister",
                                        "isCorrect": false
                                    }
                                ]
                            },
                            {
                                "id": 46,
                                "value": "In a family of six members A, B, C, D, E, and F, there argvhbje two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 184,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 181,
                                        "value": "Brother",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 183,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 182,
                                        "value": "Sister",
                                        "isCorrect": false
                                    }
                                ]
                            },
                            {
                                "id": 48,
                                "value": "In a family of six members A, B, C, D, E, and F, there are two married couples.hbuji A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 192,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 191,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 190,
                                        "value": "Sister",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 189,
                                        "value": "Brother",
                                        "isCorrect": false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "level": 2,
                        "questions": [
                            {
                                "id": 55,
                                "value": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a jnteacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                                "type": 2,
                                "questionImage": "http://localhost:8000/question-image/Emy_Varghese_-_119.png",
                                "options": [
                                    {
                                        "id": 220,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 219,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 218,
                                        "value": "Sister",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 217,
                                        "value": "Brother",
                                        "isCorrect": false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "isAssigned": true
    }
};

describe('StudentsShortlisted', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing and shows loading state initially', () => {
        render(
            <Router>
                <Routes>
                    <Route path="/" element={<StudentsShortlisted />} />
                </Routes>
            </Router>
        );

    });

    test('fetches categories and displays them', async () => {
        // Mock the response for fetching categories
        adminServices.adminQuestionnaireDetailView.mockResolvedValue(questionnaires);
        adminServices.adminListAllWrittenStudents.mockResolvedValue(shortlistedstudents);
        adminServices.adminShortlistCriteria.mockResolvedValue(criteria);


        render(
            <Router>
                <Routes>
                    <Route path="/" element={<StudentsShortlisted />} />
                </Routes>
            </Router>
        );

        // Wait for the categories to load
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireDetailView).toHaveBeenCalled();
            expect(adminServices.adminListAllWrittenStudents).toHaveBeenCalled();
            expect(adminServices.adminShortlistCriteria).toHaveBeenCalled();
        }
        );
        waitFor(() => {
            expect(screen.getByText('Jojo')).toBeInTheDocument();

        })
    });

    test('navigates back when back button is clicked', async () => {
        render(
            <Router>
                <Routes>
                    <Route path="/" element={<StudentsShortlisted />} />
                </Routes>
            </Router>
        );

        // Simulate clicking the "back" button
        const backButton = screen.getByText('back');
        fireEvent.click(backButton);


    });

    test('View detail', async () => {
        // Mock the response for fetching categories
        adminServices.adminQuestionnaireDetailView.mockResolvedValue(questionnaires);
        adminServices.adminListAllWrittenStudents.mockResolvedValue(shortlistedstudents);
        adminServices.adminShortlistCriteria.mockResolvedValue(criteria);

        render(
            <Router>
                <Routes>
                    <Route path="/" element={<StudentsShortlisted />} />
                </Routes>
            </Router>
        );

        // Wait for the categories and data to load, then assert
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireDetailView).toHaveBeenCalled();
            expect(adminServices.adminListAllWrittenStudents).toHaveBeenCalled();
            expect(adminServices.adminShortlistCriteria).toHaveBeenCalled();
        });

        // Wait for the elements to appear and verify the presence
        await waitFor(() => {
            expect(screen.getAllByText('Nirmala')[0]).toBeInTheDocument();
            const view = screen.getAllByTitle('View Detail')[0];
            expect(view).toBeInTheDocument();
            fireEvent.click(view);

            const viewClose = screen.getAllByTitle('close')[0];
            expect(viewClose).toBeInTheDocument();
            fireEvent.click(viewClose);
        });
    });

    test('View Report and displays them', async () => {
        // Mock the response for fetching categories
        adminServices.adminQuestionnaireDetailView.mockResolvedValue(questionnaires);
        adminServices.adminListAllWrittenStudents.mockResolvedValue(shortlistedstudents);
        adminServices.adminShortlistCriteria.mockResolvedValue(criteria);

        render(
            <Router>
                <Routes>
                    <Route path="/" element={<StudentsShortlisted />} />
                </Routes>
            </Router>
        );

        // Wait for the categories and data to load, then assert
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireDetailView).toHaveBeenCalled();
            expect(adminServices.adminListAllWrittenStudents).toHaveBeenCalled();
            expect(adminServices.adminShortlistCriteria).toHaveBeenCalled();
        });

        // Wait for the elements to appear and verify the presence
        await waitFor(() => {
            expect(screen.getAllByText('Nirmala')[0]).toBeInTheDocument();
            const view = screen.getAllByTitle('View Report')[0];
            expect(view).toBeInTheDocument();
            fireEvent.click(view);

        });
    });


    // test('displays error message when API call fails for categories', async () => {
    //   adminServices.adminQuestionnaireDetailView.mockRejectedValue(new Error('API Error'));

    //   render(
    //     <Router>
    //       <Routes>
    //         <Route path="/" element={<StudentsShortlisted />} />
    //       </Routes>
    //     </Router>
    //   );

    //   // Wait for the error message
    //   await waitFor(() => screen.getByText('Error fetching categories'));

    //   expect(screen.getByText('Error fetching categories')).toBeInTheDocument();
    // });

    test('handles input changes correctly', async () => {

        adminServices.adminQuestionnaireDetailView.mockResolvedValue(questionnaires);
        adminServices.adminListAllWrittenStudents.mockResolvedValue(shortlistedstudents);
        adminServices.adminShortlistCriteria.mockResolvedValue(criteria);

        render(
            <Router>
                <Routes>
                    <Route path="/" element={<StudentsShortlisted />} />
                </Routes>
            </Router>
        );

        // Wait for the categories and data to load, then assert
        await waitFor(() => {
            expect(adminServices.adminQuestionnaireDetailView).toHaveBeenCalled();
            expect(adminServices.adminListAllWrittenStudents).toHaveBeenCalled();
            expect(adminServices.adminShortlistCriteria).toHaveBeenCalled();
        });
        waitFor(() => {
            const input = screen.getByPlaceholderText('Hard (max 3)');
            fireEvent.change(input, { target: { value: '2' } });

            // Check if the value is updated
            expect(input.value).toBe('2');
        })

    });

    // test('submits form and handles success', async () => {
    //   // Mock the API response for submitting the shortlist
    //   adminServices.adminSendShortlist.mockResolvedValue({
    //     status: 200,
    //     data: { shortlisted_students: [] },
    //   });

    //   const mockCategories = [
    //     {
    //       categoryId: 1,
    //       category: 'Math',
    //       levels: [
    //         { level: 1, questions: [{ id: 1 }] },
    //         { level: 2, questions: [{ id: 1 }, { id: 2 }] },
    //         { level: 3, questions: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    //       ],
    //     },
    //   ];

    //   adminServices.adminQuestionnaireDetailView.mockResolvedValue({
    //     status: 200,
    //     data: { preview: mockCategories },
    //   });

    //   render(
    //     <Router>
    //       <Routes>
    //         <Route path="/" element={<StudentsShortlisted />} />
    //       </Routes>
    //     </Router>
    //   );

    //   // Wait for categories to load
    //   await waitFor(() => screen.getByText('Math'));

    //   // Set cutoff value
    //   fireEvent.change(screen.getByPlaceholderText('Hard (max 3)'), { target: { value: '1' } });

    //   // Click apply filter button
    //   const applyButton = screen.getByText('Apply Filter');
    //   fireEvent.click(applyButton);

    //   // Wait for the success message or API result
    //   await waitFor(() => screen.getByText('Email sent successfully!'));

    //   expect(screen.getByText('Email sent successfully!')).toBeInTheDocument();
    // });

    // test('opens and closes the student detail modal', async () => {
    //   render(
    //     <Router>
    //       <Routes>
    //         <Route path="/" element={<StudentsShortlisted />} />
    //       </Routes>
    //     </Router>
    //   );

    //   // Check if modal is initially closed
    //   expect(screen.queryByText('Profile View')).toBeNull();

    //   // Open modal
    //   const viewButton = screen.getByText('View Detail');
    //   fireEvent.click(viewButton);

    //   // Wait for modal to open
    //   await waitFor(() => screen.getByText('Profile View'));

    //   expect(screen.getByText('Profile View')).toBeInTheDocument();

    //   // Close modal
    //   const closeButton = screen.getByText('Close');
    //   fireEvent.click(closeButton);

    //   await waitFor(() => expect(screen.queryByText('Profile View')).toBeNull());
    // });


});
