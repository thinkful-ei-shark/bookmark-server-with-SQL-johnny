const express = require('express');
const app = require('../app');

const bookmarkRouter = express.Router();

bookmarkRouter.get('/', (req, res) => {
  res.send('bookmark route hit');
})

module.exports = bookmarkRouter;