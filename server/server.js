/**
 * Minimal static file server for development.
 * Serves files from project root directory.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
const port = process.env.PORT || 3000;

const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    try {
        let reqPath = decodeURIComponent(req.url.split('?')[0]);
        if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

        // Resolve request path relative to root, preventing absolute-path escapes.
        const normalizedReqPath = reqPath.replace(/^\/+/, '');
        const filePath = path.resolve(root, normalizedReqPath);

        // Prevent path traversal
        if (!(filePath === root || filePath.startsWith(rootWithSep))) {
            res.writeHead(403);
            return res.end('Forbidden');
        }

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('Not Found');
            }

            const ext = path.extname(filePath).toLowerCase();
            const ct = contentTypes[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': ct });
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
    }
});

server.listen(port, () => {
     (`Static server running at http://localhost:${port}/`);
});
