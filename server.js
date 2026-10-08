/**
 * Zero-dependency local development server for Pharmacy Management System
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 8088;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Sanitize path to prevent directory traversal
    let safeUrl = req.url.split('?')[0];
    let filePath = path.join(__dirname, safeUrl === '/' ? 'index.html' : safeUrl);
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - الصفحة غير موجودة</h1>', 'utf-8');
            return;
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`خطأ في الخادم: ${err.code}`);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

function startServer(portToTry) {
    server.listen(portToTry, () => {
        console.log(`=======================================================`);
        console.log(` نظام صيدلية الشفاء الذكي يعمل بنجاح!`);
        console.log(` الرابط المحلي: http://localhost:${portToTry}`);
        console.log(` اضغط Ctrl + C لإيقاف الخادم`);
        console.log(`=======================================================`);
    });
}

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`المنفذ ${PORT} قيد الاستخدام، جاري تجربة منفذ آخر...`);
        PORT += 1;
        startServer(PORT);
    } else {
        console.error(e);
    }
});

startServer(PORT);
