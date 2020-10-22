const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/register');
const { validatePassword, validateUrl } = require('../utils/validate');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl, 'custom validation'),
    email: Joi.string().required().email().trim(true),
    password: Joi.string().required().trim(true).custom(validatePassword, 'custom validation'),
  }),
}), createUser);

module.exports = router;
