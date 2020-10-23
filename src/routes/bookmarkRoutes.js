const express = require('express');
const app = require('../app');
const logger = require('../logger');

const bookmarkRouter = express.Router();

const { bookmarks } = require('../store');

bookmarkRouter.get('/', (req, res) => {
  res.json(bookmarks);
});

bookmarkRouter.get('/:id', (req, res) => {
  const foundBookmark = bookmarks.find(bookmark => bookmark.id === req.params.id);
  if(!foundBookmark) {
    logger.error('Not Found');
    res
      .status(404);
  }
  res.json(foundBookmark);
});

module.exports = bookmarkRouter;