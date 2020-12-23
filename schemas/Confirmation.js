const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfirmationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userMail: {
    type: String,
  },

  confirmationToken: {
    type: String,
  },
  mailConfirmationExpiry: {
    type: Date,
    default: Date.now,
    index: {
      expires: 86400,
    },
  },
});

module.exports = Confirmation = mongoose.model(
  "confirmation",
  ConfirmationSchema
);
