const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'необходимо заполнить поле name'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'необходимо заполнить поле about'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'необходимо заполнить поле avatar'],
    validate: {
      validator: (str) => validator.isURL(str),
      message: (props) => `${props.value} некорректный url`,
    },
  },
  email: {
    type: String,
    require: true,
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
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
