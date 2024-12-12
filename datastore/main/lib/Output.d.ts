import IObservableChange from '../interfaces/IObservableChange';
export interface IOutputClass<T> {
    new (data?: T): T & {
        emit(): void;
    };
    emit(data: T): void;
    Type: T & {
        emit(): void;
    };
}
interface IInternalOutputOptions<TOutput> {
    outputs: TOutput[];
    onNewOutput(index: number): any;
    onOutputEmitted(index: number, output: TOutput): any;
    onOutputChanges(index: number, output: TOutput, changes: IObservableChange[]): void;
}
export default function createOutputGenerator<TOutput>(internal: IInternalOutputOptions<TOutput>): IOutputClass<TOutput>;
export {};
