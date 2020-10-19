const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateUrl } = require('../utils/validate');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .trim(true)
      .required()
      .min(2)
      .max(30),
    link: Joi.string().required().custom(validateUrl, 'custom validation'),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), dislikeCard);

module.exports = router;
