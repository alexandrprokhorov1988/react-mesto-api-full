const mongoose = require('mongoose');

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
      validator: (v) => /^https?:\/\/(www.)?[a-z0-9\-\\/]+\.[a-z]{2,3}[a-z\\/]*#?$/gi.test(v),
      message: (props) => `${props.value} некорректный url`,
    },
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
