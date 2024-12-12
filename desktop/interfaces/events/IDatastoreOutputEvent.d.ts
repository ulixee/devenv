export default interface IDatastoreOutputEvent {
    output: any;
    bytes: number;
    changes: {
        path: string;
        type: string;
    }[];
}
