const User = require('../models/user');
const BadRequestError = require('../errors/bad-reques-err');

module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь океана',
    avatar = 'https://kaskad.tv/images/2020/foto_zhak_iv_kusto__-_interesnie_fakti_20190810_2078596433.jpg',
    email,
    password,
  } = req.body;

  return User.registerUser(name, about, avatar, email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Ошибка регистрации');
      }
      res.send(user);
    })
    .catch(next);
};
