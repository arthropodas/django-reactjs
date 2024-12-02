import adminExamErrorCodes from "../../pages/admin/examManagement/ExamErrorCodes";

describe('adminExamErrorCodes', () => {

    it('should return correct error message for known error codes', () => {
        expect(adminExamErrorCodes("e1026")).toBe("Institution Id is required");
        expect(adminExamErrorCodes("e1027")).toBe("Institution Id is invalid");
        expect(adminExamErrorCodes("e1028")).toBe("Institution not found");
        expect(adminExamErrorCodes("e1029")).toBe("Exam name is required");
        expect(adminExamErrorCodes("e1030")).toBe("Exam name is invalid");
        expect(adminExamErrorCodes("e1031")).toBe("Exam name is too small");
        expect(adminExamErrorCodes("e1032")).toBe("Exam name is too big");
        expect(adminExamErrorCodes("e1033")).toBe("Dont add space as the first or last letter for exam name");
        expect(adminExamErrorCodes("e1034")).toBe("Exam date is invalid and it should be in the format yyyy-mm-dd");
        expect(adminExamErrorCodes("e1040")).toBe("Exam date is required");
        expect(adminExamErrorCodes("e1041")).toBe("Exam time is required");
        expect(adminExamErrorCodes("e1042")).toBe("Exam time is invalid should be in HH:MM:SS format");
        expect(adminExamErrorCodes("e1043")).toBe("Total number of questions is required");
        expect(adminExamErrorCodes("e1044")).toBe("Invalid total number of questions");
        expect(adminExamErrorCodes("e1045")).toBe("Exam duration is required");
        expect(adminExamErrorCodes("e1046")).toBe("Invalid exam duration");
        expect(adminExamErrorCodes("e1047")).toBe("Question categories are required");
        expect(adminExamErrorCodes("e1048")).toBe("Invalid question categories data");
        expect(adminExamErrorCodes("e1049")).toBe("There is a missmatch in the total questions and sum of total questions in the section");
        expect(adminExamErrorCodes("e1050")).toBe("Exam date should be this year");
        expect(adminExamErrorCodes("e1051")).toBe("Invalid question section");
        expect(adminExamErrorCodes("e1052")).toBe("The total number of questions in each section should be an instance of integer");
        expect(adminExamErrorCodes("e1053")).toBe("The weightage for each section should be an instance of float");
        expect(adminExamErrorCodes("e1054")).toBe("Question section id must not be repeated");
        expect(adminExamErrorCodes("e1055")).toBe("Exam not found");
        expect(adminExamErrorCodes("e1056")).toBe("Unable to edit exam since it is started or");
        expect(adminExamErrorCodes("e1057")).toBe("Give proper exam date and exam time");
        expect(adminExamErrorCodes("e1060")).toBe("status of exam is required");
        expect(adminExamErrorCodes("e1061")).toBe("Invalid status for exam");
        expect(adminExamErrorCodes("e1062")).toBe("Unable to cancel the exam since it is already completed");
        expect(adminExamErrorCodes("e1063")).toBe("Year should be valid and in the format yyyy");
        expect(adminExamErrorCodes("e1064")).toBe("enrolledStudents query param is required");
        expect(adminExamErrorCodes("e1065")).toBe("enrolledStudents param must be eigther 0 or 1");
        expect(adminExamErrorCodes("e2045")).toBe("Question paper already exists");
        expect(adminExamErrorCodes("e2080")).toBe("exam date should not be past");
        expect(adminExamErrorCodes("e2081")).toBe("exam time should not be past");
        expect(adminExamErrorCodes("e1081")).toBe("Exam not completed");
        expect(adminExamErrorCodes("e1086")).toBe("Cannot display the list as the path param is invalid");
        expect(adminExamErrorCodes("e1078")).toBe("The total number of questions available is less than the given number of questions");


        expect(adminExamErrorCodes("e4303")).toBe("Exam already exist");
        expect(adminExamErrorCodes("e4304")).toBe("Exams not found");
        expect(adminExamErrorCodes("e1123")).toBe("No students are mapped in exam");
        expect(adminExamErrorCodes("e4305")).toBe("Unable to update the exam");
        expect(adminExamErrorCodes("e2226")).toBe("Invalid Questionnaire Id entered");

    });

    it('should return "Unknown error occurred" for unknown error codes', () => {
        expect(adminExamErrorCodes("unknown_code")).toBe("Unknown error occurred");
    });

});
