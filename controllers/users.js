const mongoose = require('mongoose');
const User = require('../models/user');

const ERROR_CODE = 400;

const NOT_FOUND_ERROR_CODE = 404;

const COMMON_ERROR_CODE = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя. ' });
        return;
      }
      res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан некорректный id.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const opts = { runValidators: true, new: true };

  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      } else if (err instanceof mongoose.CastError || err.name === 'CastError') {
        res.status(COMMON_ERROR_CODE).send({ message: 'Передан некорректный id.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
