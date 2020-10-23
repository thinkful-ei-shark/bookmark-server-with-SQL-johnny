const express = require('express');
const app = require('../app');
const logger = require('../logger');
const bodyParser = express.json();
const { uuid } = require('uuidv4');
const validUrl = require('valid-url');

const bookmarkRouter = express.Router();

const { bookmarks } = require('../store');
const store = require('../store');

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


bookmarkRouter.post('/', bodyParser, (req, res)=>{
  const { title, url, description, rating } = req.body
  if(!title || !url || !description || !rating){
    logger.error('Must have valid title, url, description, and rating')
    return res.status(400).send('All fields required')
  }
  const bookmark = { id: uuid(), title, url, description, rating}

  if(!validUrl.isUri(url)){
    logger.error('Invalid URL format')
    return res.status(400).send(`${url} is not a valid URL format`)
  }
  if(typeof rating !== 'number'){
    logger.error('Rating is not a number')
    return res.status(400).send(`${rating} is not a number`)
  }
  
  store.bookmarks.push(bookmark)
  res.status(201).json(bookmark)
})

module.exports = bookmarkRouter;