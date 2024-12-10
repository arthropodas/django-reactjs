import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import InstitutionsList from '../../pages/admin/institutions/InstitutionManagement';
import { adminServices } from '../../services/AdminServices';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import adminInstitutionErrorCodes from '../../pages/admin/institutions/InstitutionErrorCodes';


jest.mock('../../services/AdminServices', () => ({
  adminServices: {
    adminListInstitution: jest.fn(),
    adminDeleteInstitution: jest.fn(),
    adminGetInstitutionById: jest.fn(),
    adminEditInstitution: jest.fn(),
    adminAddInstitution: jest.fn()
  },
}));

jest.mock('../../pages/admin/institutions/InstitutionErrorCodes');

describe('InstitutionsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the InstitutionsList component', async () => {
    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Institution Management/i)).toBeInTheDocument();
      expect(screen.getByText(/Search/i)).toBeInTheDocument();
      expect(screen.getByText('+ New Institution')).toBeInTheDocument();

      expect(screen.getByText(/Institution Code/i)).toBeInTheDocument();
      expect(screen.getByText(/Institution Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Institution Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });


  // Success Cases


  test('should fetch and display institution data', async () => {
    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          "count": 33,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": 3,
              "institution_name": "Nirmala",
              "institution_code": "A456461",
              "institution_email": "mec@gmail.com",
              "institution_phone": "9889899898",
              "status": true,
              "created_at": "2024-09-15T11:45:47.543061Z",
              "updated_at": "2024-09-15T11:45:47.543107Z"
            },
            {
              "id": 4,
              "institution_name": "Nirmala",
              "institution_code": "A456461",
              "institution_email": "mec@gmail.com",
              "institution_phone": "9889899898",
              "status": true,
              "created_at": "2024-09-15T11:45:47.543061Z",
              "updated_at": "2024-09-15T11:45:47.543107Z"
            },
          ]
        }
      ],
    });
    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();

    });


    waitFor(() => {
      const firstButton = screen.getByTitle('First');
      fireEvent.click(firstButton);
      const lastButton = screen.getByTitle('Last');
      fireEvent.click(lastButton);
      const nextButton = screen.getByTitle('Next');
      fireEvent.click(nextButton);
      const prevButton = screen.getByTitle('Previous');
      fireEvent.click(prevButton);
    })
  });


  test('should fetch empty and display no institution data', async () => {
    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: { "count": 0, "next": null, "previous": null, "results": [] },
    });

    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();

    });
    waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    })
  });


  test('should fetch and display institution data using search', async () => {
    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });

    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );

    waitFor(() => {
      const searchBar = screen.getByPlaceholderText("Enter institution name");
      fireEvent.change(searchBar, { target: { value: "Nirmala" } });
      const searchButton = screen.getByTestId('Search');
      fireEvent.click(searchButton);

    })

    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalledWith(1, 'Nirmala');
    });
  });

  it('opens the Edit Modal, fetches institution details, and submits the form', async () => {
    const mockInstitutionDetails = {
      "id": 3,
      "institution_name": "Nirmala",
      "institution_code": "A456461",
      "institution_email": "mec@gmail.com",
      "institution_phone": "9889899898",
      "status": true,
      "created_at": "2024-09-15T11:45:47.543061Z",
      "updated_at": "2024-09-15T11:45:47.543107Z"
    };
    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });
    adminServices.adminGetInstitutionById.mockResolvedValueOnce({
      status: 200,
      data: mockInstitutionDetails
    });
    adminServices.adminEditInstitution.mockResolvedValueOnce({
      status: 200,
    });

    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
    });
    waitFor(() => {
      const editButton = screen.getByTitle('Edit Institution');
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Institution')).toBeInTheDocument();
    })
    await waitFor(() => {
      expect(adminServices.adminGetInstitutionById).toBeCalled();
    })
    waitFor(() => {
      const edit = screen.getByTestId('submit');
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      fireEvent.click(edit);
    })
    await waitFor(() => {
      expect(adminServices.adminEditInstitution).toHaveBeenCalledWith(3, {
        "institutionCode": "A456461",
        "institutionName": "Nirmala",
        "institutionEmail": "mec@gmail.com",
        "institutionPhone": "9889899898"
      });
    });
  });


  it('opens the Add Modal and submit it ', async () => {

    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });

    adminServices.adminAddInstitution.mockResolvedValueOnce({
      status: 201,
      data: {
        "id": 4,
        "institution_name": "MEC K",
        "institution_code": "A4564dd",
        "institution_email": "mec22@gmail.com",
        "institution_phone": "5656567898",
        "status": true,
        "created_at": "2024-09-16T14:13:39.747823Z",
        "updated_at": "2024-09-16T14:13:39.747861Z"
      },
    });
    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
    });
    
    waitFor(() => {
      const addButton = screen.getByTitle('Create new institution');
      fireEvent.click(addButton);
      expect(screen.getByText('Create New Institution')).toBeInTheDocument();
      const institutionNameInput = screen.getByTitle('institutionName')
      expect(institutionNameInput).toBeInTheDocument();
      const institutionCodeInput = screen.getByTitle('institutionCode')
      expect(institutionCodeInput).toBeInTheDocument();
      const institutionEmailInput = screen.getByTitle('institutionEmail')
      expect(institutionEmailInput).toBeInTheDocument();
      const institutionPhoneInput = screen.getByTitle('institutionPhone')
      expect(institutionPhoneInput).toBeInTheDocument();

      fireEvent.change(institutionNameInput, { target: { value: "Innovature" } });
      expect(institutionNameInput.value).toBe("Innovature");
      fireEvent.change(institutionCodeInput, { target: { value: "A4564692" } });
      expect(institutionCodeInput.value).toBe("A4564692");
      fireEvent.change(institutionEmailInput, { target: { value: "innov@gmail.com" } });
      expect(institutionEmailInput.value).toBe("innov@gmail.com");
      fireEvent.change(institutionPhoneInput, { target: { value: "4567898765" } });
      expect(institutionPhoneInput.value).toBe("4567898765");

      const submitButton = screen.getByTestId("submit");
      fireEvent.click(submitButton);
    })

    await waitFor(() => {
      expect(adminServices.adminAddInstitution).toHaveBeenCalledWith({
        "institutionCode": "A4564692",
        "institutionName": "Innovature",
        "institutionEmail": "innov@gmail.com",
        "institutionPhone": "4567898765"
    });
    });
   
    screen.debug();
  });



  it('opens the Delete Dialog and delete it ', async () => {

    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });

    adminServices.adminDeleteInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        "id": 1,
        "institution_name": "institute ABC",
        "institution_code": "inst_001",
        "status": false,
        "created_at": "2024-09-09T06:45:46.095492Z",
        "updated_at": "2024-09-16T14:33:07.456689Z"
      },
    });

    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
      const addButton = screen.getByTitle('Delete Institution');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete the Institution?')).toBeInTheDocument();
    const submitButton = screen.getByTestId("confirm");
    fireEvent.click(submitButton);
     waitFor(() => {
      expect(adminServices.adminDeleteInstitution).toHaveBeenCalledWith(3);
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    })
    
    // await waitFor(() => {
    //   const toastMessage = screen.getByTestId('toast'); // Assume the toast component has a title or role
    //   expect(toastMessage).toBeInTheDocument();
    //   expect(toastMessage).toHaveTextContent('Institution deleted successfully'); // Replace with your actual toast message
    // });
   
    screen.debug();
  });




  //   // Failure Cases

  test('should fetch and display category data fails fails', async () => {
    adminServices.adminListInstitution.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1010", "errorMsg": "Exception" },
    });

    adminInstitutionErrorCodes.mockReturnValue('Exception');

    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
      const errorMessage = screen.getByText('Exception'); // Look for the error message
      expect(errorMessage).toBeInTheDocument();
    });

  });



  it('opens the Edit Modal, fetches institution details, and submits the form fails', async () => {
    const mockInstitutionDetails = {
      "id": 3,
      "institution_name": "Nirmala",
      "institution_code": "A456461",
      "institution_email": "mec@gmail.com",
      "institution_phone": "9889899898",
      "status": true,
      "created_at": "2024-09-15T11:45:47.543061Z",
      "updated_at": "2024-09-15T11:45:47.543107Z"
    };
    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });
    adminServices.adminGetInstitutionById.mockResolvedValueOnce({
      status: 200,
      data: mockInstitutionDetails
    });
    adminServices.adminEditInstitution.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1037", "errorMsg": "Institution already exist with the given mail i" },
    });

    adminInstitutionErrorCodes.mockReturnValue('Institution already exist with the given mail i');

    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
    });
    waitFor(() => {
      const editButton = screen.getByTitle('Edit Institution');
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Institution')).toBeInTheDocument();
    })
    await waitFor(() => {
      expect(adminServices.adminGetInstitutionById).toBeCalled();
    })
    waitFor(() => {
      const edit = screen.getByTestId('submit');
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      fireEvent.click(edit);
    })
    waitFor(() => {
      expect(adminServices.adminEditInstitution).toHaveBeenCalledWith(3, {
        "institutionCode": "A456461",
        "institutionName": "Nirmala",
        "institutionEmail": "mec@gmail.com",
        "institutionPhone": "9889899898"
      });
    });
  });



  it('opens the Delete Dialog and delete it  fails', async () => {

    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });

    adminServices.adminDeleteInstitution.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1023", "errorMsg": "Already deleted" },
    });

    adminInstitutionErrorCodes.mockReturnValue('Already deleted');


    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
      const addButton = screen.getByTitle('Delete Institution');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete the Institution?')).toBeInTheDocument();
    const submitButton = screen.getByTestId("confirm");
    fireEvent.click(submitButton);
    waitFor(() => {
      expect(adminServices.adminDeleteInstitution).toHaveBeenCalledWith(3);
    })
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
    expect(screen.getByTitle('errorMessage')).toBeInTheDocument();
    expect(screen.getByText('Already deleted')).toBeInTheDocument();
    const closeButton = screen.getByTestId('close');
    fireEvent.click(closeButton);
    screen.debug();
  });


  it('opens the Add Modal and submit fails ', async () => {

    adminServices.adminListInstitution.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 3,
            institution_name: "Nirmala",
            institution_code: "A456461",
            institution_email: "mec@gmail.com",
            institution_phone: "9889899898",
            status: true,
            created_at: "2024-09-15T11:45:47.543061Z",
            updated_at: "2024-09-15T11:45:47.543107Z"
          },
        ]
      },
    });

    adminServices.adminAddInstitution.mockRejectedValueOnce({
      status: 400,
      data: { "errorCode": "e1011", "errorMsg": "Institution name required" },
    });

    adminInstitutionErrorCodes.mockReturnValue('Institution name required');
    render(
      <MemoryRouter>
        <InstitutionsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(adminServices.adminListInstitution).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      const addButton = screen.getByTitle('Create new institution');
      fireEvent.click(addButton);
      expect(screen.getByText('Create New Institution')).toBeInTheDocument();
      const institutionNameInput = screen.getByTitle('institutionName')
      expect(institutionNameInput).toBeInTheDocument();
      const institutionCodeInput = screen.getByTitle('institutionCode')
      expect(institutionCodeInput).toBeInTheDocument();
      const institutionEmailInput = screen.getByTitle('institutionEmail')
      expect(institutionEmailInput).toBeInTheDocument();
      const institutionPhoneInput = screen.getByTitle('institutionPhone')
      expect(institutionPhoneInput).toBeInTheDocument();

      fireEvent.change(institutionNameInput, { target: { value: " Innovature" } });
      expect(institutionNameInput.value).toBe(" Innovature");
      fireEvent.change(institutionCodeInput, { target: { value: " A4564692 " } });
      expect(institutionCodeInput.value).toBe(" A4564692 ");
      fireEvent.change(institutionEmailInput, { target: { value: "innov@gmail.com " } });
      expect(institutionEmailInput.value).toBe("innov@gmail.com ");
      fireEvent.change(institutionPhoneInput, { target: { value: "4567898765" } });
      expect(institutionPhoneInput.value).toBe("4567898765");

      const submitButton = screen.getByTestId("submit");
      fireEvent.click(submitButton);
      expect(adminServices.adminAddInstitution).toHaveBeenCalled();

    })

    await waitFor(() => {
      expect(adminServices.adminAddInstitution).toHaveBeenCalled();
    });
   
  });

});















