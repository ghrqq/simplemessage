// require("dotenv").config();

const Post = require("../schemas/Post");
const User = require("../schemas/User");
const Confirmation = require("../schemas/Confirmation");

const { v4: uuid } = require("uuid");

const { union } = require("lodash");
const {
  createToken,
  sendToken,
  createConfirmToken,
} = require("../tools/token");
const { htmlMailCreator } = require("../tools/htmlMailCreator");
const {
  checkToken,

  checkConfirmToken,
} = require("../tools/checkToken");
const { confirmationMailBody, transport } = require("../tools/nodemailer");

// User creation with jwt

const getUserId = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const { userName, userMail, isAgreed, isMailsAllowed } = req.body;

  try {
    if (!reqToken) {
      // if (!isAgreed) {
      //   res.status(400).send({
      //     message:
      //       "I do not know how you have submitted this form but you should have agreed user terms. Please read carefully and if you agree the terms, check the tiny box that says 'I agree' and send the form again.",
      //   });
      // }
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
        isAgreed: newUser.isAgreed,
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
        isAgreed: user.isAgreed,
      });
    }
  } catch (error) {
    res.status(400).send({
      error: `Error catched: ${error.message}`,

      status: 400,
    });
  }
};

// At first load, check if user is already registered by cookie.

const checkUserId = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  if (!reqToken) {
    res.status(400).send({
      message: "You are not logged in!",
      status: 400,
    });
  }

  try {
    const solvedToken = await checkToken(reqToken);

    const user = await User.findOne({ userId: solvedToken.id });
    const newToken = createToken(user.userId);

    const resName =
      user.userName === undefined ? "Mysterious Messager" : user.userName;
    user.token = newToken;
    user.save();
    sendToken(res, newToken);

    res.status(200).send({
      message: `Welcome back ${resName}`,
      id: user.userId,
      name: resName,
      status: 200,
      isAgreed: user.isAgreed,
      favoriteHashtags: user.favoriteHashtags,
    });
  } catch (error) {
    console.log(`Error catched: ${error.message}`);
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

  // const mail = {
  //   from: "no-reply-confirm-mail@simplemsg.com", // Sender address
  //   to: userMail, // List of recipients
  //   subject: "Mail confirmation", // Subject line
  //   text: `Click the link below to comfirm your mail: http://localhost:4000/confirmation/${code}`, // Plain text body
  //   html: "<html><a href='abc'>Click this fucking shit.</a></html>",
  // };

  // (code, name, mail, route, type)
  transport.sendMail(
    htmlMailCreator(
      code,
      user.userName,
      userMail,
      `${process.env.siteURL}/confirmation`,
      "mailconfirm"
    ),
    function (err, info) {
      if (err) {
        throw new Error();
      } else {
        return;
      }
    }
  );

  res.status(200).send({
    message:
      "Please check your mailbox. (Spam and other secondary folders too.)",
    status: 200,
  });
};

// To send back the mail confirmation code

