const http = require('http');
const config = require('config');
const { app } = require('./src/app');

const PORT = config.get('port');
if (!PORT) {
  throw new Error('PORT must exist in config');
}

const server = http.createServer(app);

server.listen(PORT);

server.on('error', onError);

server.on('listening', onListening);

function onListening() {
  console.log(`Server is running on ${PORT} and started listening...`);
}

function onError(err) {
  throw err;
}

