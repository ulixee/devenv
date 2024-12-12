interface IConfig {
    host: string;
    database: string;
    client_encoding?: string;
    user?: string;
    password?: string;
    port?: string;
    sslcert?: string;
    sslkey?: string;
    sslrootcert?: string;
    sslmode?: string;
    ssl?: boolean | {
        cert?: string;
        key?: string;
        ca?: string;
        rejectUnauthorized?: boolean;
    };
}
export default class ConnectionString {
    static parse(str: string): IConfig;
}
export {};
