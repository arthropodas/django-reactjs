import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extra matchers like toBeInTheDocument
import ReusableTable from '../../components/table/Table'; // Adjust the path as necessary
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';



describe('ReusableTable Component', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
  });
  
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'profile_pic', headerName: 'Profile Picture' },
  ];

  const rows = [
    { id: 1, name: 'John Doe', profile_pic: '/profile1.jpg', statuss: 'SCHEDULED' },
    { id: 2, name: 'Jane Smith', profile_pic: '/profile2.jpg', statuss: 'STARTED' },
  ];

  const actions = [
    {
      label: 'Edit',
      color: 'blue',
      hoverColor: 'blue.600',
      icon: <FaEdit />,
      onClick: jest.fn(),
    },
    {
      label: 'Delete',
      color: 'red',
      hoverColor: 'red.600',
      icon: <FaTrash />,
      onClick: jest.fn(),
    },
  ];

  const renderComponent = (customProps = {}) => {
    return render(
      <ChakraProvider> 
        <MemoryRouter>
          <ReusableTable
            columns={columns}
            rows={rows}
            actions={actions}
            {...customProps}
          />
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  test('renders table headers correctly', () => {
    renderComponent();
    columns.forEach((column) => {
      expect(screen.getByText(column.headerName)).toBeInTheDocument();
    });
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('renders table rows correctly', () => {
    renderComponent();
    rows.forEach((row) => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
    });
  });

  test('renders "No data available" when rows are empty', () => {
    renderComponent({ rows: [] });
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('calls the action handler when Edit button is clicked', () => {
    renderComponent();
    const editButton = screen.getAllByRole('button', { name: /Edit/i })[0];
    fireEvent.click(editButton);
    expect(actions[0].onClick).toHaveBeenCalledWith(rows[0].id);
  });

  test('calls the action handler when Delete button is clicked', () => {
    renderComponent();
    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
    fireEvent.click(deleteButton);
    expect(actions[1].onClick).toHaveBeenCalledWith(rows[0].id);
  });
  
});
