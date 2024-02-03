// Авторизация в приложении работает как мидлвэр.
// Если предоставлен верный токен, запрос проходит на дальнейшую обработку.
// Иначе запрос переходит контроллеру, который возвращает клиенту сообщение об ошибке.

const JWT_KEY = '3b2c0b48afb683532c72b31d8538ccdac9398a91ea91b290e0a90599393c66aa';
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { token } = req.cookies.token;
  let payload;

  try {
    if (!token) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_KEY : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload; // записать пейлоуд в объект запроса

  return next(); // пропустить запрос дальше
};
