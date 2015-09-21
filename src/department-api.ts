/// <reference path="department.d.ts"/>

import {Department} from "department";

export function createDepartment(name: string): Department {
    return new Department(name);
}
