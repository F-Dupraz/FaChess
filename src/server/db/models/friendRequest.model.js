const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  status: {
    type: Boolean,
    default: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('FriendRequest', UserSchema);
