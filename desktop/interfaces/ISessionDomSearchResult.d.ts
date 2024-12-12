import IElementSummary from './IElementSummary';
export default interface ISessionDomSearchResult {
    searchingContext: ISearchContext;
    elements: IElementSummary[];
}
export interface ISearchContext {
    tabId: number;
    baseTime: number;
    startTime: number;
    endTime: number;
    documentUrl: string;
}
