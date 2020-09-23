const User = require('../models/user');

const ERROR_CODE = 400;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).json({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .orFail(() => new Error(404))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === '404') {
        res.status(404).json({ message: 'Нет пользователя с таким id' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).json({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.editUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error(404))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).json({ message: 'Введены некорректные данные' });
      } else if (err.message === '404') {
        res.status(404).json({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(500).json({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error(404))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).json({ message: 'Введены некорректные данные' });
      } else if (err.message === '404') {
        res.status(404).json({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(500).json({ message: 'На сервере произошла ошибка' });
      }
    });
};
