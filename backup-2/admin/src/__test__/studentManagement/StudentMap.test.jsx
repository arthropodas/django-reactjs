import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import StudentMap from "../../pages/admin/studentManagement/StudentMap";

describe("rendering student map component",()=>{
    test('initial rendering',()=>{
        render(
            <StudentMap/>
        );
    });
})
