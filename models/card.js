const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'необходимо заполнить поле name'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'необходимо заполнить поле avatar'],
    validate: {
      validator: (str) => validator.isURL(str),
      message: (props) => `${props.value} некорректный url`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'необходимо заполнить поле owner'],
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('card', cardSchema);
