const User = require('../models/user');
const BadRequestError = require('../errors/bad-reques-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return User.registerUser(name, about, avatar, email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Ошибка регистрации');
      }
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch(next);
};
