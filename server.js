const express = require("express");
require("dotenv").config();

const path = require("path");

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
  userProfile,
  myProfile,
} = require("./routes/userRoutes");
const {
  sendMessage,
  getRandom,
  getByHashTag,
  deletePost,
  getSearchParams,
  getUserPosts,
  singlePost,
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

app.use(express.static(path.join(__dirname, "client", "build")));

// User Routes

app.post("/api/clearuser", (_req, res) => clearUser(_req, res));

app.post("/api/getuserid", async (req, res) => getUserId(req, res));
app.post("/api/checkuserid", async (req, res) => checkUserId(req, res));
app.post("/api/confirmmail", async (req, res) => confirmMail(req, res));
app.get("/api/confirmation/:code", async (req, res) => confirmation(req, res));
app.post("/api/adduserdetails", async (req, res) => addUserDetails(req, res));
app.post("/api/getbackyouraccount", async (req, res) =>
  getBackYourAccount(req, res)
);
app.get("/api/confirmgetback/:code", async (req, res) =>
  confirmGetBack(req, res)
);
app.get("/api/userprofile/:user", async (req, res) => userProfile(req, res));
app.post("/api/myprofile", async (req, res) => myProfile(req, res));

// Content Routes

app.get("/api/singlepost/:id", async (req, res) => singlePost(req, res));
app.post("/api/sendmessage", async (req, res) => sendMessage(req, res));
app.get("/api/getrandom/:lim/:skip", async (req, res) => getRandom(req, res));
app.get("/api/getbyhashtag/:hashtag", async (req, res) =>
  getByHashTag(req, res)
);
app.delete("/api/deletepost", async (req, res) => deletePost(req, res));
app.get("/api/getsearchparams", async (req, res) => getSearchParams(req, res));
app.get("/api/getuserposts/:id", async (req, res) => getUserPosts(req, res));

// Rate Routes
app.post("/api/ratemessage", async (req, res) => rateMessage(req, res));

app.get("/api/", (_req, res) => {
  res.send(`Hi `);
});

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () => console.log(`Hi agin  ${PORT}`));
