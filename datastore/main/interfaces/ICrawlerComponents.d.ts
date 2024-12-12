import ICrawlerOutputSchema from './ICrawlerOutputSchema';
export default interface ICrawlerComponents<TSchema, TContext, TDisableCache extends boolean = false> {
    name?: string;
    description?: string;
    basePrice?: number;
    schema?: TSchema;
    disableCache?: TDisableCache;
    backwardsCompatible?: boolean;
    run(context: TContext): Promise<{
        toCrawlerOutput(): Promise<ICrawlerOutputSchema>;
    }>;
}
