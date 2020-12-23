const { verify } = require("jsonwebtoken");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");

const checkToken = (req) => {
  try {
    if (!req) {
      return;
    }

    const { id } = verify(req, process.env.tokenSecret);

    return { id };
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const checkConfirmToken = (req) => {
  try {
    if (!req) {
      return;
    }

    const { id, mail } = verify(req, process.env.confirmTokenSecret);

    return { id, mail };
  } catch (error) {
    res.status(400).send({ message: "No token was found" });
  }
};

const verifyTokenData = async (req) => {
  const reqToken = req.cookies.usertoken;

  if (!reqToken) {
    return;
  }
  try {
    const { id } = await checkToken(reqToken);

    return { id };
  } catch (error) {
    return error.message;
  }
};

const verifyConfirmTokenData = async (req) => {
  const reqToken = req.params.code;

  if (!reqToken) {
    return "No Token";
  }
  try {
    const solvedToken = await checkConfirmToken(reqToken);

    const user = await User.findOne({ userId: solvedToken.id });

    return user;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  checkToken,
  verifyTokenData,
  checkConfirmToken,
  verifyConfirmTokenData,
};
