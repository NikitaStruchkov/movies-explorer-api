const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const { getUserInfo, updateUser } = require('../controllers/user');

// возвращает информацию о пользователе (email и имя)
userRouter.get('/users/me', auth, getUserInfo);

// обновляет информацию о пользователе (email и имя)
userRouter.patch('/users/me', auth, updateUser);

module.exports = userRouter;
