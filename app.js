const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cards = require('./routes/cards');
const users = require('./routes/users');
const login = require('./routes/login');
const register = require('./routes/register');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(errors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('/signin', login);
app.use('/signup', register);
app.use((req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
