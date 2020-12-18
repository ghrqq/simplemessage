require("dotenv").config();

const cookieParser = require("cookie-parser");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");
const Rate = require("../schemas/Rate");
const { checkToken, verifyTokenData } = require("../tools/checkToken");

const rateMessage = async (req, res) => {
  try {
    const { messageId, rate, creatorId, userIp } = req.body;
    const user = await verifyTokenData(req);

    if (typeof user === "string") {
      res.send({
        message: `Cannot rate because your ip is not registered. Please refresh the page and try rating again. Original error: ${user}`,
      });
    }

    const check = await Rate.find({ postid: messageId, raterIp: userIp });

    if (check.length === 0) {
      const newRate = new Rate({
        postid: messageId,
        rate,
        postCreatorId: creatorId,
        raterIp: userIp,
      });

      newRate.save();

      const postToChange = await Post.findOne({ _id: messageId });

      const allRates = await Rate.find({ postid: messageId });

      const avgRate =
        allRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allRates.length;

      postToChange.rate = avgRate;

      const savePostRate = await postToChange.save();

      const userToChange = await User.findOne({ userId: creatorId });

      const allUserRates = await Rate.find({ postCreatorId: creatorId });

      const avgUserRate =
        allUserRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allUserRates.length;

      userToChange.rate = avgUserRate;

      const saveUserRate = await userToChange.save();

      res.send({
        message: `Your vote is saved. user: ${userToChange} post: ${postToChange}`,
      });
    }

    res.send({ message: "You can only once vote a post." });
  } catch (error) {
    error.message;
  }
};

module.exports = {
  rateMessage,
};
