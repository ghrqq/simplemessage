require("dotenv").config();

const cookieParser = require("cookie-parser");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");
const Rate = require("../schemas/Rate");

const getRates = async (id, type) => {
  if (type === "user") {
    const allUserRates = await Rate.find({ postCreatorId: id });
    const avgUserRate =
      (await allUserRates.reduce((a, b) => a.rate + b.rate)) /
      allUserRates.length;
    return avgUserRate;
  }
  if (type === "message") {
    const allRates = await Rate.find({ postid: id });
    console.log("all Rates: ", allRates);
    const avgRate =
      (await allRates.reduce((a, b) => a.rate + b.rate)) / allRates.length;
    return avgRate;
  } else {
    return;
  }
};

module.exports = {
  getRates,
};
