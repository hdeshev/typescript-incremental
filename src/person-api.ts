/// <reference path="person.d.ts"/>

import {Person} from "person";

export function savePerson(p: Person): void {
    console.log("Saving person: " + p.name);
}
