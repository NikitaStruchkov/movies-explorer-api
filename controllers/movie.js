const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id, // При успешной авторизации в объекте
    // запроса появится свойство user, в которое запишется пейлоуд токена
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } return next(err);
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        return next(new UnauthorizedError('Невозможно удалить чужой фильм'));
      }
      return movie
        .deleteOne()
        .then(() => res.send({ message: 'Фильм удален.' }));
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      } if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные фильма'));
      } return next(err);
    });
};
