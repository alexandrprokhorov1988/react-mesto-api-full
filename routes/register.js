const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/register');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .alphanum()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .required()
      .alphanum()
      .min(2)
      .max(30),
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

module.exports = router;
