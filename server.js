const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const Post = require("./schemas/Post");
const User = require("./schemas/User");
const Confirmation = require("./schemas/Confirmation");
const { v4: uuid } = require("uuid");
const { verify } = require("jsonwebtoken");
const { hash, compare, genSalt } = require("bcryptjs");
const { createToken, sendToken } = require("./token");
const { checkToken } = require("./checkToken");
const nodemailer = require("nodemailer");

const mongoose = require("mongoose");
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Mongo DB is connected.");
});

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e07449b098fa69",
    pass: "15e35b3162203f",
  },
});
const message = {
  from: "elonmusk@tesla.com", // Sender address
  to: "to@email.com", // List of recipients
  subject: "Design Your Model S | Tesla", // Subject line
  text: "Have the most fun you can in a car. Get your Tesla today!", // Plain text body
};

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Needed to be able to read body data

app.use(express.json()); //to support JSON-encoder bodies

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (_req, res) => {
  res.send(`Hello again motherfucker! ${uuid()}`);
});

// User creation with jwt
app.post("/getuserid", async (req, res) => {
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
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
      res.send({
        id: user.id,
      });
    }
  } catch (error) {
    res.send({
      error: `Error catched: ${error.message}`,
    });
  }
});

app.post("/clearuser", async (_req, res) => {
  res.clearCookie("usertoken");

  return res.send({
    message: "You are like a new born.",
  });
});

// Create post
app.post("/sendmessage", async (req, res) => {
  const reqToken = req.cookies.usertoken;

  const { hashtags, message, creatorName, creatorMail, userIp } = req.body;

  if (!reqToken) {
    res.send({
      message: `Something went terribly wrong. Please refresh the page and try again. Do not forget to copy your message to somewhere safe. If problem continues clear cookies, refresh the page and pray for it to work. `,
    });
  }

  const solvedToken = await checkToken(reqToken);

  const user = await User.findOne({ userId: solvedToken.id });

  const isValid =
    user.userIp === solvedToken.ip && user.userIp === userIp ? true : false;

  if (user.isBlocked) {
    res.send({
      message:
        "You are blocked! This might be because you messed up with your token. No need to worry. Since this is an open platform, all you need to do is clear your cookies and suddenly you will have a new account.",
    });
  }

  if (isValid) {
    try {
      const newPost = new Post({
        hashtags,
        message,
        creatorName,
        creatorId: user.userId,
        creatorIp: userIp,
        creatorMail,
      });
      const createPost = await newPost.save();

      user.messagesCreated = user.messagesCreated + 1;

      const updateUser = await user.save();

      res.send({ message: "Post created successfuly." });
    } catch (error) {
      res.send({
        error: `Error catched: ${error.message}`,
      });
    }
  } else {
    res.send({ message: "There is a problem with your ip/token. " });
  }
});

app.post("/getbackyouraccount", async (req, res) => {});

app.post("/confirmmail", async (req, res) => {
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
});

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () => console.log(`Hello from  ${PORT}`));
