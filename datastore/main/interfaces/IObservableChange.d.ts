export default interface IObservableChange {
    path: PropertyKey[];
    type: ObservableChangeType;
    value?: any;
}
export declare enum ObservableChangeType {
    insert = "insert",
    update = "update",
    delete = "delete",
    reorder = "reorder"
}
