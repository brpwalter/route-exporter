const http = require('http');
const { URL } = require('url');

const port = 3138;

const server = http.createServer((request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');

    if (url.pathname === '/health') {
        response.writeHead(200);
        response.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    const coordinatesMatch = url.pathname.match(/^\/route\/v1\/driving\/(.+)$/);
    if (!coordinatesMatch) {
        response.writeHead(404);
        response.end(JSON.stringify({ code: 'NotFound' }));
        return;
    }

    const coordinates = coordinatesMatch[1].split(';').map(pair => pair.split(',').map(Number));
    if (coordinates.length < 2 || coordinates.some(pair => pair.length !== 2 || pair.some(Number.isNaN))) {
        response.writeHead(400);
        response.end(JSON.stringify({ code: 'InvalidQuery' }));
        return;
    }

    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    const midpoint = [(first[0] + last[0]) / 2, (first[1] + last[1]) / 2];
    const longerMidpoint = [midpoint[0] + 0.01, midpoint[1] + 0.01];

    response.writeHead(200);
    response.end(JSON.stringify({
        code: 'Ok',
        routes: [
            { distance: 2500, geometry: { coordinates: [first, longerMidpoint, last] } },
            { distance: 1500, geometry: { coordinates: [first, midpoint, last] } }
        ]
    }));
});

server.listen(port, '127.0.0.1');
