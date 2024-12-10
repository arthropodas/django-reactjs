import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminExamsList from "../../pages/admin/examManagement/ExamList";
import { adminServices } from "../../services/AdminServices";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/AdminServices.js', () => ({
  adminServices: {
    adminListExams: jest.fn(),
    adminDeleteExam: jest.fn(),
    questionnaireLists: jest.fn(),

  },
}));



describe("AdminExamsList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExams = {
    status: 200,
    data: {
      "count": 3,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 3,
          "exam_location": {
            "id": 3,
            "location_name": "Nirmala 1st floor"
          },
          "questionnaire": {
            "id": 2,
            "questionnaire_name": "Paper 2"
          },
          "batches": [
            {
              "id": 3,
              "uuid": "INV-57B8",
              "batch_name": "Batch1",
              "count_of_students": 7,
              "status": true,
              "batch_status": 1
            }
          ],
          "exam_name": "English exam",
          "exam_date": "2024-11-05",
          "exam_time": "19:41:00",
          "exam_duration": 50,
          "status": 5,
          "created_at": "2024-11-04T12:12:14.509055Z",
          "updated_at": "2024-11-04T12:12:24.177000Z",
          "status_of_exam": 6,
          "cut_of_mark": null,
          "is_pool": true
        },
        {
          "id": 2,
          "exam_location": {
            "id": 2,
            "location_name": "rewwefcx"
          },
          "questionnaire": {
            "id": 1,
            "questionnaire_name": "Paper 1"
          },
          "batches": [
            {
              "id": 2,
              "uuid": "INV-82A1",
              "batch_name": "Batch1",
              "count_of_students": 2,
              "status": true,
              "batch_status": 2
            }
          ],
          "exam_name": "Mid Year Recruitment 2024",
          "exam_date": "2024-11-02",
          "exam_time": "16:49:00",
          "exam_duration": 5,
          "status": 1,
          "created_at": "2024-11-01T11:19:02.864919Z",
          "updated_at": "2024-11-06T07:13:06.000139Z",
          "status_of_exam": 2,
          "cut_of_mark": null,
          "is_pool": true
        },
        {
          "id": 1,
          "exam_location": {
            "id": 1,
            "location_name": "Nirmala"
          },
          "questionnaire": {
            "id": 1,
            "questionnaire_name": "Paper 1"
          },
          "batches": [
            {
              "id": 1,
              "uuid": "INV-31E0",
              "batch_name": "Batch1",
              "count_of_students": 3,
              "status": true,
              "batch_status": 1
            }
          ],
          "exam_name": "QQQQQQQQQQQQQQQQQQQQUUUUUUUUUUUUUUUUXXXXXXXXXXXXXXXXXXXXXXXTTTTTTTTTTTTTTTT",
          "exam_date": "2024-11-01",
          "exam_time": "13:46:00",
          "exam_duration": 15,
          "status": 1,
          "created_at": "2024-11-01T06:17:06.178593Z",
          "updated_at": "2024-11-06T11:59:03.962534Z",
          "status_of_exam": 2,
          "cut_of_mark": 2.0,
          "is_pool": false
        }
      ]
    }
  };

  const mockQuestionnaire = {
    status: 200,
    data:
    {
      "count": 2,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 2,
          "questionnaire_name": "Paper 2",
          "status": true,
          "created_at": "2024-11-04T12:11:19.827159Z",
          "updated_at": "2024-11-20T03:34:42.795427Z",
          "total_questions": 9
        },
        {
          "id": 1,
          "questionnaire_name": "Paper 1",
          "status": true,
          "created_at": "2024-11-01T06:16:08.043700Z",
          "updated_at": "2024-11-20T03:37:40.520016Z",
          "total_questions": 6
        }
      ]
    }
  };

  
  test("renders AdminExamsList component", async () => {
    render(
      <MemoryRouter>
        <AdminExamsList />
      </MemoryRouter>
    );
    waitFor(() => {
      expect(screen.getByText(/Exam Management/i)).toBeInTheDocument();

    })

  });

  test("fetches and displays exam data correctly", async () => {
    
    adminServices.adminListExams.mockResolvedValueOnce(mockExams);
    render(
      <MemoryRouter>
        <AdminExamsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListExams).toHaveBeenCalled();
      expect(screen.getByText("Mid Year Recruitment 2024")).toBeInTheDocument();
      const navigateButton = screen.getAllByTitle('View Detail')[0];
      fireEvent.click(navigateButton);
      const firstButton = screen.getByTitle('First');
      fireEvent.click(firstButton);
      const lastButton = screen.getByTitle('Last');
      fireEvent.click(lastButton);
      const nextButton = screen.getByTitle('Next');
      fireEvent.click(nextButton);
      const prevButton = screen.getByTitle('Previous');
      fireEvent.click(prevButton);
    });

  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and schedule", async () => {
    
    adminServices.adminListExams.mockResolvedValueOnce(mockExams);
    render(
      <MemoryRouter>
        <AdminExamsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListExams).toHaveBeenCalled();
      expect(screen.getByText("Mid Year Recruitment 2024")).toBeInTheDocument();
      const scheduleButton = screen.getByTitle('schedule');
      fireEvent.click(scheduleButton);
     
      const closeButton = screen.getByTitle('close');
      fireEvent.click(closeButton);
    });

  });



  test("handles form submission and fetches filtered data", async () => {
   
    adminServices.adminListExams.mockResolvedValueOnce(mockExams);
    adminServices.questionnaireLists.mockResolvedValueOnce(mockQuestionnaire);

    render(
      <MemoryRouter>
        <AdminExamsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListExams).toHaveBeenCalled();
      expect(adminServices.questionnaireLists).toHaveBeenCalled();
    });
     waitFor(() => {
      const institutionSelect = screen.getByTitle("Select Questionnaire");
      // const questionnaireSelect = screen.getByText("questionnaire");
      fireEvent.click(institutionSelect);
      expect(screen.getByText("Paper 1")).toBeInTheDocument();
      fireEvent.change(institutionSelect, { target: { value: "Paper 1" } });

      const yearSelect = screen.getByText("Select year");
      fireEvent.change(yearSelect, { target: { value: "2024" } });

      const submitButton = screen.getByTitle('filter'); // Adjust if necessary
      fireEvent.click(submitButton);

      expect(screen.getByTitle('Exam Search')).toBeInTheDocument();
      const searchBar = screen.getByPlaceholderText("Enter Name")
      fireEvent.change(searchBar, { target: { value: "English" } })
      const searchButton = screen.getByTestId('Search');
      fireEvent.click(searchButton);

      expect(screen.getByText("Mid Year Recruitment 2024")).toBeInTheDocument();

    });
     waitFor(() => {
      expect(adminServices.adminListExams).toHaveBeenCalledWith(1, "", "English");
    })
    screen.debug();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });




  // test("handles form submission - search", async () => {
  //   // Mock data for exams
  //   const mockExams = {
  //     status: 200,
  //     data: {
  //       "count": 3,
  //       "next": null,
  //       "previous": null,
  //       "results": [
  //         {
  //           "id": 3,
  //           "exam_location": {
  //             "id": 3,
  //             "location_name": "Nirmala 1st floor"
  //           },
  //           "questionnaire": {
  //             "id": 2,
  //             "questionnaire_name": "Paper 2"
  //           },
  //           "batches": [
  //             {
  //               "id": 3,
  //               "uuid": "INV-57B8",
  //               "batch_name": "Batch1",
  //               "count_of_students": 7,
  //               "status": true,
  //               "batch_status": 1
  //             }
  //           ],
  //           "exam_name": "English exam",
  //           "exam_date": "2024-11-05",
  //           "exam_time": "19:41:00",
  //           "exam_duration": 50,
  //           "status": 1,
  //           "created_at": "2024-11-04T12:12:14.509055Z",
  //           "updated_at": "2024-11-04T12:12:24.177000Z",
  //           "status_of_exam": 1,
  //           "cut_of_mark": null,
  //           "is_pool": true
  //         },
  //         {
  //           "id": 2,
  //           "exam_location": {
  //             "id": 2,
  //             "location_name": "rewwefcx"
  //           },
  //           "questionnaire": {
  //             "id": 1,
  //             "questionnaire_name": "Paper 1"
  //           },
  //           "batches": [
  //             {
  //               "id": 2,
  //               "uuid": "INV-82A1",
  //               "batch_name": "Batch1",
  //               "count_of_students": 2,
  //               "status": true,
  //               "batch_status": 2
  //             }
  //           ],
  //           "exam_name": "Mid Year Recruitment 2024",
  //           "exam_date": "2024-11-02",
  //           "exam_time": "16:49:00",
  //           "exam_duration": 5,
  //           "status": 1,
  //           "created_at": "2024-11-01T11:19:02.864919Z",
  //           "updated_at": "2024-11-06T07:13:06.000139Z",
  //           "status_of_exam": 2,
  //           "cut_of_mark": null,
  //           "is_pool": true
  //         },
  //         {
  //           "id": 1,
  //           "exam_location": {
  //             "id": 1,
  //             "location_name": "Nirmala"
  //           },
  //           "questionnaire": {
  //             "id": 1,
  //             "questionnaire_name": "Paper 1"
  //           },
  //           "batches": [
  //             {
  //               "id": 1,
  //               "uuid": "INV-31E0",
  //               "batch_name": "Batch1",
  //               "count_of_students": 3,
  //               "status": true,
  //               "batch_status": 1
  //             }
  //           ],
  //           "exam_name": "QQQQQQQQQQQQQQQQQQQQUUUUUUUUUUUUUUUUXXXXXXXXXXXXXXXXXXXXXXXTTTTTTTTTTTTTTTT",
  //           "exam_date": "2024-11-01",
  //           "exam_time": "13:46:00",
  //           "exam_duration": 15,
  //           "status": 1,
  //           "created_at": "2024-11-01T06:17:06.178593Z",
  //           "updated_at": "2024-11-06T11:59:03.962534Z",
  //           "status_of_exam": 2,
  //           "cut_of_mark": 2.0,
  //           "is_pool": false
  //         }
  //       ]
  //     }
  //   };
  //   const mockQuestionnaire = {
  //     status: 200,
  //     data:
  //     {
  //       "count": 2,
  //       "next": null,
  //       "previous": null,
  //       "results": [
  //         {
  //           "id": 2,
  //           "questionnaire_name": "Paper 2",
  //           "status": true,
  //           "created_at": "2024-11-04T12:11:19.827159Z",
  //           "updated_at": "2024-11-20T03:34:42.795427Z",
  //           "total_questions": 9
  //         },
  //         {
  //           "id": 1,
  //           "questionnaire_name": "Paper 1",
  //           "status": true,
  //           "created_at": "2024-11-01T06:16:08.043700Z",
  //           "updated_at": "2024-11-20T03:37:40.520016Z",
  //           "total_questions": 6
  //         }
  //       ]
  //     }
  //   };

  //   adminServices.adminListExams.mockResolvedValueOnce(mockExams);
  //   adminServices.questionnaireLists.mockResolvedValueOnce(mockQuestionnaire);

  //   render(
  //     <MemoryRouter>
  //       <AdminExamsList />
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     expect(adminServices.adminListExams).toHaveBeenCalled();
  //     expect(adminServices.questionnaireLists).toHaveBeenCalled();
  //   });
  //   await waitFor(() => {
     

  //     expect(screen.getByTitle('Exam Search')).toBeInTheDocument();
  //     const searchBar = screen.getByPlaceholderText("Enter Name")
  //     fireEvent.change(searchBar, { target: { value: "English" } })
  //     const searchButton = screen.getByTestId('Search');
  //     fireEvent.click(searchButton);


  //   });
  //   waitFor(() => {
  //     expect(adminServices.adminListExams).toHaveBeenCalledWith(1, "", "");
  //   })
  //   screen.debug();
  // });

  


});
