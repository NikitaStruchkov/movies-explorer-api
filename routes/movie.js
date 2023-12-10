const movieRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movie');

// возвращает все сохранённые текущим пользователем фильмы
movieRouter.get('/movies', auth, getMovies);

// создаёт фильм
movieRouter.post('/movies', auth, createMovie);

// удаляет сохранённый фильм по id
movieRouter.delete('/movies/_id', auth, deleteMovieById);

module.exports = movieRouter;
