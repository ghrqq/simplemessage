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
        status: 200,
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
        status: 200,
      });
    }
  } catch (error) {
    res.status(400).send({
      error: `Error catched: ${error.message}`,

      status: 400,
    });
  }
};

// Clear Cookies - That makes users account inaccessible.
const clearUser = (_req, res) => {
  res.clearCookie("usertoken");
  return res.status(200).send({
    message: "You are like a new born.",
    status: 200,
  });
};

// To get a mail including confirmation code.
const confirmMail = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userMail } = req.body;

  const solvedToken = await checkToken(reqToken);

  if (!solvedToken) {
    res.status(400).send({ message: "No token was found.", status: 400 });
  }

  const user = await User.findOne({ userId: solvedToken.id });
  if (user.userMail !== userMail) {
    res.status(400).send({
      message: "Your mail does not match with our data.",
      status: 400,
    });
  }

  if (!user) {
    res.status(400).send({
      message: "Please register first.",
      status: 400,
    });
  }

  const code = createConfirmToken(user.userId, userMail);

  const newConfirmation = new Confirmation({
    userId: user.userId,
    userMail,
    confirmationToken: code,
  });

  newConfirmation.save();
  // user.userMail = userMail;
  // user.save();

  const mail = {
    from: "no-reply-confirm-mail@simplemsg.com", // Sender address
    to: userMail, // List of recipients
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

  res.status(200).send({ message: "Please check your mailbox.", status: 200 });
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
        status: 400,
      });
    }

    const { id, mail } = checkConfirmToken(code);
    console.log("id from checkConfirmToken: ", id, "mail: ", mail);
    if (!id || !mail) {
      res.status(400).send({
        message: "Some data is missing in your token. Please get a new one. ",
        status: 400,
      });
    }

    const userToConfirm = await User.findOne({ userId: id });

    console.log("usertoconfirm: ", userToConfirm);
    if (!userToConfirm) {
      res.status(400).send({
        message: "Looks like there is no user with given ID.",
        status: 400,
      });
    }
    if (userToConfirm.userMail === mail) {
      (userToConfirm.isMailConfirmed = true), userToConfirm.save();
      res.status(200).send({
        message: "Your mail is confirmed. ",
        status: 200,
      });
    } else {
      res.status(400).send({ message: "Fucked up", status: 400 });
    }
  } catch (error) {
    res.status(400).send({
      error: `Error catched: ${error.message}`,
      status: 400,
    });
  }
};

const addUserDetails = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const {
    userName,
    isMailsAllowed,
    favoriteHashtags,
    userId,
    userMail,
  } = req.body;

  try {
    const { id } = checkToken(reqToken);

    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(400).send({ message: "User not found.", status: 400 });
    }

    user.userName = userName ? userName : user.userName;
    user.isMailsAllowed = isMailsAllowed ? true : user.isMailsAllowed;
    user.userMail = userMail ? userMail : user.userMail;
    user.favoriteHashtags = favoriteHashtags
      ? favoriteHashtags
      : user.favoriteHashtags;

    const isSaved = await user.save();

    // Dev Only
    const checkUser = await User.findOne({ userId: id });

    res.status(200).send({
      message:
        "Your profile is updated successfuly. We promise that we won't sell any of your data. ",
      userMail: userMail,
      status: 200,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: `An error occured. ${error.message}`, status: 400 });
  }
};

const getBackYourAccount = async (req, res) => {
  const { mail } = req.body;
  const user = await User.findOne({ userMail: mail });

  if (!user) {
    res
      .status(400)
      .send({ message: "Your mail is not registered.", status: 400 });
  }
  if (!user.isMailConfirmed) {
    res.status(400).send({
      message:
        "You did not confirmed your mail. So you cannot reach your account. Sorry. You may try the first device you have used this page or just forget about your old account and start over.",
      status: 400,
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
    status: 400,
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
      status: 400,
    });
  }

  const user = await User.findOne({ userId: userConfirmation.userId });
  if (!user) {
    res.status(400).send({
      message: "Something went terribly wrong. We cannot identify you. ",
      status: 400,
    });
  }

  const token = await createToken(user.userId);

  user.token = token;
  user.save();

  sendToken(res, token);

  res
    .status(200)
    .send({ message: "New configurations are successfuly set.", status: 200 });
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
