import { z } from 'zod';
import { IZodSchemaToApiTypes } from '../utils/IZodApi';
export declare const DatabrokerAdminApisSchema: {
    'System.overview': {
        args: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        result: z.ZodObject<{
            localchainBalance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            localchainAddress: z.ZodString;
            totalOrganizationBalance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            grantedBalance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            organizations: z.ZodNumber;
            users: z.ZodNumber;
            channelHolds: z.ZodNumber;
            openChannelHolds: z.ZodNumber;
            balancePendingChannelHoldSettlement: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }, "strip", z.ZodTypeAny, {
            localchainBalance: bigint;
            localchainAddress: string;
            totalOrganizationBalance: bigint;
            grantedBalance: bigint;
            organizations: number;
            users: number;
            channelHolds: number;
            openChannelHolds: number;
            balancePendingChannelHoldSettlement: bigint;
        }, {
            localchainAddress: string;
            organizations: number;
            users: number;
            channelHolds: number;
            openChannelHolds: number;
            localchainBalance?: unknown;
            totalOrganizationBalance?: unknown;
            grantedBalance?: unknown;
            balancePendingChannelHoldSettlement?: unknown;
        }>;
    };
    'Organization.create': {
        args: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }, "strip", z.ZodTypeAny, {
            balance: bigint;
            name?: string | undefined;
        }, {
            balance?: unknown;
            name?: string | undefined;
        }>;
        result: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    'Organization.editName': {
        args: z.ZodObject<{
            organizationId: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            organizationId: string;
            name?: string | undefined;
        }, {
            organizationId: string;
            name?: string | undefined;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'Organization.grant': {
        args: z.ZodObject<{
            organizationId: z.ZodString;
            amount: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }, "strip", z.ZodTypeAny, {
            organizationId: string;
            amount: bigint;
        }, {
            organizationId: string;
            amount?: unknown;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'Organization.delete': {
        args: z.ZodObject<{
            organizationId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            organizationId: string;
        }, {
            organizationId: string;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'Organization.get': {
        args: z.ZodObject<{
            organizationId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            organizationId: string;
        }, {
            organizationId: string;
        }>;
        result: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            balanceInChannelHolds: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            balance: bigint;
            balanceInChannelHolds: bigint;
            name?: string | undefined;
        }, {
            id: string;
            balance?: unknown;
            name?: string | undefined;
            balanceInChannelHolds?: unknown;
        }>;
    };
    'Organization.list': {
        args: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        result: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            balance: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
            balanceInChannelHolds: z.ZodEffects<z.ZodBigInt, bigint, unknown>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            balance: bigint;
            balanceInChannelHolds: bigint;
            name?: string | undefined;
        }, {
            id: string;
            balance?: unknown;
            name?: string | undefined;
            balanceInChannelHolds?: unknown;
        }>, "many">;
    };
    'Organization.users': {
        args: z.ZodObject<{
            organizationId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            organizationId: string;
        }, {
            organizationId: string;
        }>;
        result: z.ZodArray<z.ZodObject<{
            identity: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            identity: string;
            name?: string | undefined;
        }, {
            identity: string;
            name?: string | undefined;
        }>, "many">;
    };
    'User.create': {
        args: z.ZodObject<{
            organizationId: z.ZodString;
            identity: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            organizationId: string;
            identity: string;
            name?: string | undefined;
        }, {
            organizationId: string;
            identity: string;
            name?: string | undefined;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'User.editName': {
        args: z.ZodObject<{
            identity: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            identity: string;
            name?: string | undefined;
        }, {
            identity: string;
            name?: string | undefined;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'User.delete': {
        args: z.ZodObject<{
            identity: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            identity: string;
        }, {
            identity: string;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'WhitelistedDomains.list': {
        args: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        result: z.ZodArray<z.ZodString, "many">;
    };
    'WhitelistedDomains.add': {
        args: z.ZodObject<{
            domain: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            domain: string;
        }, {
            domain: string;
        }>;
        result: z.ZodObject<{
            success: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
        }, {
            success: boolean;
        }>;
    };
    'WhitelistedDomains.delete': {
        args: z.ZodObject<{
            domain: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            domain: string;
        }, {
            domain: string;
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
type IDatabrokerAdminApiTypes = IZodSchemaToApiTypes<typeof DatabrokerAdminApisSchema>;
export { IDatabrokerAdminApiTypes };
export default IDatabrokerAdminApiTypes;
