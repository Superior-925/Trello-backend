const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
//require('./auth/passport');
const path = require('path');
const passport = require('passport');

require('./models/user');
require('./models/refresh-token');

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

require('./auth/passport')(passport);
require('./database/index');

app.use(passport.initialize());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Success!'
  });
});

app.use('/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});

module.exports = app;
