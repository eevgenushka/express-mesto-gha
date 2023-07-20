const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/ValidationError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ValidationError('Необходима авторизация!');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new ValidationError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
