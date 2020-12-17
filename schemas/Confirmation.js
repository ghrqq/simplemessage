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

  confirmationCode: {
    type: String,
  },
  mailConfirmationExpiry: {
    type: Date,
    default: Date.now,
    index: {
      expires: "30s",
    },
  },
});

module.exports = User = mongoose.model("confirmation", ConfirmationSchema);
