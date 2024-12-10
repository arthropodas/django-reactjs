import { SummaryReportErrorCodes } from "../../pages/admin/studentSummaryReport/SummaryReportErrorCodes";


describe('SummaryReportErrorCodes function', () => {
    test('should return "Invalid batch id" for error code "e1111"', () => {
        const errorCode = "e1111";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Invalid batch id");
    });

    test('should return "No student found" for error code "e1112"', () => {
        const errorCode = "e1112";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("No student found");
    });

    test('should return "No batch found" for error code "e1113"', () => {
        const errorCode = "e1113";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("No batch found");
    });

    test('should return "Student is already mapped with an exam" for error code "e1114"', () => {
        const errorCode = "e1114";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Student is already mapped with an exam");
    });

    test('should return "No batch id" for error code "e1115"', () => {
        const errorCode = "e1115";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("No batch id");
    });

    test('should return "Invalid batch id" for error code "e1116"', () => {
        const errorCode = "e1116";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Invalid batch id");
    });

    test('should return "Please ensure that there is a valid exam which is started" for error code "e1117"', () => {
        const errorCode = "e1117";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Please ensure that there is a valid exam which is started");
    });

    test('should return "Exam is cancelled" for error code "e1118"', () => {
        const errorCode = "e1118";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Exam is cancelled");
    });

    test('should return "The student hasn\'t completed the exam" for error code "e1119"', () => {
        const errorCode = "e1119";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("The student hasn't completed the exam");
    });

    test('should return "Student not found" for error code "e1120"', () => {
        const errorCode = "e1120";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Student not found");
    });

    test('should return "Batch not found" for error code "e1121"', () => {
        const errorCode = "e1121";
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Batch not found");
    });

    test('should return "Unknown error" for an unknown error code', () => {
        const errorCode = "e9999"; // a code that doesn't exist in the switch statement
        const result = SummaryReportErrorCodes(errorCode);
        expect(result).toBe("Unknown error");
    });
});
