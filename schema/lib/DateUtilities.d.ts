export type IUnits = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';
interface IDateFunction {
    func: 'add' | 'subtract';
    quantity: number;
    units: IUnits;
}
export declare class DateUtilities implements IDateFunction {
    func: 'add' | 'subtract';
    quantity: number;
    units: IUnits;
    constructor(config: IDateFunction);
    evaluate(format: 'date' | 'time'): string;
    evaluate(): Date;
}
export {};
