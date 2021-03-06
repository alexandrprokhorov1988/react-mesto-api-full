const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUserById, getUsers, editUserInfo, editUserAvatar,
} = require('../controllers/users');
const { validateUrl } = require('../utils/validate');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .trim(true)
      .required()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .trim(true)
      .required()
      .min(2)
      .max(30),
  }),
}), editUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().trim(true).custom(validateUrl, 'custom validation'),
  }),
}), editUserAvatar);

module.exports = router;
