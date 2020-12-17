const { sign } = require("jsonwebtoken");

const createToken = (id, ip) => {
  return sign(
    {
      id,
      ip,
    },
    process.env.tokenSecret,
    {
      expiresIn: "730d",
    }
  );
};

const sendToken = (res, token) => {
  res.cookie("usertoken", token, {
    httpOnly: true,
    // path: "/getuserid",
  });
  // .cookie("sendmessage", token, {
  //   httpOnly: true,
  //   path: "/sendmessage",
  // });
};

module.exports = {
  createToken,
  sendToken,
};
