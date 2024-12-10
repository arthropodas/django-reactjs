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



    test('returns correct message for e3900', () => {
        expect(adminShortlistErrorCodes('e3900')).toBe('Exam not found');
    });
    test('returns correct message for e4600', () => {
        expect(adminShortlistErrorCodes('e4600')).toBe("Can't shortlist students. Exam is not completed");
    });
    test('returns correct message for e4601', () => {
        expect(adminShortlistErrorCodes('e4601')).toBe('No students met the criteria');
    });
    test('returns correct message for e4602', () => {
        expect(adminShortlistErrorCodes('e4602')).toBe('Cut off mark and category criteria not met');
    });


    test('returns correct message for e4702', () => {
        expect(adminShortlistErrorCodes('e4702')).toBe('Invalid input. Provide either cut-off mark or categories');
    });
    test('returns correct message for e4703', () => {
        expect(adminShortlistErrorCodes('e4703')).toBe('No students met the cut-off mark');
    });


    test('returns correct message for e4006', () => {
        expect(adminShortlistErrorCodes('e4006')).toBe('No students found');
    });
    test('returns correct message for e4704', () => {
        expect(adminShortlistErrorCodes('e4704')).toBe('No students met both cut-off and category criteria');
    });

    test('returns correct message for e4718', () => {
        expect(adminShortlistErrorCodes('e4718')).toBe('Some emails failed to send');
    });
});
