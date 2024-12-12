import { Crawler } from '@ulixee/datastore';
import ICrawlerOutputSchema from '@ulixee/datastore/interfaces/ICrawlerOutputSchema';
import { IDatastoreBinding } from '@ulixee/datastore/lib/DatastoreInternal';
import ResultIterable from '@ulixee/datastore/lib/ResultIterable';
export default class ClientForCrawler<TCrawler extends Crawler> {
    private crawler;
    private readonly readyPromise;
    constructor(crawler: TCrawler, options?: IDatastoreBinding);
    crawl(inputFilter: TCrawler['schemaType']['input']): ResultIterable<ICrawlerOutputSchema>;
}
