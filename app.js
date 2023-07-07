const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ERROR_CODE = 400;

const NOT_FOUND_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64a6df5a80d278e555839ba5',
  };

  next();
});

app.use('/', bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: ERROR_CODE }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
