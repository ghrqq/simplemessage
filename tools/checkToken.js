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
    return `Something went terribly wrong. Please refresh the page and try again. Do not forget to copy your message to somewhere safe. If problem continues clear cookies, refresh the page and pray for it to work. `;
  }
  try {
    const solvedToken = await checkToken(reqToken);

    console.log("it comes from verifyTokenData: ", solvedToken);

    const user = await User.findOne({ userId: solvedToken.id });
    console.log("user from token data: ", user);

    const isValid =
      user.userIp === solvedToken.ip && user.userIp === userIp ? true : false;

    if (!isValid) {
      return `Something went terribly wrong. We are unable to verify. Please refresh the page ant try again.`;
    }

    return user;
  } catch (error) {
    return "from CheckToken Data: ", error.message;
  }
};

module.exports = {
  checkToken,
  verifyTokenData,
};
