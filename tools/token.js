const { sign } = require("jsonwebtoken");

const createToken = (id) => {
  return sign(
    {
      id,
    },
    process.env.tokenSecret,
    {
      expiresIn: "730d",
    }
  );
};

const createConfirmToken = (id, mail) => {
  return sign(
    {
      id,
      mail,
    },
    process.env.confirmTokenSecret,
    {
      expiresIn: "1d",
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
  createConfirmToken,
};
