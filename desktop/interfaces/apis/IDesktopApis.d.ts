export interface ICloudConnected {
    type: 'local' | 'public' | 'private';
    name: string;
    address: string;
    adminIdentity?: string;
    cloudNodes: number;
    oldAddress?: string;
}
