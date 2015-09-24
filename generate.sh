#!/bin/sh

generate_modules() {
    NUM=$1

    cat <<EOF > src/generated/department-$NUM.ts
export class Department {
    constructor(public name?: string) {
    }
}
EOF

    cat <<EOF > src/generated/department-$NUM.d.ts
declare module "department-$NUM" {
    export class Department {
        constructor(name?: string);
        name: string;
    }
}
EOF

    cat <<EOF > src/generated/department-api-$NUM.ts
/// <reference path="department-$NUM.d.ts"/>

import {Department} from "department-$NUM";

export function createDepartment(name: string): Department {
    return new Department(name);
}
EOF

}

mkdir -p src/generated

for i in $(seq 1 1000) ; do
    generate_modules $i
done
