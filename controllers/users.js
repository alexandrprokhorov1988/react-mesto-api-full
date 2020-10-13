const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => new NotFoundError('Записи отсутсвуют'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user })
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};
