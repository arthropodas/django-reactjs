import React from "react";
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { LoginErrorCodes } from "../../pages/admin/login/LoginErrorCodes";

describe("rendering login errorcode", ()=>{
    test("expecting the errorcodes",()=>{
        render(<LoginErrorCodes/>)
        expect(LoginErrorCodes("e2000")).toBe("Email is required");
        expect(LoginErrorCodes("e2001")).toBe("password is required");
        expect(LoginErrorCodes("e2002")).toBe("Invalid email");
        expect(LoginErrorCodes("e2003")).toBe("Invalid password");
        expect(LoginErrorCodes("e2004")).toBe("Invalid password or email credentials");
        expect(LoginErrorCodes("unknownCode")).toBe("Unknown error occured");
    })
});