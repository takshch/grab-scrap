const express = require('express');
const controller = require('../controllers/search');
const validator = require('../validators/search');

const searchRouter = express.Router();

searchRouter.post('/', validator.search, controller.search);
searchRouter.get('/suggestion', validator.suggestion, controller.suggestion);

module.exports = { searchRouter };

