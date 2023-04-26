const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gamesPLayed: {
    type: Number,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  friends: [
    {
      uuid: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true
      },
      gamesPLayed: {
        type: Number,
        required: false,
      },
    }
  ]
}, {
  timestamps: true
});

module.exports = model('User', UserSchema);
