const { verify } = require("jsonwebtoken");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");

const checkToken = (req) => {
  if (!req) throw new Error("No token was found");

  const { ip, id } = verify(req, process.env.tokenSecret);

  return { ip, id };
};

const verifyTokenData = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { hashtags, message, creatorName, creatorMail, userIp } = req.body;

  if (!reqToken) {
    return "No Token";
  }
  try {
    const solvedToken = await checkToken(reqToken);

    const user = await User.findOne({ userId: solvedToken.id });

    const isValid =
      user.userIp === solvedToken.ip && user.userIp === userIp ? true : false;

    if (!isValid) {
      return "Ip's don't match.";
    }

    return user;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  checkToken,
  verifyTokenData,
};
