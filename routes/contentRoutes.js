require("dotenv").config();

const cookieParser = require("cookie-parser");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");
const { v4: uuid } = require("uuid");
const { verify } = require("jsonwebtoken");
const { hash, compare, genSalt } = require("bcryptjs");
const { createToken, sendToken } = require("../tools/token");
const { checkToken, verifyTokenData } = require("../tools/checkToken");
const { confirmationMailBody, transport } = require("../tools/nodemailer");
const { getRates } = require("../tools/ratefunctions");

const sendMessage = async (req, res) => {
  const reqToken = req.cookies.usertoken;

  const { hashtags, message, creatorName, creatorMail, userIp } = req.body;

  if (!reqToken) {
    res.send({
      message: `Something went terribly wrong. Please refresh the page and try again. Do not forget to copy your message to somewhere safe. If problem continues clear cookies, refresh the page and pray for it to work. `,
    });
  }

  const solvedToken = await checkToken(reqToken);

  const user = await User.findOne({ userId: solvedToken.id });

  const isValid =
    user.userIp === solvedToken.ip && user.userIp === userIp ? true : false;

  if (user.isBlocked) {
    res.send({
      message:
        "You are blocked! This might be because you messed up with your token. No need to worry. Since this is an open platform, all you need to do is clear your cookies and suddenly you will have a new account.",
    });
  }

  if (isValid) {
    try {
      const newPost = new Post({
        hashtags,
        message,
        creatorName,
        creatorId: user.userId,
        creatorIp: userIp,
        creatorMail,
      });
      const createPost = await newPost.save();

      user.messagesCreated = user.messagesCreated + 1;

      const updateUser = await user.save();

      res.send({ message: "Post created successfuly." });
    } catch (error) {
      res.send({
        error: `Error catched: ${error.message}`,
      });
    }
  } else {
    res.send({ message: "There is a problem with your ip/token. " });
  }
};

const getRandom = async (_req, res) => {
  const posts = await Post.find({}).limit(10).sort({ date: -1 });
  // if (posts.length < 0) {
  //   res.send({ message: "No rates yet." });
  // }
  // posts.map((post) => {
  //   console.log("post.rate: ", post.rate, "post._id: ", post._id);
  //   post.rate = getRates(post._id, "message");
  //   console.log("post.rate after change: ", post.rate);
  //   post.save();
  // });
  // posts.map((post) => {
  //   post.creatorrate = getRates(post.creatorId, "user");
  //   post.save();
  // });

  console.log("posts: ", posts);
  res.send(posts);
};

module.exports = {
  sendMessage,
  getRandom,
};
