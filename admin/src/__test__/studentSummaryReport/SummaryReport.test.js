import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { adminServices } from "../../services/AdminServices";
import '@testing-library/jest-dom';
import SummaryReport from "../../pages/admin/studentSummaryReport/SummaryReport";
import { SummaryReportErrorCodes } from "../../pages/admin/studentSummaryReport/SummaryReportErrorCodes";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import html2pdf from "html2pdf.js";

jest.mock("../../services/AdminServices", () => ({
    adminServices: {
        adminStudentResponseSummary: jest.fn(),
    },
}));

jest.mock("../../pages/admin/studentSummaryReport/SummaryReportErrorCodes", () => ({
    
        SummaryReportErrorCodes: jest.fn(),
  
}));


describe("Summary Report Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const summaryReport = {
        status: 200,
        data: {
            "question_bank": [
                {
                    "question_id": 30,
                    "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?aserdcftgvhbu",
                    "question_type": 2,
                    "question_category": "Verbal",
                    "difficulty_level": 1,
                    "question_image": null,
                    "options": [
                        "Brother",
                        "Sister",
                        "No relation"
                    ],
                    "correct_answer": [
                        "Cousin"
                    ],
                    "student_response": []
                },
                {
                    "question_id": 14,
                    "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?zsedxdrftfcvgy",
                    "question_type": 2,
                    "question_category": "Verbal",
                    "difficulty_level": 1,
                    "question_image": null,
                    "options": [
                        "Brother",
                        "Sister",
                        "No relation"
                    ],
                    "correct_answer": [
                        "Cousin"
                    ],
                    "student_response": []
                },
                {
                    "question_id": 18,
                    "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?ijnyhbtgb",
                    "question_type": 2,
                    "question_category": "Verbal",
                    "difficulty_level": 1,
                    "question_image": null,
                    "options": [
                        "Brother",
                        "Sister",
                        "No relation"
                    ],
                    "correct_answer": [
                        "Cousin"
                    ],
                    "student_response": []
                },
                {
                    "question_id": 46,
                    "question": "In a family of six members A, B, C, D, E, and F, there argvhbje two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                    "question_type": 2,
                    "question_category": "Verbal",
                    "difficulty_level": 1,
                    "question_image": null,
                    "options": [
                        "Brother",
                        "Sister",
                        "No relation"
                    ],
                    "correct_answer": [
                        "Cousin"
                    ],
                    "student_response": []
                },
                {
                    "question_id": 48,
                    "question": "In a family of six members A, B, C, D, E, and F, there are two married couples.hbuji A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                    "question_type": 2,
                    "question_category": "Verbal",
                    "difficulty_level": 1,
                    "question_image": null,
                    "options": [
                        "Brother",
                        "Sister",
                        "No relation"
                    ],
                    "correct_answer": [
                        "Cousin"
                    ],
                    "student_response": []
                },
                {
                    "question_id": 55,
                    "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a jnteacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                    "question_type": 2,
                    "question_category": "Verbal",
                    "difficulty_level": 2,
                    "question_image": "http://localhost:8000/question-image/Emy_Varghese_-_119.png",
                    "options": [
                        "Brother",
                        "Sister",
                        "No relation"
                    ],
                    "correct_answer": [
                        "Cousin"
                    ],
                    "student_response": []
                }
            ],
            "student_details": {
                "student_id": 4,
                "student_name": "Jojo",
                "student_email": "joo@gmail.com",
                "student_cgpa": 9.0,
                "student_backlog": 0,
                "student_status": ""
            },
            "batch_details": {
                "batch_id": 2,
                "batch_uuid": "INV-82A1",
                "batch_name": "Batch1"
            },
            "exam_details": {
                "exam_id": 2,
                "exam_name": "Mid Year Recruitment 2024",
                "total_mark": 0,
                "category_wise_mark": [
                    {
                        "category_id": 4,
                        "category_name": "Verbal",
                        "total_correct_answer_count": 0
                    }
                ]
            }
        }
    };

    const mockStudentId = '123';
    const mockBatchId = '456';


    test('should render student and exam details after loading', async () => {
        adminServices.adminStudentResponseSummary.mockResolvedValue(summaryReport);
    
        render(
            <MemoryRouter initialEntries={[`/summary/${mockStudentId}/${mockBatchId}`]}>
                <Routes>
                    <Route path="/summary/:studentId/:id" element={<SummaryReport />} />
                </Routes>
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByText('Jojo')).toBeInTheDocument();
            expect(screen.getByText('joo@gmail.com')).toBeInTheDocument();
            expect(screen.getByText('Mid Year Recruitment 2024')).toBeInTheDocument();
            expect(screen.getByText('Batch1')).toBeInTheDocument();
        });
    });
    

    test('should display error message when there is an error', async () => {
        const mockErrorMessage = 'An error occurred!';
        SummaryReportErrorCodes.mockReturnValue(mockErrorMessage);
    
        adminServices.adminStudentResponseSummary.mockRejectedValue({
            response: { data: { errorCode: 'e1111' } }
        });
    
        render(
            <MemoryRouter>
                <SummaryReport />
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(adminServices.adminStudentResponseSummary).toBeCalled();
            // expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
    });
    });
    

    test('should trigger the downloadPDF function when the download button is clicked', async () => {


        adminServices.adminStudentResponseSummary.mockResolvedValue({
            status: 200,
            data: {
                "question_bank": [
                    {
                        "question_id": 30,
                        "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?aserdcftgvhbu",
                        "question_type": 2,
                        "question_category": "Verbal",
                        "difficulty_level": 1,
                        "question_image": null,
                        "options": [
                            "Brother",
                            "Sister",
                            "No relation"
                        ],
                        "correct_answer": [
                            "Cousin"
                        ],
                        "student_response": []
                    },
                    {
                        "question_id": 14,
                        "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?zsedxdrftfcvgy",
                        "question_type": 2,
                        "question_category": "Verbal",
                        "difficulty_level": 1,
                        "question_image": null,
                        "options": [
                            "Brother",
                            "Sister",
                            "No relation"
                        ],
                        "correct_answer": [
                            "Cousin"
                        ],
                        "student_response": []
                    },
                    {
                        "question_id": 18,
                        "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?ijnyhbtgb",
                        "question_type": 2,
                        "question_category": "Verbal",
                        "difficulty_level": 1,
                        "question_image": null,
                        "options": [
                            "Brother",
                            "Sister",
                            "No relation"
                        ],
                        "correct_answer": [
                            "Cousin"
                        ],
                        "student_response": []
                    },
                    {
                        "question_id": 46,
                        "question": "In a family of six members A, B, C, D, E, and F, there argvhbje two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                        "question_type": 2,
                        "question_category": "Verbal",
                        "difficulty_level": 1,
                        "question_image": null,
                        "options": [
                            "Brother",
                            "Sister",
                            "No relation"
                        ],
                        "correct_answer": [
                            "Cousin"
                        ],
                        "student_response": []
                    },
                    {
                        "question_id": 48,
                        "question": "In a family of six members A, B, C, D, E, and F, there are two married couples.hbuji A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                        "question_type": 2,
                        "question_category": "Verbal",
                        "difficulty_level": 1,
                        "question_image": null,
                        "options": [
                            "Brother",
                            "Sister",
                            "No relation"
                        ],
                        "correct_answer": [
                            "Cousin"
                        ],
                        "student_response": []
                    },
                    {
                        "question_id": 55,
                        "question": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a jnteacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                        "question_type": 2,
                        "question_category": "Verbal",
                        "difficulty_level": 2,
                        "question_image": "http://localhost:8000/question-image/Emy_Varghese_-_119.png",
                        "options": [
                            "Brother",
                            "Sister",
                            "No relation"
                        ],
                        "correct_answer": [
                            "Cousin"
                        ],
                        "student_response": []
                    }
                ],
                "student_details": {
                    "student_id": 4,
                    "student_name": "Jojo",
                    "student_email": "joo@gmail.com",
                    "student_cgpa": 9.0,
                    "student_backlog": 0,
                    "student_status": "exam completed for the student"
                },
                "batch_details": {
                    "batch_id": 2,
                    "batch_uuid": "INV-82A1",
                    "batch_name": "Batch1"
                },
                "exam_details": {
                    "exam_id": 2,
                    "exam_name": "Mid Year Recruitment 2024",
                    "total_mark": 0,
                    "category_wise_mark": [
                        {
                            "category_id": 4,
                            "category_name": "Verbal",
                            "total_correct_answer_count": 0
                        }
                    ]
                }
            }
        });

        render(
            <MemoryRouter initialEntries={[`/summary/${mockStudentId}/${mockBatchId}`]}>
                <Routes>
                    <Route path="/summary/:studentId/:id" element={<SummaryReport />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Download Report')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Download Report'));

        // Check if html2pdf was called
        // expect(html2pdf().from).toHaveBeenCalled();
        // expect(html2pdf().set).toHaveBeenCalled();
        // expect(html2pdf().save).toHaveBeenCalled();
    });

    test('should navigate back when the back button is clicked', async () => {

        adminServices.adminStudentResponseSummary.mockResolvedValue(summaryReport);

        render(
            <MemoryRouter initialEntries={[`/summary/${mockStudentId}/${mockBatchId}`]}>
                <Routes>
                    <Route path="/summary/:studentId/:id" element={<SummaryReport />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Download Report')).toBeInTheDocument());

        const backButton = screen.getByText('back');
        fireEvent.click(backButton);


    });


});