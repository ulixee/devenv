import IValidationResult, { IValidationError } from '../interfaces/IValidationResult';
export interface IBaseConfig<TOptional extends boolean = boolean> {
    optional?: TOptional;
    description?: string;
}
export default abstract class BaseSchema<Type, TOptional extends boolean = boolean, Config extends IBaseConfig<TOptional> = IBaseConfig<TOptional>> {
    readonly $type: Type;
    optional: TOptional;
    description?: string;
    abstract readonly typeName: string;
    constructor(config?: Config);
    validate(value: any, path?: string, validationTracker?: IValidationTracker): IValidationResult;
    protected abstract validationLogic(value: any, path: string, validationTracker: IValidationTracker): void;
    protected incorrectType(value: unknown, path: string, tracker: IValidationTracker): void;
    protected failedConstraint(value: unknown, message: string, path: string, tracker: IValidationTracker): void;
    protected propertyMissing(property: BaseSchema<any>, path: string, tracker: IValidationTracker): void;
    static inspect(schema: any, needsParens?: boolean, circular?: Set<BaseSchema<any, boolean, IBaseConfig<boolean>>>): string;
}
export declare function isDefined(value: any): boolean;
export type IValidationTracker = {
    errors: IValidationError[];
    has(candidate: object, type: BaseSchema<any, boolean>): boolean;
};
