const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'поле country обязательное'],
  },
  director: {
    type: String,
    required: [true, 'поле director обязательное'],
  },
  duration: {
    type: Number,
    required: [true, 'поле duration обязательное'],
  },
  year: {
    type: String,
    required: [true, 'поле year обязательное'],
  },
  description: {
    type: String,
    required: [true, 'поле description обязательное'],
  },
  image: {
    type: Object,
    required: [true, 'поле image обязательное'],
    // validate: {
    //   validator: (v) => isUrl(v),
    //   message: 'введите адрес ссылки',
    // },
  },
  trailerLink: {
    type: String,
    required: [true, 'поле trailerLink обязательное'],
    validate: {
      validator: (v) => isUrl(v),
      message: 'введите адрес ссылки',
    },
  },
  thumbnail: {
    type: Object,
    // required: [true, 'поле thumbnail обязательное'],
    // validate: {
    //   validator: (v) => isUrl(v),
    //   message: 'введите адрес ссылки',
    // },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: [true, 'поле movieId обязательное'],
  },
  nameRU: {
    type: String,
    required: [true, 'поле nameRU обязательное'],
  },
  nameEN: {
    type: String,
    required: [true, 'поле nameEN обязательное'],
  },
  isLiked: {
    type: Boolean,
    required: [false],
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
