require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('./middlewares/cors');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/movie');
const { login, createUser, logout } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
// Слушаем 3001 порт
const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('movies');
});

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL);
app.use(helmet());
app.use(limiter);
app.use(cookieParser()); // для извлечения данных из cookies
app.use(express.json());
app.use(cors);
app.use(requestLogger); // подключаем логгер запросов
// роуты
app.post('/signin', login);
app.post('/signup', createUser);
// Запрос на выход
app.use('/signout', logout);
app.use(userRouter);
app.use(cardRouter);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
