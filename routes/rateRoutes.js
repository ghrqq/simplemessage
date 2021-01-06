// require("dotenv").config();

const Post = require("../schemas/Post");
const User = require("../schemas/User");

const Rate = require("../schemas/Rate");

const rateMessage = async (req, res) => {
  const { postid, rate, postCreatorId, userIp } = req.body;

  try {
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

      const changeThePost = await Post.updateOne(
        { _id: postid },
        {
          rate: avgRate,
          rateCount: postToChange.rateCount + 1,
        }
      );

      const userToChange = await User.findOne({ userId: postCreatorId });

      const allUserRates = await Rate.find({ postCreatorId: postCreatorId });

      const avgUserRate =
        allUserRates.map((item) => item.rate).reduce((a, b) => a + b, 0) /
        allUserRates.length;

      const changeTheUser = await User.updateOne(
        { userId: postCreatorId },
        {
          rate: avgUserRate,
        }
      );

      res.status(200).send({
        message: `Your vote is saved.`,
        status: 200,
      });
    }

    res
      .status(400)
      .send({ message: "You can only once vote a post.", status: 400 });
  } catch (error) {
    error.message;
  }
};

module.exports = {
  rateMessage,
};
