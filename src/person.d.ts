/// <reference path="address.d.ts" />
declare module "person" {
    import {Address} from "address";

    export class Person {
        public name: string;
        public address: Address;
    }
}
