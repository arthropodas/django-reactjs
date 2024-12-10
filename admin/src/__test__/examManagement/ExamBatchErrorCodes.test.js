import { adminExamBatchErrorCodes } from "../../pages/admin/examManagement/ExamBatchErrorCodes";


describe('adminExamBatchErrorCodes', () => {
    it('should return correct message for error code "e1097"', () => {
      const result = adminExamBatchErrorCodes("e1097");
      expect(result).toBe("Batch name is required");
    });
  
    it('should return correct message for error code "e1098"', () => {
      const result = adminExamBatchErrorCodes("e1098");
      expect(result).toBe("Batch name is invalid");
    });
  
    it('should return correct message for error code "e1099"', () => {
      const result = adminExamBatchErrorCodes("e1099");
      expect(result).toBe("Batch name too small");
    });
  
    it('should return correct message for error code "e1100"', () => {
      const result = adminExamBatchErrorCodes("e1100");
      expect(result).toBe("Batch name too large");
    });
  
    it('should return correct message for error code "e1101"', () => {
      const result = adminExamBatchErrorCodes("e1101");
      expect(result).toBe("Batch name should not have space at the beginning or end");
    });
  
    it('should return correct message for error code "e1102"', () => {
      const result = adminExamBatchErrorCodes("e1102");
      expect(result).toBe("No exam id is provided");
    });
  
    it('should return correct message for error code "e1103"', () => {
      const result = adminExamBatchErrorCodes("e1103");
      expect(result).toBe("Invalid exam");
    });
  
    it('should return correct message for error code "e1104"', () => {
      const result = adminExamBatchErrorCodes("e1104");
      expect(result).toBe("No exam found with such id");
    });
  
    it('should return correct message for error code "e1105"', () => {
      const result = adminExamBatchErrorCodes("e1105");
      expect(result).toBe("Unable to delete the batch since students are allocated");
    });
  
    it('should return correct message for error code "e1106"', () => {
      const result = adminExamBatchErrorCodes("e1106");
      expect(result).toBe("No batch found");
    });
  
    it('should return correct message for error code "e1107"', () => {
      const result = adminExamBatchErrorCodes("e1107");
      expect(result).toBe("Exam is not available to edit as it is cancelled or completed");
    });
  
    it('should return correct message for error code "e1108"', () => {
      const result = adminExamBatchErrorCodes("e1108");
      expect(result).toBe("exam or batch not available");
    });
  
    it('should return correct message for error code "e1109"', () => {
      const result = adminExamBatchErrorCodes("e1109");
      expect(result).toBe("Student mapping table not exist");
    });
  
    it('should return correct message for error code "e4803"', () => {
      const result = adminExamBatchErrorCodes("e4803");
      expect(result).toBe("Batch is already closed");
    });
  
    it('should return correct message for error code "e1127"', () => {
      const result = adminExamBatchErrorCodes("e1127");
      expect(result).toBe("A batch with this name already exists for the selected exam. Please choose a different name.");
    });
  
    it('should return "Unknown error" for an unrecognized error code', () => {
      const result = adminExamBatchErrorCodes("unknownCode");
      expect(result).toBe("Unknown error");
    });
  
    it('should return "Unknown error" when no error code is passed', () => {
      const result = adminExamBatchErrorCodes();
      expect(result).toBe("Unknown error");
    });
  });
  