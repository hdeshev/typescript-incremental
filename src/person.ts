/// <reference path="address.d.ts" />

import {Address} from "address";

export class Person {
    constructor(public name?: string, public address?: Address) {
    }
}
