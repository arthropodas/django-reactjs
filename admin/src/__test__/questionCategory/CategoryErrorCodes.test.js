import adminQuestionCategoryErrorCodes from "../../pages/admin/questionCategory/CategoryErrorCodes";


describe('adminQuestionCategoryErrorCodes', () => {
    test('returns correct message for e1010', () => {
      const result = adminQuestionCategoryErrorCodes('e1010');
      expect(result).toBe('Something went wrong. Please try again later');
    });
  
    test('returns correct message for e1002', () => {
      const result = adminQuestionCategoryErrorCodes('e1002');
      expect(result).toBe('Section name is required');
    });
  
    test('returns correct message for e1000', () => {
      const result = adminQuestionCategoryErrorCodes('e1000');
      expect(result).toBe('Section name must be a valid text');
    });
  
    test('returns correct message for e1003', () => {
      const result = adminQuestionCategoryErrorCodes('e1003');
      expect(result).toBe('Section name cannot be longer than 100 characters');
    });
  
    test('returns correct message for e1004', () => {
      const result = adminQuestionCategoryErrorCodes('e1004');
      expect(result).toBe('Section name must be at least 2 characters long');
    });
  
    test('returns correct message for e1005', () => {
      const result = adminQuestionCategoryErrorCodes('e1005');
      expect(result).toBe('Please remove spaces at the beginning or end of the section name');
    });
  
    test('returns correct message for e1006', () => {
      const result = adminQuestionCategoryErrorCodes('e1006');
      expect(result).toBe('Section not found');
    });
  
    test('returns correct message for e1008', () => {
      const result = adminQuestionCategoryErrorCodes('e1008');
      expect(result).toBe('This section has already been deleted');
    });
  
    test('returns default message for unknown error code', () => {
      const result = adminQuestionCategoryErrorCodes('unknown_code');
      expect(result).toBe('Something went wrong. Please try again later');
    });

    test('returns message for e1082', () => {
      const result = adminQuestionCategoryErrorCodes('e1082');
      expect(result).toBe('Section with this name already exists');
    });

    test('returns message for e1086', () => {
      const result = adminQuestionCategoryErrorCodes('e1086');
      expect(result).toBe('Unable to display the list due to an invalid parameter');
    });

    test('returns message for e1124', () => {
      const result = adminQuestionCategoryErrorCodes('e1124');
      expect(result).toBe('Cannot delete the section because it contains a question');
    });

  });