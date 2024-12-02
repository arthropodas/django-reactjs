import adminInstitutionErrorCodes from "../../pages/admin/institutions/InstitutionErrorCodes";

describe('adminInstitutionErrorCodes', () => {

  it('should return "Exception" for error code "e1010"', () => {
    const result = adminInstitutionErrorCodes('e1010');
    expect(result).toBe('An unexpected error occurred. Please try again.');
  });

  it('should return "Institution name is required" for error code "e1011"', () => {
    const result = adminInstitutionErrorCodes('e1011');
    expect(result).toBe('Institution name is required.');
  });

  it('should return "Institution name must be string" for error code "e1014"', () => {
    const result = adminInstitutionErrorCodes('e1014');
    expect(result).toBe('Institution name must be a valid text.');
  });

  it('should return "Institution name length less than 3" for error code "e1013"', () => {
    const result = adminInstitutionErrorCodes('e1013');
    expect(result).toBe('Institution name must be at least 3 characters long.');
  });

  it('should return "Institution name length greater than 100" for error code "e1012"', () => {
    const result = adminInstitutionErrorCodes('e1012');
    expect(result).toBe('Institution name cannot be longer than 100 characters.');
  });

  it('should return "Added space as first or last character of name" for error code "e1019"', () => {
    const result = adminInstitutionErrorCodes('e1019');
    expect(result).toBe('Please remove spaces at the beginning or end of the name.');
  });

  it('should return "code required" for error code "e1015"', () => {
    const result = adminInstitutionErrorCodes('e1015');
    expect(result).toBe('Institution code is required.');
  });

  it('should return "code should be string" for error code "e1018"', () => {
    const result = adminInstitutionErrorCodes('e1018');
    expect(result).toBe('Institution code must be a valid text.');
  });

  it('should return "code less than 6 in length" for error code "e1016"', () => {
    const result = adminInstitutionErrorCodes('e1016');
    expect(result).toBe('Institution code must be at least 6 characters long.');
  });

  it('should return "code greater than 10 in length" for error code "e1017"', () => {
    const result = adminInstitutionErrorCodes('e1017');
    expect(result).toBe('Institution code cannot be longer than 10 characters.');
  });

  it('should return "avoid spaces in search" for error code "e1020"', () => {
    const result = adminInstitutionErrorCodes('e1020');
    expect(result).toBe('Please avoid using spaces in search.');
  });

  it('should return "Institute with same code exists" for error code "e1021"', () => {
    const result = adminInstitutionErrorCodes('e1021');
    expect(result).toBe('An institution with this code already exists.');
  });

  it('should return "No institute" for error code "e1022"', () => {
    const result = adminInstitutionErrorCodes('e1022');
    expect(result).toBe('Institution not found.');
  });

  it('should return "Already deleted" for error code "e1023"', () => {
    const result = adminInstitutionErrorCodes('e1023');
    expect(result).toBe('This institution has already been deleted.');
  });

  it('should return "Institution already exist with the given mail id" for error code "e1037"', () => {
    const result = adminInstitutionErrorCodes('e1037');
    expect(result).toBe('An institution with this email already exists.');
  });

  it('should return "Entered an Invalid mail id" for error code "e1036"', () => {
    const result = adminInstitutionErrorCodes('e1036');
    expect(result).toBe('Email address provided is invalid.');
  });

  test('should return "Institution not found" for error code "e2028"', () => {
    expect(adminInstitutionErrorCodes("e2028")).toBe("Institution not found.");
  });

  test('should return "Cannot display the list as the path param is invalid" for error code "e1086"', () => {
    expect(adminInstitutionErrorCodes("e1086")).toBe("Unable to display the list due to an invalid parameter.");
  });

  test('should return "Coordinator name is required" for error code "e1087"', () => {
    expect(adminInstitutionErrorCodes("e1087")).toBe("Coordinator name is required.");
  });

  test('should return "Coordinator name is invalid" for error code "e1088"', () => {
    expect(adminInstitutionErrorCodes("e1088")).toBe("Please provide a valid coordinator name.");
  });

  test('should return "Coordinator name too short" for error code "e1089"', () => {
    expect(adminInstitutionErrorCodes("e1089")).toBe("Coordinator name is too short.");
  });

  test('should return "Coordinator name too long" for error code "e1090"', () => {
    expect(adminInstitutionErrorCodes("e1090")).toBe("Coordinator name is too long.");
  });

  test('should return "Coordinator name should not have space" for error code "e1091"', () => {
    expect(adminInstitutionErrorCodes("e1091")).toBe("Coordinator name should not contain spaces.");
  });

  test('should return "Coordinator email is not required" for error code "e1092"', () => {
    expect(adminInstitutionErrorCodes("e1092")).toBe("Coordinator email is not required.");
  });

  test('should return "Coordinator email is invalid" for error code "e1093"', () => {
    expect(adminInstitutionErrorCodes("e1093")).toBe("Coordinator email is invalid.");
  });

  test('should return "Coordinator phone number is not given" for error code "e1094"', () => {
    expect(adminInstitutionErrorCodes("e1094")).toBe("Coordinator phone number is required.");
  });

  test('should return "Coordinator phone number is invalid" for error code "e1095"', () => {
    expect(adminInstitutionErrorCodes("e1095")).toBe("Coordinator phone number is invalid.");
  });

  it('should return "Unknown error occurred" for an unhandled error code', () => {
    const result = adminInstitutionErrorCodes('unknownCode');
    expect(result).toBe('Something went wrong. Please try again later.');
  });

  
  it('should return "Coordinator email must be unique.', () => {
    const result = adminInstitutionErrorCodes('e1096');
    expect(result).toBe('Coordinator email must be unique.');
  });


  it('should return "Cannot delete the institution as it still has mapped students. e1125', () => {
    const result = adminInstitutionErrorCodes('e1125');
    expect(result).toBe('Cannot delete the institution as it still has mapped students.');
  });


});
