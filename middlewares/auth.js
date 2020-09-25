const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization && !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '205faa8cfb90af4d807e0c110eb0a102394529c76056e7840ae7116e03b44e57');
  } catch (e) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
