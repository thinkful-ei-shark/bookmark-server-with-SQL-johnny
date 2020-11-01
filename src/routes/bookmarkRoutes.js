const express = require('express');
const logger = require('../logger');
const bodyParser = express.json();
const { uuid } = require('uuidv4');
const validUrl = require('valid-url');
const xss = require('xss');
const bookmarkService = require('../../services/bookmarkServices');

const bookmarkRouter = express.Router();

const { bookmarks } = require('../store');
const { xssFilter } = require('helmet');

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating)
});

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    bookmarkService.getBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next)=>{
    const { title, url, description, rating } = req.body;
    if(!title || !url || !description || !rating){
      logger.error('Must have valid title, url, description, and rating');
      return res.status(400).send('All fields required');
    }
    if(rating > 5 || rating < 1) {
      logger.error('Rating must be between 1 - 5');
      return res.status(400).send('Rating must be betwen 1 - 5');
    }
    const bookmark = { title, url, description, rating};
  
    if(!validUrl.isUri(url)){
      logger.error('Invalid URL format');
      return res.status(400).send(`${url} is not a valid URL format`);
    }
    if(typeof rating !== 'number'){
      logger.error('Rating is not a number');
      return res.status(400).send(`${rating} is not a number`);
    }
    bookmarkService.insertBookmark(
      req.app.get('db'),
      bookmark
    )
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created.`);
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
  });
  

bookmarkRouter
  .route('/:id')
  .all((req, res, next) => {
    const bookmarkID = req.params.id;
    bookmarkService.getBookmarkById(req.app.get('db'), bookmarkID)
      .then(bookmark => {
        if(!bookmark) {
          logger.error(`Bookmark doesn't exist with ${bookmarkID}`);
          return res.status(404).json({
            error: { message : 'Bookmark not found'}
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const bookmarkID  = req.params.id;

    bookmarkService.deleteBookmark(req.app.get('db'), bookmarkID)
      .then(rows => {
        logger.info(`Bookmark containing id ${bookmarkID} has been deleted`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarkRouter;