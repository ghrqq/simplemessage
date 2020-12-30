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
const { union, toLower } = require("lodash");

const sendMessage = async (req, res) => {
  const reqToken = req.cookies.usertoken;

  const { hashtags, message } = req.body;

  const hast = hashtags.map((item) => toLower(item));

  if (!reqToken) {
    res.status(400).send({
      message: `Something went terribly wrong. Please refresh the page and try again. Do not forget to copy your message to somewhere safe. If problem continues clear cookies, refresh the page and pray for it to work. `,
      status: 400,
    });
  }

  try {
    const solvedToken = await checkToken(reqToken);

    const user = await User.findOne({ userId: solvedToken.id });

    const newPost = new Post({
      hashtags: hast,
      message,
      creatorId: user.userId,
      creatorName: user.userName,
    });
    const createPost = await newPost.save();

    user.messagesCreated = user.messagesCreated + 1;

    const isName = user.userName === undefined ? false : user.userName;

    const isMail = user.userMail === undefined ? false : true;

    const updateUser = await user.save();

    res.status(200).send({
      message: "Post created successfuly.",
      status: 200,
      userName: isName,
      userMail: isMail,
    });
  } catch (error) {
    res.status(400).send({
      error: `Error catched: ${error.message}`,
      status: 400,
    });
  }
};
// Get random posts
const getRandom = async (_req, res) => {
  const posts = await Post.find({}).limit(50).sort({ date: -1 });
  res.send(posts);
};

// Get posts by hashtag
const getByHashTag = async (req, res) => {
  const hashtag = req.params.hashtag;

  try {
    const posts = await Post.find({ hashtags: hashtag })
      .limit(10)
      .sort({ date: -1 });

    const hashTagsRaw = posts.map((item) => item.hashtags);
    const hashtags = union(...hashTagsRaw);
    if (posts === null) {
      res.status(400).send({
        message: "No posts found.",
        status: 400,
      });
    }
    res.status(200).send({
      posts,
      hashtags,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      status: 400,
    });
  }
};

const deletePost = async (req, res) => {
  const reqToken = req.cookies.usertoken;

  const { postId } = req.body;

  if (!reqToken) {
    res.status(400).send({
      message: `You do not have a valid token. So you need to login and then try again to delete this post. `,

      status: 400,
    });
  }

  try {
    const solvedToken = await checkToken(reqToken);

    const user = await User.findOne({ userId: solvedToken.id });

    if (!user) {
      res.status(400).send({
        message: "Your token is invalid. Please login again.",
        status: 400,
      });
    }

    const result = await Post.deleteOne({ _id: postId });

    if (result.ok) {
      user.messagesCreated = user.messagesCreated - 1;
      const isSavedUser = await user.save();
      res
        .status(200)
        .send({ message: "Post deleted successfuly. ", status: 200 });
    } else {
      res.status(400).send({ message: "Delete failed.", status: 400 });
    }
  } catch (error) {
    res.status(400).send({
      error: `Error catched: ${error.message}`,

      status: 400,
    });
  }
};

const getSearchParams = async (req, res) => {
  try {
    const tagsRaw = await Post.find({}).select("hashtags");
    const tagsTotal = tagsRaw.map((item) => item.hashtags);
    const tags = union(...tagsTotal);

    res.status(200).send({ tags, status: 200 });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ creatorId: id });
    const hashTagsRaw = posts.map((item) => item.hashtags);
    const hashtags = union(...hashTagsRaw);
    if (posts === null) {
      res.status(400).send({
        message: "User not found.",
        status: 400,
      });
    }
    res.status(200).send({
      posts,
      hashtags,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      status: 400,
    });
  }
};

module.exports = {
  sendMessage,
  getRandom,
  getByHashTag,
  deletePost,
  getSearchParams,
  getUserPosts,
};
