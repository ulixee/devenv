"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = staticServe;
const Crypto = require("node:crypto");
const Fs = require("node:fs/promises");
const Path = require("node:path");
function staticServe(staticDir, cacheTime = 3600) {
    return async function handleStaticFileRequest(req, res) {
        if (req.url.startsWith('//'))
            req.url = req.url.slice(1);
        // strip off any query string
        const url = new URL(req.url, 'http://localhost');
        let filePath = Path.join(staticDir, url.pathname);
        if (filePath.endsWith(Path.sep)) {
            filePath = Path.join(filePath, `index.html`);
        }
        try {
            const stats = await Fs.stat(filePath);
            if (stats.isFile()) {
                // File found
                const ext = Path.extname(filePath);
                let contentType = 'text/plain';
                switch (ext) {
                    case '.html':
                        contentType = 'text/html';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.json':
                        contentType = 'application/json';
                        break;
                    case '.png':
                        contentType = 'image/png';
                        break;
                    case '.jpg':
                    case '.jpeg':
                        contentType = 'image/jpeg';
                        break;
                    case '.svg':
                        contentType = 'image/svg+xml';
                        break;
                    case '.gif':
                        contentType = 'image/gif';
                        break;
                }
                const data = await Fs.readFile(filePath);
                const hash = Crypto.createHash('md5').update(data).digest('hex');
                const etag = `"${hash}"`;
                if (req.headers['if-none-match'] === etag) {
                    res.statusCode = 304;
                    res.end();
                }
                else {
                    res.setHeader('Content-Type', contentType);
                    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src *");
                    res.setHeader('X-Content-Type-Options', 'nosniff');
                    res.setHeader('Cache-Control', `max-age=${cacheTime / 1000}`);
                    res.setHeader('ETag', etag);
                    res.end(data);
                }
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end(`<!DOCTYPE html>
  <html lang='en'>
  <head>
    <title>404 Not Found</title>
  </head>
  <body>
    <h1>404 Not Found</h1>
    <p>The requested URL was not found on this server.</p>
  </body>
  </html>`);
            }
            else {
                // Other error occurred
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal server error');
            }
        }
    };
}
//# sourceMappingURL=staticServe.js.map