import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BulkStudentAdd from '../../pages/admin/studentManagement/BulkStudentAdd';
import { adminServices } from '../../services/AdminServices';

jest.mock('../../services/AdminServices', () => ({
  adminServices: {
    adminUploadStudents: jest.fn(),
    adminDropdownInstitutions: jest.fn(),
    // adminGetExamInstitution: jest.fn(),
  },
}));

// Mocking components
jest.mock('../../components/select/SelectBox', () => (props) => (
  <select {...props}>
    {props.options.map((option) => (
      <option key={option.id} value={option.id}>{option.value}</option>
    ))}
  </select>
));

jest.mock('../../components/button/SubmitButton', () => (props) => (
  <button type={props.type} {...props}>{props.label}</button>
));

jest.mock('../../components/toast/Toast', () => ({ show, message, onClose }) => (
  show ? <div role="alert">{message}</div> : null
));

jest.mock('../../components/spinner/Spinner', () => () => <div>Loading...</div>);

jest.mock('../../components/modal/PaperModal', () => ({ open, handleClose, children }) => (
  open ? (
    <div role="dialog">
      {children}
      <button onClick={handleClose}>Close</button>
    </div>
  ) : null
));

jest.mock('../../pages/admin/studentManagement/ErrorCard', () => ({ errorData }) => (
  <div>{JSON.stringify(errorData)}</div>
));

const mockInstitutionDropDown = {
  status: 200,
  data: {
    results: [
      { id: 1, institution_name: 'Institution A' },
      { id: 2, institution_name: 'Institution B' }
    ]
  }
};

// const mockExamDropDown = {
//   status: 200,
//   data: [
//     { id: 1, exam_name: 'Exam 1' },
//     { id: 2, exam_name: 'Exam 2' }
//   ]
// }

describe('BulkStudentAdd Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders without crashing', () => {
    render(<BulkStudentAdd handleClose={() => { }} />);
    expect(screen.getByText('Upload file')).toBeInTheDocument();
  });

  test('fetches and displays institution and exam details correctly', async () => {
    adminServices.adminDropdownInstitutions.mockResolvedValueOnce(mockInstitutionDropDown);

    // adminServices.adminGetExamInstitution.mockResolvedValueOnce(mockExamDropDown);

    render(<BulkStudentAdd handleClose={() => { }} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Select Institution')).toBeInTheDocument();
    });

    userEvent.selectOptions(screen.getByPlaceholderText('Select Institution'), 'Institution A');

   

  });

  test('handles form submission successfully', async () => {
    adminServices.adminDropdownInstitutions.mockResolvedValueOnce(mockInstitutionDropDown);

    // adminServices.adminGetExamInstitution.mockResolvedValueOnce(mockExamDropDown);

    adminServices.adminUploadStudents.mockResolvedValueOnce({
      status: 200
    });

    render(<BulkStudentAdd handleClose={() => { }} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Select Institution')).toBeInTheDocument();
    })

    userEvent.selectOptions(screen.getByPlaceholderText('Select Institution'), 'Institution A');

    // await waitFor(() => {
    //   expect(screen.getByPlaceholderText('Select Exam')).toBeInTheDocument();
    // });

    // userEvent.selectOptions(screen.getByPlaceholderText('Select Exam'), 'Exam 1');

    const file = new File(['dummy content'], 'students.csv', { type: 'text/csv' });
    userEvent.upload(screen.getByLabelText('Upload file'), file);

    userEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Students uploaded successfully');
    });

    adminServices.adminUploadStudents.mockRejectedValueOnce({
      response: { data: { errorCode: 'e2050' } }
    });

    userEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
    });
  });
});