import adminQuestionErrorCodes from "../../pages/admin/questionManagement/QuestionsErrorCodes";

describe('adminQuestionErrorCodes', () => {
    test('returns correct message for e3000', () => {
        expect(adminQuestionErrorCodes('e3000')).toBe('Question required');
    });

    test('returns correct message for e3001', () => {
        expect(adminQuestionErrorCodes('e3001')).toBe('Question cannot be empty');
    });

    test('returns correct message for e3002', () => {
        expect(adminQuestionErrorCodes('e3002')).toBe('Question cannot contains leading or trailing spaces');
    });

    test('returns correct message for e3003', () => {
        expect(adminQuestionErrorCodes('e3003')).toBe('Question contains minimum 10 characters');
    });

    test('returns correct message for e3004', () => {
        expect(adminQuestionErrorCodes('e3004')).toBe('Question should be less than 1000 characters');
    });

    test('returns empty message for e3005', () => {
        expect(adminQuestionErrorCodes('e3005')).toBe('Unknown error occurred');
    });

    test('returns correct message for e3006', () => {
        expect(adminQuestionErrorCodes('e3006')).toBe('Question already exists');
    });

    test('returns correct message for e3007', () => {
        expect(adminQuestionErrorCodes('e3007')).toBe('Question already deleted');
    });

    test('returns correct message for e3008', () => {
        expect(adminQuestionErrorCodes('e3008')).toBe('Question not found');
    });

    test('returns correct message for e3100', () => {
        expect(adminQuestionErrorCodes('e3100')).toBe('section Required');
    });

    test('returns correct message for e3101', () => {
        expect(adminQuestionErrorCodes('e3101')).toBe('Please choose a question section');
    });

    test('returns correct message for e3102', () => {
        expect(adminQuestionErrorCodes('e3102')).toBe('section Id should be an integer');
    });

    test('returns correct message for e3103', () => {
        expect(adminQuestionErrorCodes('e3103')).toBe('section not found');
    });

    test('returns correct message for e3200', () => {
        expect(adminQuestionErrorCodes('e3200')).toBe('Options are required');
    });

    test('returns correct message for e3201', () => {
        expect(adminQuestionErrorCodes('e3201')).toBe('Options cannot be empty');
    });

    test('returns correct message for e3202', () => {
        expect(adminQuestionErrorCodes('e3202')).toBe('Exactly 4 options are required for this question type.  ');
    });

    test('returns correct message for e3203', () => {
        expect(adminQuestionErrorCodes('e3203')).toBe('Maximum options length is 100');
    });

    test('returns correct message for e3204', () => {
        expect(adminQuestionErrorCodes('e3204')).toBe('Duplicate options found');
    });

    test('returns correct message for e3300', () => {
        expect(adminQuestionErrorCodes('e3300')).toBe('Correct answer is required');
    });

    test('returns correct message for e3301', () => {
        expect(adminQuestionErrorCodes('e3301')).toBe('Correct answer cannot be empty');
    });

    test('returns correct message for e3302', () => {
        expect(adminQuestionErrorCodes('e3302')).toBe('Correct answer should less than 100 characters');
    });

    test('returns correct message for e3304', () => {
        expect(adminQuestionErrorCodes('e3304')).toBe('Please select correct answer');
    });

    test('returns correct message for e3400', () => {
        expect(adminQuestionErrorCodes('e3400')).toBe('Invalid file format');
    });

    test('returns correct message for e3401', () => {
        expect(adminQuestionErrorCodes('e3401')).toBe('File size should be less than 2 MB');
    });

    test('returns correct message for e3011', () => {
        expect(adminQuestionErrorCodes('e3011')).toBe('Question already exists in the questionnaire. Unable to delete');
    });
    test('returns correct message for e3206', () => {
        expect(adminQuestionErrorCodes('e3206')).toBe('Option list cannot be empty');
    });
    test('returns correct message for e4203', () => {
        expect(adminQuestionErrorCodes('e4203')).toBe('Invalid Csv file headers');
    });

    test('returns correct message for e4200', () => {
        expect(adminQuestionErrorCodes('e4200')).toBe('CSV file is required');
    });
    test('returns correct message for e4201', () => {
        expect(adminQuestionErrorCodes('e4201')).toBe('Please upload a valid csv file');
    });

    test('returns correct message for e4204', () => {
        expect(adminQuestionErrorCodes('e4204')).toBe('csv file is empty');
    });
    test('returns correct message for e3501', () => {
        expect(adminQuestionErrorCodes('e3501')).toBe('Please choose question type');
    });
    test('returns correct message for e3500', () => {
        expect(adminQuestionErrorCodes('e3500')).toBe('Question type is required');
    });

    test('returns correct message for e4101', () => {
        expect(adminQuestionErrorCodes('e4101')).toBe('Please choose question difficulty level');
    });
    test('returns correct message for e3305', () => {
        expect(adminQuestionErrorCodes('e3305')).toBe('Only one correct answer is allowed for this question type');
    });
    test('returns correct message for e3207', () => {
        expect(adminQuestionErrorCodes('e3207')).toBe('Please enter 2 options');
    });


    test('returns unknown error message for unknown error code', () => {
        expect(adminQuestionErrorCodes('unknown')).toBe('Unknown error occurred');
    });
});
