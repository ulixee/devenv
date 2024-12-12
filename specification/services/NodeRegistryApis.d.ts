import { z } from 'zod';
import { IZodHandlers, IZodSchemaToApiTypes } from '../utils/IZodApi';
declare const CloudNodeMetaSchema: z.ZodObject<z.objectUtil.extendShape<{
    nodeId: z.ZodString;
    apiHost: z.ZodString;
}, {
    isClusterNode: z.ZodBoolean;
    lastSeenDate: z.ZodDate;
}>, "strip", z.ZodTypeAny, {
    nodeId: string;
    apiHost: string;
    isClusterNode: boolean;
    lastSeenDate: Date;
}, {
    nodeId: string;
    apiHost: string;
    isClusterNode: boolean;
    lastSeenDate: Date;
}>;
export declare const NodeRegistryApiSchemas: {
    'NodeRegistry.register': {
        args: z.ZodObject<Omit<z.objectUtil.extendShape<{
            nodeId: z.ZodString;
            apiHost: z.ZodString;
        }, {
            isClusterNode: z.ZodBoolean;
            lastSeenDate: z.ZodDate;
        }>, "isClusterNode" | "lastSeenDate">, "strip", z.ZodTypeAny, {
            nodeId: string;
            apiHost: string;
        }, {
            nodeId: string;
            apiHost: string;
        }>;
        result: z.ZodObject<{
            nodes: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
                nodeId: z.ZodString;
                apiHost: z.ZodString;
            }, {
                isClusterNode: z.ZodBoolean;
                lastSeenDate: z.ZodDate;
            }>, "strip", z.ZodTypeAny, {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }, {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            nodes: {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }[];
        }, {
            nodes: {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }[];
        }>;
    };
    'NodeRegistry.getNodes': {
        args: z.ZodObject<{
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            count: number;
        }, {
            count: number;
        }>;
        result: z.ZodObject<{
            nodes: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
                nodeId: z.ZodString;
                apiHost: z.ZodString;
            }, {
                isClusterNode: z.ZodBoolean;
                lastSeenDate: z.ZodDate;
            }>, "strip", z.ZodTypeAny, {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }, {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            nodes: {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }[];
        }, {
            nodes: {
                nodeId: string;
                apiHost: string;
                isClusterNode: boolean;
                lastSeenDate: Date;
            }[];
        }>;
    };
    'NodeRegistry.health': {
        args: z.ZodObject<{
            nodeId: z.ZodString;
            coreMetrics: z.ZodObject<{
                datastoreQueries: z.ZodNumber;
                heroSessions: z.ZodNumber;
                heroPoolSize: z.ZodNumber;
                heroPoolAvailable: z.ZodNumber;
                periodStartTime: z.ZodDate;
            }, "strip", z.ZodTypeAny, {
                datastoreQueries: number;
                heroSessions: number;
                heroPoolSize: number;
                heroPoolAvailable: number;
                periodStartTime: Date;
            }, {
                datastoreQueries: number;
                heroSessions: number;
                heroPoolSize: number;
                heroPoolAvailable: number;
                periodStartTime: Date;
            }>;
            clientConnections: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            nodeId: string;
            coreMetrics: {
                datastoreQueries: number;
                heroSessions: number;
                heroPoolSize: number;
                heroPoolAvailable: number;
                periodStartTime: Date;
            };
            clientConnections: number;
        }, {
            nodeId: string;
            coreMetrics: {
                datastoreQueries: number;
                heroSessions: number;
                heroPoolSize: number;
                heroPoolAvailable: number;
                periodStartTime: Date;
            };
            clientConnections: number;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
};
export type ICloudNodeMeta = z.infer<typeof CloudNodeMetaSchema>;
export type INodeRegistryApiTypes = IZodSchemaToApiTypes<typeof NodeRegistryApiSchemas>;
export type INodeRegistryApis<TContext = any> = IZodHandlers<typeof NodeRegistryApiSchemas, TContext>;
export default INodeRegistryApiTypes;
