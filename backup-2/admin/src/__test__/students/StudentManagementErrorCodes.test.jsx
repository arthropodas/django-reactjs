import { StudentManagementErrorCodes } from "../../pages/admin/studentManagement/StudentManagementErrorCodes";

describe('StudentManagementErrorCodes', () => {
  test('should return correct error message ', () => {
    expect(StudentManagementErrorCodes('e2002')).toBe('Invalid email');
    expect(StudentManagementErrorCodes('e2016')).toBe('Name is required'); 
    expect(StudentManagementErrorCodes('e2017')).toBe('Invalid name');
    expect(StudentManagementErrorCodes('e2018')).toBe('Phone number is required');
    expect(StudentManagementErrorCodes('e2019')).toBe('Invalid phone number');
    expect(StudentManagementErrorCodes('e2020')).toBe('passout year is required');
    expect(StudentManagementErrorCodes('e2021')).toBe('Invalid passout year');
    expect(StudentManagementErrorCodes('e2022')).toBe('email already exists');
    expect(StudentManagementErrorCodes('e2025')).toBe('Exam not found');
    expect(StudentManagementErrorCodes('e2026')).toBe('Instiution id is required');
    expect(StudentManagementErrorCodes('e2027')).toBe('Invalid institutionId');
    expect(StudentManagementErrorCodes('e2028')).toBe('Institution not found');
    expect(StudentManagementErrorCodes('e2029')).toBe('Student not found');
    expect(StudentManagementErrorCodes('e2030')).toBe('Phone number is required');
    expect(StudentManagementErrorCodes('e2031')).toBe('Invalid student id');
    expect(StudentManagementErrorCodes('e2032')).toBe('Invalid page size');
    expect(StudentManagementErrorCodes('e2034')).toBe('Invalid file format');
    expect(StudentManagementErrorCodes('e2035')).toBe('csv file is empty');
    expect(StudentManagementErrorCodes('e2036')).toBe('No columns found in csv file');
    expect(StudentManagementErrorCodes('e2037')).toBe('uploaded csv file is improperly formatted');
    expect(StudentManagementErrorCodes('e2038')).toBe('no more rows found in the csv file');
    expect(StudentManagementErrorCodes('e2039')).toBe('csv file exceeds the maximum limit size');
    expect(StudentManagementErrorCodes('e2041')).toBe('name length is too long');
    expect(StudentManagementErrorCodes('e2043')).toBe('exam id is required');
    expect(StudentManagementErrorCodes('e2050')).toBe('invalid data in csv file');
    expect(StudentManagementErrorCodes('e2051')).toBe('partailly uploaded the students');
    expect(StudentManagementErrorCodes('e2040')).toBe('name length is too short');
    expect(StudentManagementErrorCodes('e2046')).toBe('csv row data is null');
    expect(StudentManagementErrorCodes('e2101')).toBe('cgpa is required');
    expect(StudentManagementErrorCodes('e2102')).toBe('number of backlogs is required');
    expect(StudentManagementErrorCodes('e2103')).toBe('invalid cgpa');
    expect(StudentManagementErrorCodes('e2104')).toBe('invalid number of backlogs');
    expect(StudentManagementErrorCodes('unknown_code')).toBe('Unknown error occurred');
  });
});
