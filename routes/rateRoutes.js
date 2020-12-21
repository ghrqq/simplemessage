require("dotenv").config();

const cookieParser = require("cookie-parser");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");
const Rate = require("../schemas/Rate");
const { checkToken, verifyTokenData } = require("../tools/checkToken");

const rateMessage = async (req, res) => {
  try {
    const { postid, rate, postCreatorId, userIp } = req.body;
    const user = await verifyTokenData(req);

    if (typeof user === "string") {
      res.send({
        message: `Cannot rate because your ip is not registered. Please refresh the page and try rating again. Original error: ${user}`,
      });
    }

    const check = await Rate.find({ postid: postid, userIp });

    if (check.length === 0) {
      const newRate = new Rate({
        postid,
        rate,
        postCreatorId,
        userIp,
      });

      newRate.save();

      const postToChange = await Post.findOne({ _id: postid });

      const allRates = await Rate.find({ postid: postid });

      const avgRate =
        allRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allRates.length;

      postToChange.rate = avgRate;

      const savePostRate = await postToChange.save();

      const userToChange = await User.findOne({ userId: postCreatorId });

      const allUserRates = await Rate.find({ postCreatorId: postCreatorId });

      const avgUserRate =
        allUserRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allUserRates.length;

      userToChange.rate = avgUserRate;

      const saveUserRate = await userToChange.save();
      console.log(
        "usertochange: ",
        userToChange,
        "postToChange: ",
        postToChange
      );

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
