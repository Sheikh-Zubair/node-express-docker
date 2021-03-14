const express = require('express');
const http = require('http');

const HOST_NAME = 'localhost';
const PORT = 3000;

const app = express();

app.use((req, res, next) => {
    console.log(req.headers);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <html>
            <body>
                <h1> This is an express Server</h1>
            </body>
        </html>
    `);
});

const server = http.createServer(app);

server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is listening on http://${HOST_NAME}:${PORT}`);
});