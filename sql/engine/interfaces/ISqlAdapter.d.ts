import { IDbJsTypes, IDbTypeNames } from './IDbTypes';
export default interface ISqlAdapter {
    toEngineType(type: IDbTypeNames): string;
    fromEngineValue(type: IDbTypeNames, value: any): IDbJsTypes;
    toEngineValue(type: IDbTypeNames, value: IDbJsTypes): [serialized: any, temporaryType?: IDbTypeNames];
}
