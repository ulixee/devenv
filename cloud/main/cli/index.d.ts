import { Command } from 'commander';
import { CloudNode } from '../index';
export default function cliCommands(options?: {
    suppressLogs: boolean;
    onStart?: (node: CloudNode) => Promise<void>;
}): Command;
export declare function startCloudViaCli(opts: any): Promise<CloudNode>;
