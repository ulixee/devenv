type ILocationStringOrObject = string | ILocationObject;
export default ILocationStringOrObject;
interface ILocationObject {
    connectionString?: string;
    user?: string;
    password?: string;
    host?: string;
    port?: string | number;
    database?: string;
}
