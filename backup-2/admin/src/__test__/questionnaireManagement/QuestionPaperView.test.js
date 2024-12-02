import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import QuestionPaperView from '../../pages/admin/questionnaireManagement/QuestionPaperView';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import adminQuestionnaireErrorCodes from '../../pages/admin/questionnaireManagement/QuestionnaireErrorCodes';

jest.mock('../../services/AdminServices', () => ({
    adminServices: {
        adminQuestionnaireDetailView: jest.fn(),
    },
  }));

  jest.mock('../../pages/admin/questionnaireManagement/QuestionnaireErrorCodes');

  describe('QuestionPaperView Component', () => {
    const mockData = [
      {
        "preview": [
            {
                "category": "Verbal",
                "categoryId": 4,
                "levels": [
                    {
                        "level": 1,
                        "questions": [
                            {
                                "id": 1,
                                "value": "In a family of six madembers A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 4,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 1,
                                        "value": "Brother",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 3,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 2,
                                        "value": "Sister",
                                        "isCorrect": false
                                    }
                                ]
                            },
                            {
                                "id": 2,
                                "value": "In a family of six members A, sdB, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?",
                                "type": 2,
                                "questionImage": null,
                                "options": [
                                    {
                                        "id": 8,
                                        "value": "Cousin",
                                        "isCorrect": true
                                    },
                                    {
                                        "id": 6,
                                        "value": "Sister",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 7,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 5,
                                        "value": "Brother",
                                        "isCorrect": false
                                    }
                                ]
                            },
                            
                            {
                                "id": 14,
                                "value": "In a family of six members A, B, C, D, E, and F, there are two married couples. A is a teacher and is married to B. C is a doctor and is married to D. E is the son of A and B. F is the daughter of C and D. How is F related to E?zsedxdrftfcvgy",
                                "type": 2,
                                "questionImage": "http://localhost:8000/question-image/Emy_Varghese_-_119.png",
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
                                        "id": 55,
                                        "value": "No relation",
                                        "isCorrect": false
                                    },
                                    {
                                        "id": 54,
                                        "value": "Sister",
                                        "isCorrect": false
                                    }
                                ]
                            },
                        
                        ]
                    }
                ]
            }
        ]
    },
    ];
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders with data and displays the questionnaire details - id', async () => {
      adminServices.adminQuestionnaireDetailView.mockResolvedValue({
        status: 200,
        data: {mockData },
      });
  
      render(
        <MemoryRouter>
          <QuestionPaperView questionnaireName="Sample Questionnaire" questionnaireId={1} />
        </MemoryRouter>
      );
  
      expect(screen.getByText('Sample Questionnaire')).toBeInTheDocument();
      await waitFor(() => {
        expect(adminServices.adminQuestionnaireDetailView).toHaveBeenCalled();
        
      });
    });


    test('renders with data and displays the questionnaire details - raw data', async () => {
     const mockMultipleCategoriesData = [
      {
        category: 'Verbal',
        categoryId: 1,
        levels: [
          {
            level: 1,
            questions: [
              { id: 1, value: 'Question 1', options: [{ id: 1, value: 'Option 1' }] },
              { id: 2, value: 'Question 2', options: [{ id: 2, value: 'Option 2' }] },
            ],
          },
        ],
      },
      {
        category: 'Quantitative',
        categoryId: 2,
        levels: [
          {
            level: 2,
            questions: [
              { id: 3, value: 'Question 3', options: [{ id: 3, value: 'Option 3' }] },
            ],
          },
        ],
      },
    ];
  
      render(
        <MemoryRouter>
          <QuestionPaperView questionnaireName="Sample Questionnaire 2" data={mockMultipleCategoriesData} />
        </MemoryRouter>
      );
  
      expect(screen.getByText('Sample Questionnaire 2')).toBeInTheDocument();
      
    });


    test('back button navigates to the previous page', async () => {
      adminServices.adminQuestionnaireDetailView.mockResolvedValue({
        status: 200,
        data: {  mockData },
      });
    
      const { container } = render(
        <MemoryRouter>
          <QuestionPaperView questionnaireName="Sample Questionnaire" questionnaireId={1} />
        </MemoryRouter>
      );
    
      // Find the back button and simulate a click event
      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);
    
      // Use container or screen to check the browser's URL after navigating
      expect(container).toHaveTextContent('Sample Questionnaire');
    });
    

   
    




    test('displays an error message when data fetch fails', async () => {
      const errorMessage = 'Error fetching data';
      adminServices.adminQuestionnaireDetailView.mockRejectedValue({
        response: { data: { errorCode: '500' } },
      });
      adminQuestionnaireErrorCodes.mockReturnValue(errorMessage);
    
      render(
        <MemoryRouter>
          <QuestionPaperView questionnaireName="Sample Questionnaire" questionnaireId={1} />
        </MemoryRouter>
      );
    
      // Wait for the error message to appear
      await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
    });
    


    test('displays a loading spinner while fetching data', async () => {
      adminServices.adminQuestionnaireDetailView.mockImplementation(() => {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      });
  
      render(
        <MemoryRouter>
          <QuestionPaperView questionnaireId={1} />
        </MemoryRouter>
      );
  
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    });
  
   
  
    

});