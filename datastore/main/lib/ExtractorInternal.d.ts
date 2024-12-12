import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import IExtractorComponents from '../interfaces/IExtractorComponents';
import IExtractorContext from '../interfaces/IExtractorContext';
import IExtractorRunOptions from '../interfaces/IExtractorRunOptions';
import IExtractorSchema, { ExtractSchemaType } from '../interfaces/IExtractorSchema';
import IObservableChange from '../interfaces/IObservableChange';
import DatastoreSchemaError from './DatastoreSchemaError';
import { IOutputClass } from './Output';
import ResultIterable from './ResultIterable';
export default class ExtractorInternal<TSchema extends IExtractorSchema<any, any>, TOptions extends IExtractorRunOptions<TSchema> = IExtractorRunOptions<TSchema>, TInput extends ExtractSchemaType<TSchema['input']> = ExtractSchemaType<TSchema['input']>, TOutput extends ExtractSchemaType<TSchema['output']> = ExtractSchemaType<TSchema['output']>> extends TypedEventEmitter<{
    close: void;
}> {
    #private;
    private components;
    readonly outputs: (TOutput & {
        emit(): void;
    })[];
    readonly options: TOptions;
    readonly schema: TSchema;
    readonly Output: IOutputClass<TOutput>;
    onOutputChanges: (index: number, changes: IObservableChange[]) => any;
    onOutputRecord: (index: number, output: TOutput) => void;
    constructor(options: TOptions, components: IExtractorComponents<TSchema, any>);
    run(context: IExtractorContext<TSchema>): ResultIterable<TOutput>;
    emitPendingOutputs(): void;
    get isClosing(): boolean;
    get input(): TInput;
    close(closeFn?: () => Promise<void>): Promise<void>;
    validateInput(): DatastoreSchemaError;
    validateOutput(output: TOutput, counter: number): void;
    protected onOutputEmitted(index: number, output: TOutput): void;
    protected onNewOutput(index: number): void;
    protected defaultOnOutputChanges(index: number, output: TOutput, changes: IObservableChange[]): void;
    static fillInputWithExamples(schema: IExtractorSchema, input: Record<string, any>): any;
    static createExampleCall(functionName: string, schema: IExtractorSchema): {
        formatted: string;
        args: Record<string, any>;
    };
}
