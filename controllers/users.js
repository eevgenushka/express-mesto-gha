const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_CODE = 400;

const NOT_FOUND_ERROR_CODE = 404;

const COMMON_ERROR_CODE = 500;

const UNAUTHORIZED_CODE = 400;

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя. ' });
        return;
      }
      res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_CODE).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user)
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
      if (err instanceof mongoose.CastError) {
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
      } else if (err instanceof mongoose.CastError) {
        res.status(COMMON_ERROR_CODE).send({ message: 'Передан некорректный id.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const opts = { runValidators: true, new: true };

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    opts,
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
  login,
  getCurrentUser,
};
