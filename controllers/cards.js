const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-reques-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => new NotFoundError('Записи отсутсвуют'))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.deleteOne({ _id: req.params.cardId, owner })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};
