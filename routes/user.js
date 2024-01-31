const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const { getUserInfo, updateUser } = require('../controllers/user');
// Проверка авторизации

userRouter.use(auth);

// возвращает информацию о пользователе (email и имя)
userRouter.get('/users/me', getUserInfo);

// обновляет информацию о пользователе (email и имя)
userRouter.patch('/users/me', updateUser);

module.exports = userRouter;
