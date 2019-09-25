const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  createdPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  referralCode: {
    type: String,
    required: true,
  },
  referralCount: {
    type: Number,
    required: true,
    default: 0,
  }
});

module.exports = mongoose.model('User', userSchema);
