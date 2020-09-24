const bcrypt = require('bcrypt');
const User = require('../models/user');

const ERROR_CODE = 400;

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).json({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};
