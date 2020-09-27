const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Ошибка авторизации');
      }
      // const token = jwt.sign({ _id: user._id }, '205faa8cfb90af4d807e0c110eb0a102394529c76056e7840ae7116e03b44e57');
      // res
      //   .cookie('jwt', token, { //  todo credentials: 'include',
      //     maxAge: 3600000 * 24 * 7,
      //     httpOnly: true,
      //   })
      //   .end();
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch(next);
};
