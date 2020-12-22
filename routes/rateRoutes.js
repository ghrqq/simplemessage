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

    console.log("user from rateRoute: ", user, "typeof", typeof user);

    if (typeof user === "string") {
      res.send({
        message: `Cannot rate because your ip is not registered. Please refresh the page and try rating again. Original error: ${user}`,
      });
    }

    const check = await Rate.find({ postid: postid, userIp });
    console.log("check from rateRoute", check, "check.length: ", check.length);

    if (check.length === 0) {
      const newRate = new Rate({
        postid,
        rate,
        postCreatorId,
        userIp,
      });

      newRate.save();

      const postToChange = await Post.findOne({ _id: postid });

      console.log("postToChange: ", postToChange);

      const allRates = await Rate.find({ postid: postid });

      console.log("allRates: ", allRates);

      const avgRate =
        allRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allRates.length;

      const changeThePost = await Post.updateOne(
        { _id: postid },
        {
          rate: avgRate,
        }
      );

      const userToChange = await User.findOne({ userId: postCreatorId });

      console.log("userToChange: ", userToChange);

      const allUserRates = await Rate.find({ postCreatorId: postCreatorId });

      console.log("allUserRates: ", allUserRates);

      const avgUserRate =
        allUserRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allUserRates.length;

      const changeTheUser = await User.updateOne(
        { userId: postCreatorId },
        {
          rate: avgUserRate,
        }
      );
      console.log("avgUserRate: ", changeTheUser);
      // userToChange.rate = avgUserRate;

      // userToChange.save();
      // console.log(
      //   "usertochange: ",
      //   userToChange,
      //   "postToChange: ",
      //   postToChange
      // );

      res.status(200).send({
        message: `Your vote is saved.`,
      });
    }

    res.status(400).send({ message: "You can only once vote a post." });
  } catch (error) {
    error.message;
  }
};

module.exports = {
  rateMessage,
};
