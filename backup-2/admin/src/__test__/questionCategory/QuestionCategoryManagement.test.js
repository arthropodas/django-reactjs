import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import QuestionCategoryList from '../../pages/admin/questionCategory/QuestionCategoryManagement';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import adminQuestionCategoryErrorCodes from '../../pages/admin/questionCategory/CategoryErrorCodes';

jest.mock('../../services/AdminServices', () => ({
  adminServices: {
    adminListCategory: jest.fn(),
    adminDeleteCategory: jest.fn(),
    adminGetCategoryById: jest.fn(),
    adminEditCategory: jest.fn(),
    adminAddCategory: jest.fn()
  },
}));

jest.mock('../../pages/admin/questionCategory/CategoryErrorCodes');

describe('QuestionCategoryList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the QuestionCategoryList component', async () => {
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Question Section Management/i)).toBeInTheDocument();
      expect(screen.getByText(/Search/i)).toBeInTheDocument();
      expect(screen.getByText(/\+ New Section/i)).toBeInTheDocument();
    });
  });

  // Success Cases


  test('should fetch and display category data', async () => {
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
        { id: 2, question_category_name: 'Logical' },
        { id: 3, question_category_name: 'Technical' },
        { id: 4, question_category_name: 'Verbal' },
      ],
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      expect(screen.getByText('Aptitude')).toBeInTheDocument();
      expect(screen.getByText('Logical')).toBeInTheDocument();
      expect(screen.getByText('Technical')).toBeInTheDocument();
      expect(screen.getByText('Verbal')).toBeInTheDocument();
    });
  });

  test('should fetch empty and display no category data', async () => {
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [],
    });

    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

  });


  test('should fetch and display category data', async () => {
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
        { id: 2, question_category_name: 'Logical' },
        { id: 3, question_category_name: 'Technical' },
        { id: 4, question_category_name: 'Verbal' },
      ],
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      expect(screen.getByText('Aptitude')).toBeInTheDocument();
      expect(screen.getByText('Logical')).toBeInTheDocument();
      expect(screen.getByText('Technical')).toBeInTheDocument();
      expect(screen.getByText('Verbal')).toBeInTheDocument();
    });

  });


  test('should fetch and display category data using search', async () => {
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 2, question_category_name: 'Logical' },
      ],
    });

    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );
    waitFor(() => {
      expect(screen.getByTitle('Section Search')).toBeInTheDocument();
      const searchBar = screen.getByPlaceholderText("Enter Name")
      fireEvent.change(searchBar, { target: { value: "Logical" } })
      const searchButton = screen.getByTestId('Search');
      fireEvent.click(searchButton);
    })

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalledWith('');
      expect(adminServices.adminListCategory).toHaveBeenCalledWith('Logical');
    });
  })


  it('opens the Edit Modal and fetches category details and submit ', async () => {
    const mockData = {
      "id": 1,
      "question_category_name": "Aptitude",
      "status": true,
      "created_at": "2024-09-09T06:46:07.306474Z",
      "updated_at": "2024-09-09T06:46:07.306498Z"
    };
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminGetCategoryById.mockResolvedValueOnce({ data: mockData, status: 200 });
    adminServices.adminEditCategory.mockResolvedValueOnce({
      status: 200,
      data: {
        "id": 1,
        "question_category_name": "Aptitude",
        "status": true,
        "created_at": "2024-09-09T06:46:07.306474Z",
        "updated_at": "2024-09-13T10:44:45.860077Z"
      },
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const editButton = screen.getByTitle('Edit Section');
      fireEvent.click(editButton);
    });
    expect(adminServices.adminGetCategoryById).toHaveBeenCalledWith(1);
    expect(screen.getByText('Edit Section')).toBeInTheDocument();
    const categoryInput = screen.getByDisplayValue('Aptitude'); // Find input by its value
    expect(categoryInput).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    const editSubmit = screen.getByTestId('submit');
    fireEvent.click(editSubmit);
    await waitFor(() => {
      expect(adminServices.adminEditCategory).toHaveBeenCalledWith(1, {
        categoryName: 'Aptitude',
      });
    });
  });


  it('opens the Edit Modal and close it ', async () => {
    const mockData = {
      "id": 1,
      "question_category_name": "Aptitude",
      "status": true,
      "created_at": "2024-09-09T06:46:07.306474Z",
      "updated_at": "2024-09-09T06:46:07.306498Z"
    };
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminGetCategoryById.mockResolvedValueOnce({ data: mockData, status: 200 });

    adminServices.adminEditCategory.mockResolvedValueOnce({
      status: 200,
      data: {
        "id": 1,
        "question_category_name": "Aptitude",
        "status": true,
        "created_at": "2024-09-09T06:46:07.306474Z",
        "updated_at": "2024-09-13T10:44:45.860077Z"
      },
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const editButton = screen.getByTitle('Edit Section');
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Edit Section')).toBeInTheDocument();
    const categoryInput = screen.getByDisplayValue('Aptitude'); // Find input by its value
    expect(categoryInput).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    const editCancel = screen.getByText('Cancel');
    fireEvent.click(editCancel);
  });


  it('opens the Add Modal and submit it ', async () => {

    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminAddCategory.mockResolvedValueOnce({
      status: 201,
      data: {
        "id": 1,
        "question_category_name": "Aptitude",
        "status": true,
        "created_at": "2024-09-09T06:46:07.306474Z",
        "updated_at": "2024-09-13T10:44:45.860077Z"
      },
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const addButton = screen.getByTitle('Create new section');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('New Section')).toBeInTheDocument();
    const categoryNameInput = screen.getByTitle('categoryName')
    expect(categoryNameInput).toBeInTheDocument();
    fireEvent.change(categoryNameInput, { target: { value: "Logical" } });
    expect(categoryNameInput.value).toBe("Logical");
    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminAddCategory).toHaveBeenCalledWith({ "categoryName": "Logical" });
      expect(screen.queryByText('New Section')).not.toBeInTheDocument(); // Ensure modal is closed

    });
    screen.debug();
  });

  it('opens the Add Modal and close it ', async () => {

    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminAddCategory.mockResolvedValueOnce({
      status: 201,
      data: {
        "id": 1,
        "question_category_name": "Aptitude",
        "status": true,
        "created_at": "2024-09-09T06:46:07.306474Z",
        "updated_at": "2024-09-13T10:44:45.860077Z"
      },
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const addButton = screen.getByTitle('Create new section');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('New Section')).toBeInTheDocument();
    const categoryNameInput = screen.getByTitle('categoryName')
    expect(categoryNameInput).toBeInTheDocument();
    fireEvent.change(categoryNameInput, { target: { value: "Logical" } });
    expect(categoryNameInput.value).toBe("Logical");
    const submitButton = screen.getByText("Cancel");
    fireEvent.click(submitButton);
  });


  it('opens the Delete Dialog and delete it ', async () => {

    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminDeleteCategory.mockResolvedValueOnce({
      status: 200,
      data: {
        "id": 8,
        "question_category_name": "Logicalss",
        "status": false,
        "created_at": "2024-09-15T12:12:30.343541Z",
        "updated_at": "2024-09-15T12:40:01.850785Z"
      },
    });

    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const addButton = screen.getByTitle('Delete Section');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete the question section?')).toBeInTheDocument();
    const submitButton = screen.getByTestId("confirm");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminDeleteCategory).toHaveBeenCalledWith(1);
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();

    });
    screen.debug();
  });



  it('search and  submit it ', async () => {

    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminAddCategory.mockResolvedValueOnce({
      status: 201,
      data: {
        "id": 1,
        "question_category_name": "Aptitude",
        "status": true,
        "created_at": "2024-09-09T06:46:07.306474Z",
        "updated_at": "2024-09-13T10:44:45.860077Z"
      },
    });
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(adminServices.adminListCategory).toHaveBeenCalled();
    //   // const addButton = screen.getByTitle('Create new Section');
    //   // fireEvent.click(addButton);
    // });

    expect(screen.getByTitle('Section Search')).toBeInTheDocument();
    const categoryNameInput = screen.getByTitle('Section Search')
    expect(categoryNameInput).toBeInTheDocument();
    fireEvent.change(categoryNameInput, { target: { value: "Logical" } });
    expect(categoryNameInput.value).toBe("Logical");
    const submitButton = screen.getByText("Search");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminAddCategory).toHaveBeenCalledWith({ "categoryName": "Logical" });
      expect(screen.queryByText('Add Question Section')).not.toBeInTheDocument(); // Ensure modal is closed

    });
    screen.debug();
  });



  // Failure Cases

  test('should fetch and display category data fails', async () => {
    adminServices.adminListCategory.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1010", "errorMsg": "Exception" },
    });

    adminQuestionCategoryErrorCodes.mockReturnValue('Exception');

    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const errorMessage = screen.getByText('Exception'); // Look for the error message
      expect(errorMessage).toBeInTheDocument();
    });

  });


  it('opens the Edit Modal and fetches category details and submit fails', async () => {
    const mockData = {
      "id": 1,
      "question_category_name": "Aptitude",
      "status": true,
      "created_at": "2024-09-09T06:46:07.306474Z",
      "updated_at": "2024-09-09T06:46:07.306498Z"
    };
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminGetCategoryById.mockResolvedValueOnce({ data: mockData, status: 200 });
    adminServices.adminEditCategory.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1006", "errorMsg": "Not found PK" },
    });
    adminQuestionCategoryErrorCodes.mockReturnValue('Not found PK');
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      
    });
    const editButton = screen.getByTitle('Edit Section');
    fireEvent.click(editButton);
    expect(screen.getByText('Edit Section')).toBeInTheDocument();
    const categoryInput = screen.getByDisplayValue('Aptitude'); // Find input by its value
    expect(categoryInput).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    const editSubmit = screen.getByTestId('submit');
    fireEvent.click(editSubmit);
    await waitFor(() => {
      expect(adminServices.adminEditCategory).toHaveBeenCalledWith(1, {
        categoryName: 'Aptitude',
      });
      const errorMessage = screen.getByText('Not found PK');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('opens the Edit Modal and fetches category details  fails', async () => {
    const mockData = {
      "id": 1,
      "question_category_name": "Aptitude",
      "status": true,
      "created_at": "2024-09-09T06:46:07.306474Z",
      "updated_at": "2024-09-09T06:46:07.306498Z"
    };
    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminGetCategoryById.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1006", "errorMsg": "Not found PK" },
    });
    adminServices.adminEditCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });
    adminQuestionCategoryErrorCodes.mockReturnValue('Not found PK');
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const editButton = screen.getByTitle('Edit Section');
      fireEvent.click(editButton);
    });
    waitFor(() => {
      expect(adminServices.adminGetCategoryById).toHaveBeenCalledTimes(1);
    })

  });


  it('opens the Add Modal and submit it fails', async () => {

    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminAddCategory.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1003", "errorMsg": "Question section length greater than 100" },
    });
    adminQuestionCategoryErrorCodes.mockReturnValue('Question section length greater than 100');
    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const addButton = screen.getByTitle('Create new section');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('New Section')).toBeInTheDocument();
    const categoryNameInput = screen.getByTitle('categoryName')
    expect(categoryNameInput).toBeInTheDocument();
    fireEvent.change(categoryNameInput, { target: { value: "Logical" } });
    expect(categoryNameInput.value).toBe("Logical");
    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminAddCategory).toHaveBeenCalledWith({ "categoryName": "Logical" });
      expect(screen.queryByText('Add Section')).not.toBeInTheDocument(); // Ensure modal is closed
      const errorMessage = screen.getByText('Question section length greater than 100');
      expect(errorMessage).toBeInTheDocument();
    });
    screen.debug();
  });

  it('opens the Delete Dialog and delete it ', async () => {

    adminServices.adminListCategory.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, question_category_name: 'Aptitude' },
      ],
    });

    adminServices.adminDeleteCategory.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1008", "errorMsg": "Already deleted" },
    });
    adminQuestionCategoryErrorCodes.mockReturnValue('Already deleted');

    render(
      <MemoryRouter>
        <QuestionCategoryList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListCategory).toHaveBeenCalled();
      const addButton = screen.getByTitle('Delete Section');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete the question section?')).toBeInTheDocument();
    const submitButton = screen.getByTestId("confirm");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminServices.adminDeleteCategory).toHaveBeenCalledWith(1);
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
      const errorMessage = screen.getByText('Already deleted');
      expect(errorMessage).toBeInTheDocument();

    });
    screen.debug();
  });


});
