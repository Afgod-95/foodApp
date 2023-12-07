const mongoose = require('mongoose');

const googleAuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
});

const GoogleAuthUser = mongoose.model('GoogleAuthUser', googleAuthSchema);

module.exports = GoogleAuthUser;
