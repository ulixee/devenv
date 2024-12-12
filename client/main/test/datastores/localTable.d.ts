import { Table } from '@ulixee/datastore';
declare const _default: Table<{
    firstName: import("@ulixee/schema/lib/StringSchema").default<false>;
    lastName: import("@ulixee/schema/lib/StringSchema").default<false>;
    birthdate: import("@ulixee/schema/lib/DateSchema").default<true>;
    commits: import("@ulixee/schema/lib/BigintSchema").default<true>;
}, {
    firstName: string;
    lastName: string;
    birthdate?: Date;
    commits?: bigint;
}>;
export default _default;