const confirmation = async (req, res) => {
  const code = req.params.code;

  try {
    const userConfirmation = await Confirmation.findOne({
      confirmationToken: code,
    });

    if (!userConfirmation) {
      res.status(400).send({
        message:
          "Your confirmation code is expired or false. Please get a new one.",
        status: 400,
      });
      return;
    }

    const { id, mail } = checkConfirmToken(code);

    if (!id || !mail) {
      res.status(400).send({
        message: "Some data is missing in your token. Please get a new one. ",
        status: 400,
      });
      return;
    }

    const userToConfirm = await User.findOne({ userId: id });

    if (!userToConfirm) {
      res.status(400).send({
        message: "Looks like there is no user with given ID.",
        status: 400,
      });
      return;
    }
    if (userToConfirm.userMail === mail) {
      userToConfirm.isMailConfirmed = true;
      const isConfirmSaved = await userToConfirm.save();
      if (!isConfirmSaved) {
        res.status(400).send({
          message: "Confirmation failed.",
          status: 400,
        });
      }
      res.status(200).send({
        message: "Your mail is confirmed. ",
        status: 200,
      });
    } else {
      res.status(400).send({ message: "Fucked up", status: 400 });
    }
  } catch (error) {
    console.log(`Error catched line 241: ${error.message}`);
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
    isConfirm,
  } = req.body;

  try {
    const { id } = checkToken(reqToken);

    if (id !== userId) {
      res.status(400).send({
        message: "Ids do not match. Clear your cookies and try again.",
        status: 400,
      });
    }

    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(400).send({ message: "User not found.", status: 400 });
    }

    if (userMail) {
      const isMailRegistered = await User.find({ userMail });
      if (
        isMailRegistered.length > 0 &&
        isMailRegistered.userId !== user.userId &&
        isMailRegistered.isMailConfirmed === true
      ) {
        res.status(400).send({
          message:
            "This email is already in use. Try a different mail adress or try to get back your account.",
        });
      }
    }

    if (userMail !== user.userMail) {
      user.isMailConfirmed = false;
    }
    user.userName = userName ? userName : user.userName;
    user.isMailsAllowed = isMailsAllowed ? true : user.isMailsAllowed;
    user.userMail = userMail ? userMail : user.userMail;
    user.favoriteHashtags = favoriteHashtags
      ? favoriteHashtags
      : user.favoriteHashtags;
    const isSaved = await user.save();

    const postsToUpdate = await Post.updateMany(
      { creatorId: user.userId },
      { creatorName: user.userName }
    );

    if (!isConfirm) {
      res.status(200).send({
        message:
          "Your profile is updated successfuly. We promise that we won't sell any of your data.",
        userMail: userMail,
        status: 200,
      });
    }

    if (user.isMailConfirmed === true && userMail === user.userMail) {
      res.status(200).send({
        message: "Looks like your mail is already confirmed.",
        userMail: userMail,
        status: 200,
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

    // (code, name, mail, route, type)
    transport.sendMail(
      htmlMailCreator(
        code,
        user.userName,
        userMail,
        `${process.env.siteURL}/confirmation`,
        "mailconfirm"
      ),
      function (err, info) {
        if (err) {
          throw new Error();
        } else {
          return;
        }
      }
    );

    res.status(200).send({
      message:
        "Please check your mailbox. (Spam and other secondary folders too.)",
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
    confirmationToken: code,
  });

  newConfirmation.save();
  // (code, name, mail, route, type)
  transport.sendMail(
    htmlMailCreator(
      code,
      user.userName,
      user.userMail,
      `${process.env.siteURL}/confirmation`,
      "getback"
    ),
    function (err, info) {
      if (err) {
        throw new Error();
      } else {
        return;
      }
    }
  );

  res.status(200).send({
    message: `Dear ${user.userName}, we got your request to get back your account. Please check your inbox (and spam folder) and follow the steps in there. `,
    status: 200,
  });
};

const confirmGetBack = async (req, res) => {
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
      message: "Something went terribly wrong. We cannot identify you.",
      status: 400,
    });
  }

  const token = await createToken(user.userId);

  user.token = token;
  user.save();

  sendToken(res, token);

  res.status(200).send({
    message: "New configurations are successfuly set. You are good to go!",
    status: 200,
  });
};

const userProfile = async (req, res) => {
  const userId = req.params.user;
  try {
    const user = await User.findOne({ userId });

    if (!user) {
      res.status(400).send({
        message: "User not found. ",
        status: 400,
      });
    }

    res.status(200).send({
      lang: user.lang,
      userName: user.userName,
      rate: user.rate,
      messagesCreated: user.messagesCreated,
      status: 200,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      status: 400,
    });
  }
};

const myProfile = async (req, res) => {
  const reqToken = req.cookies.usertoken;
  const payloadId = req.body.id;

  try {
    const { id } = checkToken(reqToken);
    if (payloadId !== id) {
      res.status(400).send({
        message: "You look like an impostor!",
        status: 400,
      });
    }
    const user = await User.findOne({ userId: id });

    if (reqToken !== user.token) {
      res.status(400).send({
        message: "Tokens do not match.",
        status: 400,
      });
    }

    if (!user) {
      res.status(400).send({
        message: "We cannot find the user with given id.",
        status: 400,
      });
    }

    const posts = await Post.find({ creatorId: id });
    const hashTagsRaw = posts.map((item) => item.hashtags);
    const hashtags = union(...hashTagsRaw);

    res.status(200).send({
      lang: user.lang,
      userName: user.userName,
      rate: user.rate,
      userMail: user.userMail,
      isMailsAllowed: user.isMailsAllowed,
      isAgreed: user.isAgreed,
      isMailConfirmed: user.isMailConfirmed,
      posts,
      hashtags,
      status: 200,
    });
  } catch (error) {}
};

module.exports = {
  clearUser,
  getUserId,
  confirmMail,
  confirmation,
  addUserDetails,
  getBackYourAccount,
  confirmGetBack,
  checkUserId,
  userProfile,
  myProfile,
};
