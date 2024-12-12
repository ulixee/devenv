import { IBounds } from '../IBounds';
export default interface IAppApi {
    connect(args: {
        workarea: IBounds & {
            scale: number;
        };
    }): Promise<{
        id: string;
        cloudNodes: number;
    }>;
}
export declare function IAppApiStatics(staticClass: IAppApi): void;
