import adminQuestionnaireErrorCodes from "../../pages/admin/questionnaireManagement/QuestionnaireErrorCodes";

describe('adminQuestionnaireErrorCodes', () => {
    it('should return "Question required" for error code "e3000"', () => {
        const result = adminQuestionnaireErrorCodes('e3000');
        expect(result).toBe('Question required');
    });

    it('should return "Question cannot be empty" for error code "e3001"', () => {
        const result = adminQuestionnaireErrorCodes('e3001');
        expect(result).toBe('Question cannot be empty');
    });

    it('should return "Question cannot contains leading or trailing spaces" for error code "e3002"', () => {
        const result = adminQuestionnaireErrorCodes('e3002');
        expect(result).toBe('Question cannot contains leading or trailing spaces');
    });

    it('should return "Question contains minimum 10 characters" for error code "e3003"', () => {
        const result = adminQuestionnaireErrorCodes('e3003');
        expect(result).toBe('Question contains minimum 10 characters');
    });

    it('should return "Question should be less than 1000 characters" for error code "e3004"', () => {
        const result = adminQuestionnaireErrorCodes('e3004');
        expect(result).toBe('Question should be less than 1000 characters');
    });

    it('should return "No questions found for the category" for error code "e3005"', () => {
        const result = adminQuestionnaireErrorCodes('e3005');
        expect(result).toBe('No questions found for the category');
    });

    it('should return "Question already exists" for error code "e3006"', () => {
        const result = adminQuestionnaireErrorCodes('e3006');
        expect(result).toBe('Question already exists');
    });

    it('should return "Question already deleted" for error code "e3007"', () => {
        const result = adminQuestionnaireErrorCodes('e3007');
        expect(result).toBe('Question already deleted');
    });

    it('should return "Question not found" for error code "e3008"', () => {
        const result = adminQuestionnaireErrorCodes('e3008');
        expect(result).toBe('Question not found');
    });

    it('should return "No Questions exist" for error code "e3009"', () => {
        const result = adminQuestionnaireErrorCodes('e3009');
        expect(result).toBe('No Questions exist');
    });

    it('should return "Unable to delete question" for error code "e3011"', () => {
        const result = adminQuestionnaireErrorCodes('e3011');
        expect(result).toBe('Unable to delete question');
    });

    it('should return "section Required" for error code "e3100"', () => {
        const result = adminQuestionnaireErrorCodes('e3100');
        expect(result).toBe('section Required');
    });

    it('should return "section cannot be empty" for error code "e3101"', () => {
        const result = adminQuestionnaireErrorCodes('e3101');
        expect(result).toBe('section cannot be empty');
    });

    it('should return "section Id should be an integer" for error code "e3102"', () => {
        const result = adminQuestionnaireErrorCodes('e3102');
        expect(result).toBe('section Id should be an integer');
    });

    it('should return "section not found" for error code "e3103"', () => {
        const result = adminQuestionnaireErrorCodes('e3103');
        expect(result).toBe('section not found');
    });

    it('should return "Options are required" for error code "e3200"', () => {
        const result = adminQuestionnaireErrorCodes('e3200');
        expect(result).toBe('Options are required');
    });

    it('should return "Options cannot be empty" for error code "e3201"', () => {
        const result = adminQuestionnaireErrorCodes('e3201');
        expect(result).toBe('Options cannot be empty');
    });

    it('should return "Exactly 4 options are required for this question type." for error code "e3202"', () => {
        const result = adminQuestionnaireErrorCodes('e3202');
        expect(result).toBe('Exactly 4 options are required for this question type.  ');
    });

    it('should return "Maximum options length is 100" for error code "e3203"', () => {
        const result = adminQuestionnaireErrorCodes('e3203');
        expect(result).toBe('Maximum options length is 100');
    });

    it('should return "Duplicate options found" for error code "e3204"', () => {
        const result = adminQuestionnaireErrorCodes('e3204');
        expect(result).toBe('Duplicate options found');
    });

    it('should return "Option list cannot be empty" for error code "e3206"', () => {
        const result = adminQuestionnaireErrorCodes('e3206');
        expect(result).toBe('Option list cannot be empty');
    });

    it('should return "Exactly 2 options required for this question type" for error code "e3207"', () => {
        const result = adminQuestionnaireErrorCodes('e3207');
        expect(result).toBe('Exactly 2 options required for this question type');
    });

    it('should return "Correct answer is required" for error code "e3300"', () => {
        const result = adminQuestionnaireErrorCodes('e3300');
        expect(result).toBe('Correct answer is required');
    });

    it('should return "Correct answer cannot be empty" for error code "e3301"', () => {
        const result = adminQuestionnaireErrorCodes('e3301');
        expect(result).toBe('Correct answer cannot be empty');
    });

    it('should return "Correct answer should less than 100 characters" for error code "e3302"', () => {
        const result = adminQuestionnaireErrorCodes('e3302');
        expect(result).toBe('Correct answer should less than 100 characters');
    });

    it('should return "Answer list cannot be empty" for error code "e3304"', () => {
        const result = adminQuestionnaireErrorCodes('e3304');
        expect(result).toBe('Answer list cannot be empty');
    });

    it('should return "Only one correct answer is allowed" for error code "e3305"', () => {
        const result = adminQuestionnaireErrorCodes('e3305');
        expect(result).toBe('Only one correct answer is allowed');
    });

    it('should return "Invalid Csv file headers" for error code "e4203"', () => {
        const result = adminQuestionnaireErrorCodes('e4203');
        expect(result).toBe('Invalid Csv file headers');
    });

    it('should return "Invalid file format" for error code "e3400"', () => {
        const result = adminQuestionnaireErrorCodes('e3400');
        expect(result).toBe('Invalid file format');
    });

    it('should return "File size should be less than 2 MB" for error code "e3401"', () => {
        const result = adminQuestionnaireErrorCodes('e3401');
        expect(result).toBe('File size should be less than 2 MB');
    });

    it('should return "CSV file is required" for error code "e4200"', () => {
        const result = adminQuestionnaireErrorCodes('e4200');
        expect(result).toBe('CSV file is required');
    });

    it('should return "Please upload a valid csv file" for error code "e4201"', () => {
        const result = adminQuestionnaireErrorCodes('e4201');
        expect(result).toBe('Please upload a valid csv file');
    });

    it('should return "csv file is empty" for error code "e4204"', () => {
        const result = adminQuestionnaireErrorCodes('e4204');
        expect(result).toBe('csv file is empty');
    });

    it('should return "Question type is required" for error code "e3500"', () => {
        const result = adminQuestionnaireErrorCodes('e3500');
        expect(result).toBe('Question type is required');
    });

    it('should return "Question type cannot be empty" for error code "e3501"', () => {
        const result = adminQuestionnaireErrorCodes('e3501');
        expect(result).toBe('Question type cannot be empty');
    });

    it('should return "Duplicate answers found" for error code "e3504"', () => {
        const result = adminQuestionnaireErrorCodes('e3504');
        expect(result).toBe('Duplicate answers found');
    });

    it('should return "Question difficulty level cannot be empty" for error code "e4101"', () => {
        const result = adminQuestionnaireErrorCodes('e4101');
        expect(result).toBe('Question difficulty level cannot be empty');
    });

    it('should return "File should be less than 2mb" for error code "e4202"', () => {
        const result = adminQuestionnaireErrorCodes('e4202');
        expect(result).toBe('File should be less than 2mb');
    });

    it('should return "Unknown error occurred" for an unknown error code', () => {
        const result = adminQuestionnaireErrorCodes('unknown');
        expect(result).toBe('Unknown error occurred');
    });

    it('should return "Questionnaire name is required e2201', () => {
        const result = adminQuestionnaireErrorCodes('e2201');
        expect(result).toBe('Questionnaire name is required');
    });
});
