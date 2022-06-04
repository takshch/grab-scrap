const express = require('express');

const initializer = (app) => {
  app.use(express.json());
};

module.exports = { initializer };
