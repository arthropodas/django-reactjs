import adminShortlistErrorCodes from "../../pages/admin/shortlist/ShortListedStudentsErrorCodes";

describe('adminShortlistErrorCodes', () => {
    test('returns correct message for e1010', () => {
        expect(adminShortlistErrorCodes('e1010')).toBe('Please enter a valid number');
    });

    test('returns correct message for e1079', () => {
        expect(adminShortlistErrorCodes('e1079')).toBe('Please enter a cutoff mark which is valid');
    });

    test('returns correct message for e1080', () => {
        expect(adminShortlistErrorCodes('e1080')).toBe('Please do not enter alphabets');
    });

    test('returns correct message for e4020', () => {
        expect(adminShortlistErrorCodes('e4020')).toBe('No students shortlisted');
    });

    test('returns unknown error message for unknown error code', () => {
        expect(adminShortlistErrorCodes('unknown')).toBe('Unknown error occurred');
    });
});
