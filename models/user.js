const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const BadRequestError = require('../errors/bad-reques-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'необходимо заполнить поле name'],
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'необходимо заполнить поле about'],
    default: 'Исследователь океана',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'необходимо заполнить поле avatar'],
    default: 'https://kaskad.tv/images/2020/foto_zhak_iv_kusto__-_interesnie_fakti_20190810_2078596433.jpg',
    validate: {
      validator: (str) => validator.isURL(str),
      message: (props) => `${props.value} некорректный url`,
    },
  },
  email: {
    type: String,
    require: [true, 'необходимо заполнить поле email'],
    unique: true,
    validate: {
      validator: (str) => validator.isEmail(str),
      message: (props) => `${props.value} некорректный email`,
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequestError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequestError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

userSchema.statics.registerUser = function (name, about, avatar, email, password) {
  return bcrypt.hash(password, 10)
    .then((hash) => this.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => user)
      .catch(() => Promise.reject(new BadRequestError('Email занят'))));
};

module.exports = mongoose.model('user', userSchema);
