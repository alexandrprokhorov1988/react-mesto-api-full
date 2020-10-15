const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const { authorization } = req.cookies; // todo

  const { NODE_ENV, JWT_SECRET } = process.env;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   throw new UnauthorizedError('Необходима авторизация');
  // }
  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  // const token = authorization.replace('Bearer ', '');
  const token = authorization; // todo
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
