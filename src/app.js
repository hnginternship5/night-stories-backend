/* eslint-disable no-unused-vars */
require('dotenv').config({ path: '.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();
const chalk = require('./config/chalk');
const config = require('./config');

const morgan = require('morgan');
const logger = require('./config/logger');

require('./models');
const { sendJSONResponse } = require('./helpers');

if (config.env !== 'test') {
  app.use(morgan('dev'));
}
// if(config.env === 'production') {
//   store = createStore(rootReducer, initialState, compose(
//       applyMiddleware(...middleware)
//   ));
// } else {
//   store = createStore(rootReducer, initialState, compose(
//       applyMiddleware(...middleware),
//       window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   ));
// }
app.use(bodyParser.json({ limit: '52428800' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json, Authorization');
  next();
});
const apiRoutes = require('./router');

app.use('/api/v1', apiRoutes);
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/api/getuser', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

app.use((err, req, res, next) => {
  if (config.env !== 'test') {
    logger.error('THIS IS ERR', err);
  }
  if (err.isBoom) {
    const { message } = err.data[0];
    sendJSONResponse(res, err.output.statusCode, null, req.method, message);
  } else if (err.status === 404) {
    sendJSONResponse(res, err.status, null, req.method, 'Not Found');
  } else {
    sendJSONResponse(res, 500, null, req.method, 'Something Went Wrong!');
  }
});

app.listen(config.port, () => logger.info(chalk.blue('APP RUNNING ON '), config.port));

module.exports = app;
