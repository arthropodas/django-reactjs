import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import AdminExamDetail from '../../pages/admin/examManagement/ExamDetailPage';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';


jest.mock('../../services/AdminServices', () => ({
  adminServices: {
    questionnaireLists: jest.fn(),
    adminGetExamById: jest.fn(),
    adminEditExam: jest.fn(),
  },
}));

jest.mock('../../pages/admin/examManagement/ExamErrorCodes');

describe('AdminExamDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test('should fetch and display exam details on load', async () => {
  //   const mockExamData = {
  //     id: '1',
  //     exam_name: 'Math Exam',
  //     exam_location: { location_name: 'Room 101' },
  //     exam_date: '2024-11-20',
  //     exam_time: '10:00',
  //     exam_duration: 60,
  //     questionnaire: { id: 'q1', questionnaire_name: 'Math Paper' },
  //     status_of_exam: 1,
  //     is_pool: false,
  //   };

  //   adminServices.adminGetExamById.mockResolvedValueOnce({ status: 200, data: mockExamData });
  //   adminServices.questionnaireLists.mockResolvedValueOnce({
  //     data: { results: [{ id: 'q1', questionnaire_name: 'Math Paper' }] }
  //   });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => expect(adminServices.adminGetExamById).toHaveBeenCalledWith('1'));

  //   expect(screen.getByLabelText('Exam Name')).toHaveValue('Math Exam');
  //   expect(screen.getByLabelText('Exam Location')).toHaveValue('Room 101');
  //   expect(screen.getByLabelText('Date')).toHaveValue('2024-11-20');
  //   expect(screen.getByLabelText('Time')).toHaveValue('10:00');
  //   expect(screen.getByLabelText('Duration (Minutes)')).toHaveValue(60);
  // });

  // test('should toggle edit mode on clicking the edit button', async () => {
  //   const mockExamData = {
  //     id: '1',
  //     exam_name: 'Math Exam',
  //     exam_location: { location_name: 'Room 101' },
  //     exam_date: '2024-11-20',
  //     exam_time: '10:00',
  //     exam_duration: 60,
  //     questionnaire: { id: 'q1', questionnaire_name: 'Math Paper' },
  //     status_of_exam: 1,
  //     is_pool: false,
  //   };

  //   adminServices.adminGetExamById.mockResolvedValueOnce({ status: 200, data: mockExamData });
  //   adminServices.questionnaireLists.mockResolvedValueOnce({
  //     data: { results: [{ id: 'q1', questionnaire_name: 'Math Paper' }] }
  //   });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => expect(adminServices.adminGetExamById).toHaveBeenCalledWith('1'));

  //   const editButton = screen.getByTitle('Edit');
  //   fireEvent.click(editButton);

  //   // Check if input fields are now editable
  //   expect(screen.getByLabelText('Exam Name')).toBeEnabled();
  //   expect(screen.getByLabelText('Exam Location')).toBeEnabled();
  //   expect(screen.getByLabelText('Date')).toBeEnabled();
  // });

  // test('should update exam details on save', async () => {

  //   adminServices.adminGetExamById.mockResolvedValueOnce({
  //     status: 200,
  //     data: {
  //       "id": 2,
  //       "exam_location": {
  //         "id": 2,
  //         "location_name": "rewwefcx"
  //       },
  //       "questionnaire": {
  //         "id": 1,
  //         "questionnaire_name": "Paper 1"
  //       },
  //       "batches": [
  //         {
  //           "id": 2,
  //           "uuid": "INV-82A1",
  //           "batch_name": "Batch1",
  //           "count_of_students": 2,
  //           "status": true,
  //           "batch_status": 2
  //         }
  //       ],
  //       "exam_name": "Mid Year Recruitment 2024",
  //       "exam_date": "2024-11-02",
  //       "exam_time": "16:49:00",
  //       "exam_duration": 5,
  //       "status": 1,
  //       "created_at": "2024-11-01T11:19:02.864919Z",
  //       "updated_at": "2024-11-06T07:13:06.000139Z",
  //       "status_of_exam": 2,
  //       "cut_of_mark": null,
  //       "is_pool": true
  //     }
  //   });
  //   adminServices.questionnaireLists.mockResolvedValueOnce({
  //     data: { results: [{ id: 'q1', questionnaire_name: 'Math Paper' }] }
  //   });

  //   adminServices.adminEditExam.mockResolvedValueOnce({ status: 200 });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => expect(adminServices.adminGetExamById).toHaveBeenCalledWith('1'));

  //   const editButton = screen.getByTitle('Edit');
  //   fireEvent.click(editButton);

  //   // Edit exam name and location
  //   fireEvent.change(screen.getByLabelText('Exam Name'), { target: { value: 'Updated Math Exam' } });
  //   fireEvent.change(screen.getByLabelText('Exam Location'), { target: { value: 'Room 102' } });

  //   const saveButton = screen.getByTitle('Save');
  //   fireEvent.click(saveButton);

  //   await waitFor(() => expect(adminServices.adminEditExam).toHaveBeenCalledWith(
  //     '1',
  //     expect.objectContaining({
  //       examName: 'Updated Math Exam',
  //       examLocation: 'Room 102',
  //     })
  //   ));
  // });

  // test('should handle exam report download', async () => {
  //   const mockExamData = {
  //     id: '1',
  //     exam_name: 'Math Exam',
  //     exam_location: { location_name: 'Room 101' },
  //     exam_date: '2024-11-20',
  //     exam_time: '10:00',
  //     exam_duration: 60,
  //     questionnaire: { id: 'q1', questionnaire_name: 'Math Paper' },
  //     status_of_exam: 1,
  //     is_pool: false,
  //   };

  //   adminServices.adminGetExamById.mockResolvedValueOnce({ status: 200, data: mockExamData });
  //   adminServices.questionnaireLists.mockResolvedValueOnce({
  //     data: { results: [{ id: 'q1', questionnaire_name: 'Math Paper' }] }
  //   });

  //   adminServices.adminDownloadExamReport.mockResolvedValueOnce({ data: 'some,csv,data' });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => expect(adminServices.adminGetExamById).toHaveBeenCalledWith('1'));

  //   const downloadButton = screen.getByText('Exam Report');
  //   fireEvent.click(downloadButton);

  //   await waitFor(() => expect(adminServices.adminDownloadExamReport).toHaveBeenCalledWith('1'));
  // });

  test('should navigate to shortlist page when shortlist button is clicked', async () => {
   

    adminServices.adminGetExamById.mockResolvedValueOnce({ status: 200, data: {
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
    } });
    adminServices.questionnaireLists.mockResolvedValueOnce({
      data: {
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
    });

    render(
      <MemoryRouter >
        <AdminExamDetail />
      </MemoryRouter>
    );

    await waitFor(() => expect(adminServices.adminGetExamById).toHaveBeenCalledWith('1'));
    waitFor(() => {
      const shortlistButton = screen.getByText('Shortlist');
      fireEvent.click(shortlistButton);

    })

    await waitFor(() => expect(screen.location.pathname).toBe('/shortlisted/?questionnaireId=1'));
  });

  // test('should go back when back button is clicked', () => {
  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   const backButton = screen.getByLabelText('back');
  //   fireEvent.click(backButton);

  //   expect(window.history.length).toBe(1); // Simulate the go back behavior
  // });







  //   test('renders the AdminExamDetail component', async () => {
  //     render(
  //       <MemoryRouter>
  //         <AdminExamDetail />
  //       </MemoryRouter>
  //     );
  //     waitFor(() => {
  //       expect(screen.getByText('Exam Details')).toBeInTheDocument();
  //     });
  //   });



  //   test('should fetch and display exam details', async () => {
  //     adminServices.adminGetExamById.mockResolvedValueOnce({
  //       status: 200,
  //   data:{
  //     "id": 2,
  //     "exam_location": {
  //         "id": 2,
  //         "location_name": "rewwefcx"
  //     },
  //     "questionnaire": {
  //         "id": 1,
  //         "questionnaire_name": "Paper 1"
  //     },
  //     "batches": [
  //         {
  //             "id": 2,
  //             "uuid": "INV-82A1",
  //             "batch_name": "Batch1",
  //             "count_of_students": 2,
  //             "status": true,
  //             "batch_status": 2
  //         }
  //     ],
  //     "exam_name": "Mid Year Recruitment 2024",
  //     "exam_date": "2024-11-02",
  //     "exam_time": "16:49:00",
  //     "exam_duration": 5,
  //     "status": 1,
  //     "created_at": "2024-11-01T11:19:02.864919Z",
  //     "updated_at": "2024-11-06T07:13:06.000139Z",
  //     "status_of_exam": 2,
  //     "cut_of_mark": null,
  //     "is_pool": true
  // }
  //     });

  //     adminServices.questionnaireLists.mockResolvedValueOnce({
  //       status: 200,
  //       data: {
  //         "count": 2,
  //         "next": null,
  //         "previous": null,
  //         "results": [
  //             {
  //                 "id": 2,
  //                 "questionnaire_name": "Paper 2",
  //                 "status": true,
  //                 "created_at": "2024-11-04T12:11:19.827159Z",
  //                 "updated_at": "2024-11-20T03:34:42.795427Z",
  //                 "total_questions": 9
  //             },
  //             {
  //                 "id": 1,
  //                 "questionnaire_name": "Paper 1",
  //                 "status": true,
  //                 "created_at": "2024-11-01T06:16:08.043700Z",
  //                 "updated_at": "2024-11-20T03:37:40.520016Z",
  //                 "total_questions": 6
  //             }
  //         ]
  //     }
  //     });

  //     render(
  //       <MemoryRouter>
  //         <AdminExamDetail />
  //       </MemoryRouter>
  //     );

  //     await waitFor(() => {
  //       expect(adminServices.adminGetExamById).toHaveBeenCalledWith(1);
  //       expect(screen.getByDisplayValue('Mid Year Recruitment 2024')).toBeInTheDocument();
  //       expect(screen.getByDisplayValue('rewwefcx')).toBeInTheDocument();
  //       expect(screen.getByDisplayValue('2024-11-02')).toBeInTheDocument();
  //       expect(screen.getByDisplayValue('14:00')).toBeInTheDocument();
  //       expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  //     });
  //   });


  // test('should toggle edit mode and save changes', async () => {
  //   adminServices.adminGetExamById.mockResolvedValueOnce({
  //     status: 200,
  //     data: {
  //       "id": 2,
  //       "exam_location": {
  //           "id": 2,
  //           "location_name": "rewwefcx"
  //       },
  //       "questionnaire": {
  //           "id": 1,
  //           "questionnaire_name": "Paper 1"
  //       },
  //       "batches": [
  //           {
  //               "id": 2,
  //               "uuid": "INV-82A1",
  //               "batch_name": "Batch1",
  //               "count_of_students": 2,
  //               "status": true,
  //               "batch_status": 2
  //           }
  //       ],
  //       "exam_name": "Mid Year Recruitment 2024",
  //       "exam_date": "2024-11-02",
  //       "exam_time": "16:49:00",
  //       "exam_duration": 5,
  //       "status": 1,
  //       "created_at": "2024-11-01T11:19:02.864919Z",
  //       "updated_at": "2024-11-06T07:13:06.000139Z",
  //       "status_of_exam": 2,
  //       "cut_of_mark": null,
  //       "is_pool": true
  //   }
  //   });

  //   adminServices.adminListCategorys.mockResolvedValueOnce({
  //     status: 200,
  //     data: [],
  //   });

  //   adminServices.adminEditExam.mockResolvedValueOnce({
  //     status: 200,
  //   });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   expect(adminServices.adminGetExamById).toHaveBeenCalled();

  //   await waitFor(() => {
  //     fireEvent.click(screen.getByTitle('Edit'));
  //   });

  //   await waitFor(() => {
  //     fireEvent.change(screen.getByLabelText('Exam Name'), { target: { value: 'Updated Exam' } });
  //     fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-10-02' } });
  //     fireEvent.change(screen.getByLabelText('Time'), { target: { value: '17:00' } });
  //     fireEvent.change(screen.getByLabelText('Duration (Minutes)'), { target: { value: '60' } });
  //     fireEvent.change(screen.getByLabelText('Total Questions'), { target: { value: '6' } });
  //   });

  //   fireEvent.click(screen.getByTitle('Save'));

  //   await waitFor(() => {
  //     expect(adminServices.adminEditExam).toHaveBeenCalled();
  //   });
  // });



  // test('should display an error message on fetch failure', async () => {
  //   adminServices.adminGetExamById.mockRejectedValueOnce({
  //     response: { data: { errorCode: 'FETCH_ERROR' } },
  //   });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   expect(adminServices.adminGetExamById).toHaveBeenCalled();

  //   await waitFor(() => {
  //     expect(screen.getByText(/Unknown error occurred/i)).toBeInTheDocument();
  //   });
  // });

  // test('navigate to shortlist', async () => {

  //   adminServices.adminGetExamById.mockResolvedValueOnce({
  //     status: 200,
  //     data: {
  //       "id": 2,
  //       "exam_location": {
  //           "id": 2,
  //           "location_name": "rewwefcx"
  //       },
  //       "questionnaire": {
  //           "id": 1,
  //           "questionnaire_name": "Paper 1"
  //       },
  //       "batches": [
  //           {
  //               "id": 2,
  //               "uuid": "INV-82A1",
  //               "batch_name": "Batch1",
  //               "count_of_students": 2,
  //               "status": true,
  //               "batch_status": 2
  //           }
  //       ],
  //       "exam_name": "Mid Year Recruitment 2024",
  //       "exam_date": "2024-11-02",
  //       "exam_time": "16:49:00",
  //       "exam_duration": 5,
  //       "status": 1,
  //       "created_at": "2024-11-01T11:19:02.864919Z",
  //       "updated_at": "2024-11-06T07:13:06.000139Z",
  //       "status_of_exam": 2,
  //       "cut_of_mark": null,
  //       "is_pool": true
  //   }
  //   });


  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );
  //   expect(adminServices.adminGetExamById).toHaveBeenCalled();
  //   await waitFor(() => {
  //     const shortlist = screen.getByTestId('Shortlist');
  //     expect(shortlist).toBeInTheDocument();
  //     fireEvent.click(shortlist);
  //   })
  // });


  // test('should toggle edit mode and save changes fail', async () => {
  //   adminServices.adminGetExamById.mockResolvedValueOnce({
  //     status: 200,
  //     data: {
  //       "id": 2,
  //       "exam_location": {
  //           "id": 2,
  //           "location_name": "rewwefcx"
  //       },
  //       "questionnaire": {
  //           "id": 1,
  //           "questionnaire_name": "Paper 1"
  //       },
  //       "batches": [
  //           {
  //               "id": 2,
  //               "uuid": "INV-82A1",
  //               "batch_name": "Batch1",
  //               "count_of_students": 2,
  //               "status": true,
  //               "batch_status": 2
  //           }
  //       ],
  //       "exam_name": "Mid Year Recruitment 2024",
  //       "exam_date": "2024-11-02",
  //       "exam_time": "16:49:00",
  //       "exam_duration": 5,
  //       "status": 1,
  //       "created_at": "2024-11-01T11:19:02.864919Z",
  //       "updated_at": "2024-11-06T07:13:06.000139Z",
  //       "status_of_exam": 2,
  //       "cut_of_mark": null,
  //       "is_pool": true
  //   }
  //   });

  //   adminServices.adminListCategorys.mockResolvedValueOnce({
  //     status: 200,
  //     data: [],
  //   });

  //   adminServices.adminEditExam.mockRejectedValueOnce({
  //     status: 400,
  //     data: { "errorCode": "e1055", "errorMsg": "Not found" },
  //   });

  //   render(
  //     <MemoryRouter>
  //       <AdminExamDetail />
  //     </MemoryRouter>
  //   );

  //   expect(adminServices.adminGetExamById).toHaveBeenCalled();

  //   await waitFor(() => {
  //     fireEvent.click(screen.getByTitle('Edit'));
  //   });

  //   await waitFor(() => {
  //     fireEvent.change(screen.getByLabelText('Exam Name'), { target: { value: 'Updated Exam' } });
  //     fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-10-02' } });
  //     fireEvent.change(screen.getByLabelText('Time'), { target: { value: '17:00' } });
  //     fireEvent.change(screen.getByLabelText('Duration (Minutes)'), { target: { value: '60' } });
  //     fireEvent.change(screen.getByLabelText('Total Questions'), { target: { value: '6' } });
  //   });

  //   fireEvent.click(screen.getByTitle('Save'));

  //   await waitFor(() => {
  //     expect(adminServices.adminEditExam).toHaveBeenCalled();
  //   });
  // });



});


