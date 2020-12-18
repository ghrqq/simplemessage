const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateSchema = new Schema({
  postid: {
    type: String,
  },
  rate: {
    type: Number,
    max: 5,
  },
  postCreatorId: {
    type: String,
  },
  raterIp: {
    type: String,
    required: true,
  },
});

module.exports = Rate = mongoose.model("rate", RateSchema);
