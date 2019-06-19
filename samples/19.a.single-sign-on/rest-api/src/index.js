require('dotenv').config();

const { join } = require('path');
const httpProxy = require('http-proxy');
const restify = require('restify');

const server = restify.createServer();
const {
  PORT = 5000,
  PROXY_BOT_URL,
  STATIC_FILES
} = process.env;

server.use(restify.plugins.queryParser());

const proxy = httpProxy.createProxyServer();

// To simplify deployment for our demo, we aggregate web and bot server into a single endpoint.
PROXY_BOT_URL && server.post('/api/messages', (req, res) => {
  proxy.web(req, res, {
    target: PROXY_BOT_URL
  });
});

server.get('/api/aad/oauth/authorize', require('./routes/aad/oauth/authorize'));
server.get('/api/aad/oauth/callback', require('./routes/aad/oauth/callback'));
server.get('/api/aad/settings', require('./routes/aad/settings'));
server.get('/api/directline/token', require('./routes/directLine/token'));
server.get('/api/github/oauth/authorize', require('./routes/github/oauth/authorize'));
server.get('/api/github/oauth/callback', require('./routes/github/oauth/callback'));
server.get('/api/github/settings', require('./routes/github/settings'));

STATIC_FILES && server.get('/**/*', restify.plugins.serveStatic({
  default: 'index.html',
  directory: join(__dirname, '..', STATIC_FILES)
}));

server.listen(PORT, () => {
  console.log(`Rest API server is listening to port ${ PORT }`);

  PROXY_BOT_URL && console.log(`Will redirect /api/messages to ${ PROXY_BOT_URL }`);
  STATIC_FILES && console.log(`Will serve static content from ${ STATIC_FILES }`);
});
