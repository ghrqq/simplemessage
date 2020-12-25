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
const { createToken, sendToken } = require("./tools/token");
const { checkToken, verifyTokenData } = require("./tools/checkToken");
const nodemailer = require("nodemailer");
const {
  clearUser,
  getUserId,
  confirmMail,
  confirmation,
  addUserDetails,
  confirmGetBack,
  getBackYourAccount,
  checkUserId,
} = require("./routes/userRoutes");
const {
  sendMessage,
  getRandom,
  getByHashTag,
  deletePost,
} = require("./routes/contentRoutes");
const { rateMessage } = require("./routes/rateRoutes");

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

// User Routes

app.post("/clearuser", (_req, res) => clearUser(_req, res));

app.post("/getuserid", async (req, res) => getUserId(req, res));
app.post("/checkuserid", async (req, res) => checkUserId(req, res));
app.post("/confirmmail", async (req, res) => confirmMail(req, res));
app.get("/confirmation/:code", async (req, res) => confirmation(req, res));
app.post("/adduserdetails", async (req, res) => addUserDetails(req, res));
app.post("/getbackyouraccount", async (req, res) =>
  getBackYourAccount(req, res)
);
app.post("/confirmgetback/:code", async (req, res) => confirmGetBack(req, res));

// Content Routes

app.post("/sendmessage", async (req, res) => sendMessage(req, res));
app.get("/getrandom", async (req, res) => getRandom(req, res));
app.get("/getbyhashtag/:hashtag", async (req, res) => getByHashTag(req, res));
app.delete("/deletepost", async (req, res) => deletePost(req, res));

// Rate Routes
app.post("/ratemessage", async (req, res) => rateMessage(req, res));

app.get("/", (_req, res) => {
  res.send(`Hello again `);
});

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () => console.log(`Hello from  ${PORT}`));
