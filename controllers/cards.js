const Card = require('../models/card');

const ERROR_CODE = 400;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).json({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).json({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .orFail(() => new Error(404))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === '404') {
        res.status(404).json({ message: 'Нет карточки с таким id' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error(404))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === '404') {
        res.status(404).json({ message: 'Нет карточки с таким id' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error(404))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === '404') {
        res.status(404).json({ message: 'Нет карточки с таким id' });
        return;
      }
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};
