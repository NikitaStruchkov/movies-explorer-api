const bcrypt = require('bcryptjs'); // импортируем bcrypt
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // default: 'имя пользователя',
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы.
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        throw new UnauthorizedError('Неверные почта или пароль.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные почта или пароль.');
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema); // модель пользвателя
