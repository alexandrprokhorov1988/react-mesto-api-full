const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUsers, editUserInfo, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),
}), getUser);

router.patch('/me', celebrate({
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
  }),
}), editUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), editUserAvatar);

module.exports = router;
