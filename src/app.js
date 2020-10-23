require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const { NODE_ENV } = require('./config');

// routes
const bookmarkRouter = require('./routes/bookmarkRoutes');

// describe app to use express
const app = express();

// set morgan option based on node environment
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';


// set app options and basic security
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Bearer token validation

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

app.use('/bookmarks', bookmarkRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { mesage: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;