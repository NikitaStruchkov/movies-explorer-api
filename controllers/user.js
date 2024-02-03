const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken

const User = require('../models/user');

const JWT_KEY = '3b2c0b48afb683532c72b31d8538ccdac9398a91ea91b290e0a90599393c66aa';

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

// возвращает информацию о пользователе (email и имя)
module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      } if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      } return next(err);
    });
};

// обновляет информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {
      email,
      name,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже существует'));
      }
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } return next(err);
    });
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже существует'));
      } if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } return next(err);
    });
};

// проверяет переданные в теле почту и пароль и возвращает JWT
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? JWT_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: false,
        secure: true,
      })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

// Очистка токена
module.exports.logout = (req, res) => {
  res.clearCookie('token')
    .send({ message: 'Выход' });
};
