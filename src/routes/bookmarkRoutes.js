const express = require('express');
// const app = require('../app');

const bookmarkRouter = express.Router();

const { bookmarks } = require('../store');

bookmarkRouter.get('/', (req, res) => {
  res.json(bookmarks);
});

module.exports = bookmarkRouter;