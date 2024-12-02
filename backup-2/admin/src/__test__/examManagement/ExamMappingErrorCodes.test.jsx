import adminExamMappingErrorCodes from '../../pages/admin/examManagement/ExamMappingErrorCodes';

describe('adminExamMappingErrorCodes', () => {
  it('should return "Exam Id required or cannot be null" for error codes "e3700" and "e3701"', () => {
    const result1 = adminExamMappingErrorCodes("e3700");
    const result2 = adminExamMappingErrorCodes("e3701");
    expect(result1).toBe("Exam Id required or cannot be null");
    expect(result2).toBe("Exam Id required or cannot be null");
  });

  it('should return "Exam Id cannot be string" for error code "e3702"', () => {
    const result = adminExamMappingErrorCodes("e3702");
    expect(result).toBe("Exam Id cannot be string");
  });

  it('should return "Student Id required or cannot be null" for error codes "e3800" and "e3801"', () => {
    const result1 = adminExamMappingErrorCodes("e3800");
    const result2 = adminExamMappingErrorCodes("e3801");
    expect(result1).toBe("Student Id required or cannot be null");
    expect(result2).toBe("Student Id required or cannot be null");
  });

  it('should return "Student Id should be a list" for error code "e3802"', () => {
    const result = adminExamMappingErrorCodes("e3802");
    expect(result).toBe("Student Id should be a list");
  });

  it('should return "Student Id should be integer" for error codes "e3803" and "e3809"', () => {
    const result1 = adminExamMappingErrorCodes("e3803");
    const result2 = adminExamMappingErrorCodes("e3809");
    expect(result1).toBe("Student Id should be integer");
    expect(result2).toBe("Student Id should be integer");
  });

  it('should return "Student with Id [] not found" for error code "e3805"', () => {
    const result = adminExamMappingErrorCodes("e3805");
    expect(result).toBe("Student with Id [] not found");
  });

  it('should return "Remove student Id required or cannot be null" for error codes "e3806" and "e3807"', () => {
    const result1 = adminExamMappingErrorCodes("e3806");
    const result2 = adminExamMappingErrorCodes("e3807");
    expect(result1).toBe("Remove student Id required or cannot be null");
    expect(result2).toBe("Remove student Id required or cannot be null");
  });

  it('should return "Remove student Id should be list" for error code "e3808"', () => {
    const result = adminExamMappingErrorCodes("e3808");
    expect(result).toBe("Remove student Id should be list");
  });

  it('should return "Provide values in either student Id or remove student Id" for error code "e3811"', () => {
    const result = adminExamMappingErrorCodes("e3811");
    expect(result).toBe("Provide values in either student Id or remove student Id");
  });

  it('should return "Exam with Id not found" for error code "e3900"', () => {
    const result = adminExamMappingErrorCodes("e3900");
    expect(result).toBe("Exam with Id not found");
  });

  it('should return "Exam completed or cancelled. Please try again later" for error code "e3901"', () => {
    const result = adminExamMappingErrorCodes("e3901");
    expect(result).toBe("Exam completed or cancelled. Please try again later");
  });

  it('should return "No students registered with exam" for error code "e4000"', () => {
    const result = adminExamMappingErrorCodes("e4000");
    expect(result).toBe("No students registered with exam");
  });

  it('should return "Already exam link is shared to registered students" for error code "e4001"', () => {
    const result = adminExamMappingErrorCodes("e4001");
    expect(result).toBe("Already exam link is shared to registered students");
  });

  it('should return "Invalid student Ids found []" for error code "e4002"', () => {
    const result = adminExamMappingErrorCodes("e4002");
    expect(result).toBe("Invalid student Ids found []");
  });

  it('should return "Student already registered" for error code "e4003"', () => {
    const result = adminExamMappingErrorCodes("e4003");
    expect(result).toBe("Student already registered");
  });

  it('should return "Student with Id already registered with other exam []" for error code "e4004"', () => {
    const result = adminExamMappingErrorCodes("e4004");
    expect(result).toBe("Student with Id already registered with other exam []");
  });

  it('should return "Some emails failed to send" for error code "e4005"', () => {
    const result = adminExamMappingErrorCodes("e4005");
    expect(result).toBe("Some emails failed to send");
  });

  it('should return "No students found to send or resend exam link" for error codes "e4006" and "e4007"', () => {
    const result1 = adminExamMappingErrorCodes("e4006");
    const result2 = adminExamMappingErrorCodes("e4007");
    expect(result1).toBe("No students found to send or resend exam link");
    expect(result2).toBe("No students found to send or resend exam link");
  });

  it('should return "Cannot add and remove students simultaneously" for error code "e4008"', () => {
    const result = adminExamMappingErrorCodes("e4008");
    expect(result).toBe("Cannot add and remove students simultaneously");
  });

  it('should return "Student not registered with exam" for error code "e4009"', () => {
    const result = adminExamMappingErrorCodes("e4009");
    expect(result).toBe("Student not registered with exam");
  });

  it('should return "Students registered in other exams cannot be removed" for error code "e4010"', () => {
    const result = adminExamMappingErrorCodes("e4010");
    expect(result).toBe("Students registered in other exams cannot be removed");
  });

  it('should return "Student token required" for error code "e4011"', () => {
    const result = adminExamMappingErrorCodes("e4011");
    expect(result).toBe("Student token required");
  });

  it('should return "Type 0 and Type 2 questions need exactly 4 options" for error codes "e4012" and "e4014"', () => {
    const result1 = adminExamMappingErrorCodes("e4012");
    const result2 = adminExamMappingErrorCodes("e4014");
    expect(result1).toBe("Type 0 and Type 2 questions need exactly 4 options");
    expect(result2).toBe("Type 0 and Type 2 questions need exactly 4 options");
  });

  it('should return "Type 1 questions need exactly 2 options" for error code "e4013"', () => {
    const result = adminExamMappingErrorCodes("e4013");
    expect(result).toBe("Type 1 questions need exactly 2 options");
  });

  it('should return "Error in sending email" for error code "e4015"', () => {
    const result = adminExamMappingErrorCodes("e4015");
    expect(result).toBe("Error in sending email");
  });

  it('should return "No students were removed. Check if they are registered" for error code "e4016"', () => {
    const result = adminExamMappingErrorCodes("e4016");
    expect(result).toBe("No students were removed. Check if they are registered");
  });

  it('should return "No enough questions found to send question paper" for error code "e4017"', () => {
    const result = adminExamMappingErrorCodes("e4017");
    expect(result).toBe("No enough questions found to send question paper");
  });

  it('should return "Student already attended the exam" for error code "e4018"', () => {
    const result = adminExamMappingErrorCodes("e4018");
    expect(result).toBe("Student already attended the exam");
  });

  it('should return "Unknown error occurred" for an unrecognized error code', () => {
    const result = adminExamMappingErrorCodes("unknownCode");
    expect(result).toBe("Unknown error occurred");
  });

  it('should return "Unknown error occurred" when no error code is passed', () => {
    const result = adminExamMappingErrorCodes();
    expect(result).toBe("Unknown error occurred");
  });
});