const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: "en",
  },
  userName: {
    type: String,
    maxlength: 25,
  },
  rate: {
    type: Number,
    default: 0,
  },
  userMail: {
    type: String,
    unique: true,
  },
  isMailsAllowed: {
    type: Boolean,
    default: false,
  },
  isAgreed: {
    type: Boolean,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    required: true,
  },

  twitterShare: {
    type: Number,
    default: 0,
  },
  facebookShare: {
    type: Number,
    default: 0,
  },
  messagesCreated: {
    type: Number,
    default: 0,
  },
  isMailConfirmed: {
    type: Boolean,
    default: false,
  },
  favoriteHashtags: {
    type: Array,
    maxlength: 3,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
