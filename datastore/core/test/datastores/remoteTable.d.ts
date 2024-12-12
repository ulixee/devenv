import Datastore, { Table } from '@ulixee/datastore';
declare const _default: Datastore<{
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    [x: string]: any;
}, {
    id: string;
    version: string;
    tables: {
        remote: Table<{
            title: import("@ulixee/schema/lib/StringSchema").default<false>;
            success: import("@ulixee/schema/lib/BooleanSchema").default<false>;
        }, {
            success: boolean;
            title: string;
        }>;
    };
    onCreated(this: Datastore<{
        [x: string]: any;
    }, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }, import("@ulixee/datastore/interfaces/IDatastoreComponents").default<{
        [x: string]: any;
    }, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }>>): Promise<void>;
}>;
export default _default;
