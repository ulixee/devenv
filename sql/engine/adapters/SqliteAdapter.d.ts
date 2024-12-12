import ISqlAdapter from '../interfaces/ISqlAdapter';
import { IDbJsTypes, IDbTypeNames } from '../interfaces/IDbTypes';
export default class SqliteAdapter implements ISqlAdapter {
    toEngineType(type: IDbTypeNames): string;
    fromEngineValue(type: IDbTypeNames, value: any): IDbJsTypes;
    toEngineValue(type: IDbTypeNames, value: IDbJsTypes): [serialized: any, temporaryType?: IDbTypeNames];
}
