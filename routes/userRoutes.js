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

// User creation with jwt

const getUserId = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userName, userMail, isMailsAllowed, userIp } = req.body;

  try {
    if (!reqToken) {
      const userId = uuid();

      const token = await createToken(userId, userIp);
      const newUser = new User({
        userId,
        userIp,
        userMail,
        isMailsAllowed,
        userName,
        token,
      });

      const createUser = await newUser.save();

      sendToken(res, token);
      res.send({
        message: "New id created. ",
      });
    } else {
      const solvedToken = await checkToken(reqToken);

      const user = await User.findOne({ userId: solvedToken.id });

      const isValid =
        user.userIp === solvedToken.ip && user.userIp === userIp ? true : false;

      if (!isValid) {
        user.isBlocked = true;
        const blockUser = await user.save();
        res.send({
          message: "You look like an impostor and your account is blocked.",
        });
      }
      transport.sendMail(
        confirmationMailBody("Fuck you and all of your ancestors in order."),
        function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
          }
        }
      );
      res.send({
        id: user.id,
      });
    }
  } catch (error) {
    res.send({
      error: `Error catched: ${error.message}`,
    });
  }
};

// Clear Cookies - That makes users account inaccessible.
const clearUser = (_req, res) => {
  res.clearCookie("usertoken");
  return res.send({
    message: "You are like a new born.",
  });
};

// To get a mail including confirmation code.
const confirmMail = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userMail } = req.body;

  const solvedToken = await checkToken(reqToken);

  const user = await User.findOne({ userId: solvedToken.id });
  if (!user) {
    res.send({
      message:
        "It looks like you are not registered. All you need to do to register is refreshing page. Once you refresh the page, you will be registered.",
    });
  }

  const code = uuid().slice(0, 6);

  const newConfirmation = new Confirmation({
    userId: user.userId,
    userMail,
    confirmationCode: code,
  });

  newConfirmation.save();

  const mail = {
    from: "no-reply-confirm-mail@simplemsg.com", // Sender address
    to: "to@email.com", // List of recipients
    subject: "Mail confirmation", // Subject line
    text: `Click the link below to comfirm your mail. Your code is: ${code}`, // Plain text body
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

  const { hashtags, message, creatorName, creatorMail, userIp } = req.body;

  const user = await verifyTokenData(req);
  //   console.log("User: ", user);
  if (!user) {
    res.send({
      message:
        "An error occured. It looks like you are not registered. This may because you cleared your browser cookies.",
    });
  }

  const userConfirmation = await Confirmation.findOne({ userId: user.userId });
  if (!userConfirmation) {
    res.send({
      message: "Your confirmation code is expired. Please get a new one.",
    });
  }
  const checkCode = userConfirmation.confirmationCode === code ? true : false;

  if (!checkCode) {
    res.send({ message: "You are a little impostor, aren't you?" });
  }

  user.isMailConfirmed = true;
  user.save();

  res.send({
    message:
      "Thank you for confirming your mail. Now you can get your account back whenever you want.",
  });
};

const addUserDetails = async (req, res) => {
  const { creatorName, creatorMail, userIp } = req.body;
  const user = await verifyTokenData(req);
  const userConfirmation = await Confirmation.findOne({ userId: user.userId });
  if (!userConfirmation) {
    res.send({
      message: "Your confirmation code is expired. Please get a new one.",
    });
  }
  const checkCode = userConfirmation.confirmationCode === code ? true : false;

  if (!checkCode) {
    res.send({ message: "You are a little impostor, aren't you?" });
  }

  user.userName = creatorName;
  if (creatorMail) {
    user.userMail = creatorMail;
    user.save();
    const code = uuid().slice(0, 6);

    const newConfirmation = new Confirmation({
      userId: user.userId,
      userMail,
      confirmationCode: code,
    });

    newConfirmation.save();

    const mail = {
      from: "no-reply-confirm-mail@simplemsg.com", // Sender address
      to: "to@email.com", // List of recipients
      subject: "Mail confirmation", // Subject line
      text: `Click the link below to comfirm your mail. Your code is: ${code}`, // Plain text body
    };
    transport.sendMail(mail, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    res.send({
      message: `Dear ${user.userName}, your details have been updated. Please check your inbox (and spam folder) to verify your mail. We promise that we won't sell your data to anyone or use it by anymeans.`,
    });
  }
  user.save();
  res.send({
    message: `Dear ${user.userName}, how nice of you to share your name with us! We promise we won't use it by anymeans.`,
  });
};

module.exports = {
  clearUser,
  getUserId,
  confirmMail,
  confirmation,
  addUserDetails,
};
