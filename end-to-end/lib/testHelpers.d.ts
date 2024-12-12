export declare const describeIntegration: jest.Describe;
export declare function getProxy(): Promise<string>;
export declare function getDockerPortMapping(containerName: string, port: number): Promise<string>;
export declare function cleanHostForDocker(host: string): string;
