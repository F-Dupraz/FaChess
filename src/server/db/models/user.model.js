const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gamesPlayed: {
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
      gamesPlayed: {
        type: Number,
        required: false,
      },
    }
  ]
}, {
  timestamps: true
});

module.exports = model('User', UserSchema);
