require("dotenv").config();

const cookieParser = require("cookie-parser");
const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");
const Rate = require("../schemas/Rate");
const { v4: uuid } = require("uuid");
const { verify } = require("jsonwebtoken");
const { hash, compare, genSalt } = require("bcryptjs");
const {
  createToken,
  sendToken,
  createConfirmToken,
} = require("../tools/token");
const {
  checkToken,
  verifyTokenData,
  checkConfirmToken,
} = require("../tools/checkToken");
const { confirmationMailBody, transport } = require("../tools/nodemailer");

// User creation with jwt

const getUserId = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userName, userMail, isAgreed, isMailsAllowed } = req.body;

  try {
    if (!reqToken) {
      if (!isAgreed) {
        res.status(400).send({
          message:
            "I do not know how you have submitted this form but you should have agreed user terms. Please read carefully and if you agree the terms, check the tiny box that says 'I agree' and send the form again.",
        });
      }
      const userId = uuid();

      const token = await createToken(userId);
      const newUser = new User({
        userId,
        userMail,
        isAgreed,
        userName,
        token,
        isMailsAllowed,
      });

      const createUser = await newUser.save();

      sendToken(res, token);
      res.status(200).send({
        message: "You are registered. It couldn't be easier to register, huh?",
        id: newUser.userId,
      });
    } else {
      const solvedToken = await checkToken(reqToken);

      const user = await User.findOne({ userId: solvedToken.id });
      const newToken = createToken(user.userId);
      user.token = newToken;
      user.save();

      res.send({
        message: "Welcome back!",
        id: user.userId,
      });
    }
  } catch (error) {
    res.status(400).send({
      error: `Error catched: ${error.message}`,
    });
  }
};

// Clear Cookies - That makes users account inaccessible.
const clearUser = (_req, res) => {
  res.clearCookie("usertoken");
  return res.status(200).send({
    message: "You are like a new born.",
  });
};

// To get a mail including confirmation code.
const confirmMail = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userMail } = req.body;

  const solvedToken = await checkToken(reqToken);

  if (!solvedToken) {
    res.status(400).send({ message: "No token was found." });
  }

  const user = await User.findOne({ userId: solvedToken.id });

  if (!user) {
    res.status(400).send({
      message: "Please register first.",
    });
  }

  const code = createConfirmToken(user.userId, userMail);

  const newConfirmation = new Confirmation({
    userId: user.userId,
    userMail,
    confirmationToken: code,
  });

  newConfirmation.save();
  user.userMail = userMail;
  user.save();

  const mail = {
    from: "no-reply-confirm-mail@simplemsg.com", // Sender address
    to: "to@email.com", // List of recipients
    subject: "Mail confirmation", // Subject line
    text: `Click the link below to comfirm your mail: http://localhost:4000/confirmation/${code}`, // Plain text body
  };
  transport.sendMail(mail, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  res.send(user);
};

// To send back the mail confirmation code

const confirmation = async (req, res) => {
  const code = req.params.code;
  console.log("code: ", code);

  try {
    const userConfirmation = await Confirmation.findOne({
      confirmationToken: code,
    });
    console.log("userConfirmation: ", userConfirmation);
    if (!userConfirmation) {
      res.status(400).send({
        message:
          "Your confirmation code is expired or false. Please get a new one.",
      });
    }

    const { id, mail } = checkConfirmToken(code);
    console.log("id from checkConfirmToken: ", id, "mail: ", mail);
    if (!id || !mail) {
      res.status(400).send({
        message: "Some data is missing in your token. Please get a new one. ",
      });
    }

    const userToConfirm = await User.findOne({ userId: id });

    console.log("usertoconfirm: ", userToConfirm);
    if (!userToConfirm) {
      res
        .status(400)
        .send({ message: "Looks like there is no user with given ID." });
    }
    if (userToConfirm.userMail === mail) {
      (userToConfirm.isMailConfirmed = true), userToConfirm.save();
      res.status(200).send({
        message: "Your mail is confirmed. ",
      });
    } else {
      res.status(400).send({ message: "Fucked up" });
    }
  } catch (error) {
    res.send({
      error: `Error catched: ${error.message}`,
    });
  }
};

const addUserDetails = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userName, isMailsAllowed, favoriteHashtags, userId } = req.body;

  try {
    const { id } = checkToken(reqToken);

    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(400).send({ message: "User not found." });
    }

    user.userName = userName ? userName : user.userName;
    user.isMailsAllowed = isMailsAllowed ? true : user.isMailsAllowed;
    user.favoriteHashtags = favoriteHashtags
      ? favoriteHashtags
      : user.favoriteHashtags;

    const isSaved = await user.save();

    // Dev Only
    const checkUser = await User.findOne({ userId: id });

    res.status(200).send({
      message:
        "Your profile is updated successfuly. We promise that we won't sell any of your data. ",
      user: checkUser,
    });
  } catch (error) {
    res.status(400).send({ message: `An error occured. ${error.message}` });
  }
};

const getBackYourAccount = async (req, res) => {
  const { mail } = req.body;
  const user = await User.findOne({ userMail: mail });

  if (!user) {
    res.status(400).send({ message: "Your mail is not registered." });
  }
  if (!user.isMailConfirmed) {
    res.status(400).send({
      message:
        "You did not confirmed your mail. So you cannot reach your account. Sorry. You may try the first device you have used this page or just forget about your old account and start over.",
    });
  }

  const code = uuid().slice(0, 6);

  const newConfirmation = new Confirmation({
    userId: user.userId,
    userMail: user.userMail,
    confirmationCode: code,
  });

  newConfirmation.save();
  transport.sendMail(confirmationMailBody(code), function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  res.status(400).send({
    message: `Dear ${user.userName}, we got your request to get back your account. Please check your inbox (and spam folder) and follow the steps in there. `,
  });
};

const confirmGetBack = async () => {
  const code = req.params.code;

  const userConfirmation = await Confirmation.findOne({
    confirmationToken: code,
  });
  if (!userConfirmation) {
    res.status(400).send({
      message: "Your confirmation code is expired. Please get a new one.",
    });
  }

  const user = await User.findOne({ userId: userConfirmation.userId });
  if (!user) {
    res.status(400).send({
      message: "Something went terribly wrong. We cannot identify you. ",
    });
  }

  const token = await createToken(user.userId);

  user.token = token;
  user.save();

  sendToken(res, token);

  res.send({ message: "New configurations are successfuly set." });
};

module.exports = {
  clearUser,
  getUserId,
  confirmMail,
  confirmation,
  addUserDetails,
  getBackYourAccount,
  confirmGetBack,
};
