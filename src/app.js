const express = require('express');
const promClient = require('prom-client')

const app = express();
const register = promClient.register;

promClient.collectDefaultMetrics({ register });

const httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequests.Total.inc({
            method: req.method,
            route: req.path,
            status_code: res.statusCode,
        });
    });
    next();
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/', (req, res) => res.send('DevOps Final Project'));
app.get('/health', (req, res) => res.json({ status: 'ok'}));

app.listen(3000, () => console.log('Server started'))