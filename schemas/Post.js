const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  hashtags: {
    type: Array,
    required: true,
    maxlength: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    maxlength: 500,
  },
  lang: {
    type: String,
    maxlength: 2,
    required: false,
    default: "en",
  },
  rate: {
    type: Number,
    default: 0,
  },
  rateCount: {
    type: Number,
    default: 0,
  },
  creatorName: {
    type: String,
  },
  creatorId: {
    type: String,
    required: true,
  },
  creatorrate: {
    type: Number,
    default: 0,
  },
  twitterShare: {
    type: Number,
    default: 0,
  },
  facebookShare: {
    type: Number,
    default: 0,
  },
  creatorMail: {
    type: String,
  },
});

module.exports = Post = mongoose.model("posts", PostSchema);
