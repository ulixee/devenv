import * as Http from 'node:http';
export default function staticServe(staticDir: string, cacheTime?: number): (req: Http.IncomingMessage, res: Http.ServerResponse) => Promise<void>;
