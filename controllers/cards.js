const Cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const NoRightsError = require('../errors/NoRightsError');
const BadRequestError = require('../errors/BadRequestError');

const SUCCESS = 200;

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карты.'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => {
      res.send({ cards });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new NoRightsError('Невозможно удалить карту с другим _id пользователя.');
      }
      card.deleteOne()
        .then(() => {
          res.status(SUCCESS).send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
