import { z } from 'zod';
export declare const NodeInfoSchema: z.ZodObject<{
    nodeId: z.ZodString;
    apiHost: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nodeId: string;
    apiHost: string;
}, {
    nodeId: string;
    apiHost: string;
}>;
type INodeInfo = z.infer<typeof NodeInfoSchema>;
export default INodeInfo;
