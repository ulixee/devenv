import IConnectionToClient from '@ulixee/net/interfaces/IConnectionToClient';
import ITransport from '@ulixee/net/interfaces/ITransport';
import ConnectionToClient from '@ulixee/net/lib/ConnectionToClient';
import { IDatabrokerAdminApis } from '@ulixee/platform-specification/datastore';
import IDatabrokerApiContext from '../interfaces/IDatabrokerApiContext';
export type TAdminApis = IDatabrokerAdminApis<IDatabrokerApiContext>;
export type TConnectionToServicesClient = IConnectionToClient<TAdminApis, {}>;
export default class AdminApiEndpoints {
    readonly connections: Set<ConnectionToClient<import("@ulixee/platform-specification/utils/IZodApi").IZodHandlers<{
        'System.overview': {
            args: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
            result: import("zod").ZodObject<{
                localchainBalance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                localchainAddress: import("zod").ZodString;
                totalOrganizationBalance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                grantedBalance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                organizations: import("zod").ZodNumber;
                users: import("zod").ZodNumber;
                channelHolds: import("zod").ZodNumber;
                openChannelHolds: import("zod").ZodNumber;
                balancePendingChannelHoldSettlement: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
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
            args: import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodString>;
                balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
                balance: bigint;
                name?: string | undefined;
            }, {
                balance?: unknown;
                name?: string | undefined;
            }>;
            result: import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
        };
        'Organization.editName': {
            args: import("zod").ZodObject<{
                organizationId: import("zod").ZodString;
                name: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                organizationId: string;
                name?: string | undefined;
            }, {
                organizationId: string;
                name?: string | undefined;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'Organization.grant': {
            args: import("zod").ZodObject<{
                organizationId: import("zod").ZodString;
                amount: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
                organizationId: string;
                amount: bigint;
            }, {
                organizationId: string;
                amount?: unknown;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'Organization.delete': {
            args: import("zod").ZodObject<{
                organizationId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                organizationId: string;
            }, {
                organizationId: string;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'Organization.get': {
            args: import("zod").ZodObject<{
                organizationId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                organizationId: string;
            }, {
                organizationId: string;
            }>;
            result: import("zod").ZodObject<{
                id: import("zod").ZodString;
                name: import("zod").ZodOptional<import("zod").ZodString>;
                balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                balanceInChannelHolds: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
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
            args: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
            result: import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodString;
                name: import("zod").ZodOptional<import("zod").ZodString>;
                balance: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
                balanceInChannelHolds: import("zod").ZodEffects<import("zod").ZodBigInt, bigint, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
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
            args: import("zod").ZodObject<{
                organizationId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                organizationId: string;
            }, {
                organizationId: string;
            }>;
            result: import("zod").ZodArray<import("zod").ZodObject<{
                identity: import("zod").ZodString;
                name: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                identity: string;
                name?: string | undefined;
            }, {
                identity: string;
                name?: string | undefined;
            }>, "many">;
        };
        'User.create': {
            args: import("zod").ZodObject<{
                organizationId: import("zod").ZodString;
                identity: import("zod").ZodString;
                name: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                organizationId: string;
                identity: string;
                name?: string | undefined;
            }, {
                organizationId: string;
                identity: string;
                name?: string | undefined;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'User.editName': {
            args: import("zod").ZodObject<{
                identity: import("zod").ZodString;
                name: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                identity: string;
                name?: string | undefined;
            }, {
                identity: string;
                name?: string | undefined;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'User.delete': {
            args: import("zod").ZodObject<{
                identity: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                identity: string;
            }, {
                identity: string;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'WhitelistedDomains.list': {
            args: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
            result: import("zod").ZodArray<import("zod").ZodString, "many">;
        };
        'WhitelistedDomains.add': {
            args: import("zod").ZodObject<{
                domain: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                domain: string;
            }, {
                domain: string;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
        'WhitelistedDomains.delete': {
            args: import("zod").ZodObject<{
                domain: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                domain: string;
            }, {
                domain: string;
            }>;
            result: import("zod").ZodObject<{
                success: import("zod").ZodBoolean;
            }, "strip", import("zod").ZodTypeAny, {
                success: boolean;
            }, {
                success: boolean;
            }>;
        };
    }, IDatabrokerApiContext>, any, any>>;
    private readonly handlersByCommand;
    constructor();
    addConnection(transport: ITransport, context: IDatabrokerApiContext): TConnectionToServicesClient;
}
