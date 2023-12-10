const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    validate: {
      validator: (image) => isUrl(image, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: 'Некорректный адрес URL',
    },
  },

  trailerLink: {
    type: String,
    validate: {
      validator: (trailerLink) => isUrl(trailerLink, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: 'Некорректный адрес URL',
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (thumbnail) => isUrl(thumbnail, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: 'Некорректный адрес URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema); // модель фильма

// country — страна создания фильма. Обязательное поле-строка.
// director — режиссёр фильма. Обязательное поле-строка.
// duration — длительность фильма. Обязательное поле-число.
// year — год выпуска фильма. Обязательное поле-строка.
// description — описание фильма. Обязательное поле-строка.
// image — ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
// trailerLink — ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
// thumbnail — миниатюрное изображение постера к фильму.
// Обязательное поле-строка. Запишите её URL-адресом.
// ПОСМОТРЕТЬ РАЗДЕЛ СО СХЕМАМИ И МОДЕЛЯМИ OBJECTid И ВСЕ ТАКОЕ
// owner — _id пользователя, который сохранил фильм. Обязательное поле.
// movieId — id фильма, который содержится в ответе сервиса MoviesExplorer.
// Обязательное поле в формате number.
// nameRU — название фильма на русском языке. Обязательное поле-строка.
// nameEN — название фильма на английском языке. Обязательное поле-строка.
