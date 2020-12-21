const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateSchema = new Schema({
  postid: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    max: 5,
    min: -5,
    required: true,
  },
  postCreatorId: {
    type: String,
    required: true,
  },
  userIp: {
    type: String,
    required: true,
  },
});

module.exports = Rate = mongoose.model("rate", RateSchema);
