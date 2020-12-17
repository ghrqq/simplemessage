const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userIp: {
    type: String,
    required: true,
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
  },
  isMailsAllowed: {
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
  mailConfirmationCode: {
    type: String,
    index: {
      expires: "15s",
    },
  },
});

module.exports = User = mongoose.model("user", UserSchema);
