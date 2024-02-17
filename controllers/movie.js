const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    isLiked,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id, // При успешной авторизации в объекте
    // запроса появится свойство user, в которое запишется пейлоуд токена
    isLiked,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(err.message);
      } return next(err);
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovieById = (req, res, next) => {
  const id = String(req.params._id || req.params.id); // Приводим к строковому формату
  Movie.findById(id)
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
