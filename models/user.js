const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');


const userSchema = new mongoose.Schema({

  user_id: {
    type: String,
    default: () => uuidv4(),  // Generate a unique ID by default
    unique: true
  },

    username: {
        type: String,
        required: true,
        unique: true
      },
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;