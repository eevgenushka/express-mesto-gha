const Cards = require('../models/card');

const ERROR_CODE = 400;

const NOT_FOUND_ERROR_CODE = 404;

const COMMON_ERROR_CODE = 500;

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;

  Cards.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя. ' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(COMMON_ERROR_CODE).send({ message: 'Ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};