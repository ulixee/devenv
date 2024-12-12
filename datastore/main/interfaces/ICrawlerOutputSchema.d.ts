export declare const CrawlerOutputSchema: {
    crawler: import("@ulixee/schema/lib/StringSchema").default<false>;
    version: import("@ulixee/schema/lib/StringSchema").default<false>;
    sessionId: import("@ulixee/schema/lib/StringSchema").default<false>;
};
export default interface ICrawlerOutputSchema {
    crawler: string;
    version: string;
    sessionId: string;
}
