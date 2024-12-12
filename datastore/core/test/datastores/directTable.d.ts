import { Table } from '@ulixee/datastore';
declare const _default: Table<{
    title: import("@ulixee/schema/lib/StringSchema").default<false>;
    success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
}, {
    success: boolean;
    title: string;
}>;
export default _default;
