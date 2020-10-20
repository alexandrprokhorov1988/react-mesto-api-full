require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const cards = require('./routes/cards');
const users = require('./routes/users');
const login = require('./routes/login');
const register = require('./routes/register');
const signOut = require('./routes/signOut');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

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
  useUnifiedTopology: true,
});

const allowedCors = [
  'https://apro.students.nomoreparties.xyz',
  'http://localhost:3000',
];
// const corsOptions = {
//   credentials: true,
//   origin(origin, callback) {
//     if (allowedCors.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
//
// app.use(cors(corsOptions));

app.use(function (req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/signin', login);
app.use('/signup', register);
app.use('/signout', signOut);
app.use(errors());
app.use(errorLogger);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res
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
