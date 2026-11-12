const port = 3137;
const routingPort = 3138;

module.exports = {
    testDir: './tests',
    testMatch: '**/*.spec.js',
    fullyParallel: false,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        browserName: 'chromium'
    },
    webServer: [
        {
            command: 'node tests/mock-routing-server.js',
            url: `http://127.0.0.1:${routingPort}/health`,
            reuseExistingServer: false,
            timeout: 30000
        },
        {
            command: 'node server.js',
            url: `http://127.0.0.1:${port}/`,
            reuseExistingServer: false,
            timeout: 30000,
            env: {
                PORT: String(port),
                ROUTES_DB_PATH: ':memory:',
                ROUTING_BASE_URL: `http://127.0.0.1:${routingPort}/route/v1/driving`
            }
        }
    ]
};
