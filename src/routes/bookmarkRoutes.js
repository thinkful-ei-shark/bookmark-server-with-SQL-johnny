const express = require('express');
const logger = require('../logger');
const bodyParser = express.json();
const { uuid } = require('uuidv4');
const validUrl = require('valid-url');

const bookmarkRouter = express.Router();

const { bookmarks } = require('../store');

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res)=>{
    const { title, url, description, rating } = req.body;
    if(!title || !url || !description || !rating){
      logger.error('Must have valid title, url, description, and rating');
      return res.status(400).send('All fields required');
    }
    const bookmark = { id: uuid(), title, url, description, rating};
  
    if(!validUrl.isUri(url)){
      logger.error('Invalid URL format');
      return res.status(400).send(`${url} is not a valid URL format`);
    }
    if(typeof rating !== 'number'){
      logger.error('Rating is not a number');
      return res.status(400).send(`${rating} is not a number`);
    }
    
    bookmarks.push(bookmark);
    res.status(201).json(bookmark);
  });
  

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const foundBookmark = bookmarks.find(bookmark => bookmark.id === req.params.id);
    if(!foundBookmark) {
      logger.error('Not Found');
      res
        .status(404);
    }
    res.json(foundBookmark);
  })
  .delete((req, res) => {
    const bookmarkID  = req.params.id;

    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === bookmarkID);
  
    if(bookmarkIndex === -1 ){
      logger.error(`Bookmark ${bookmarkID} was not found, try again`);
      return res.status(404).send('Bookmark not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    res.status(204).end();

  });

module.exports = bookmarkRouter;