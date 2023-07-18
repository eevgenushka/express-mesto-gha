const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const NOT_FOUND_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', express.json());
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.use('*', auth, (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
