const express = require('express');
const { initializer } = require('./app-initializer');
const { router } = require('./routes/index');

const app = express();

// initializes app
// adds required middleware before handling any requests
initializer(app);

app.use(router);

module.exports = { app };
