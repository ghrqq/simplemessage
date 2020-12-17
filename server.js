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
} = require("./routes/userRoutes");
const { sendMessage } = require("./routes/contentRoutes");

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

// User Routes

app.post("/clearuser", (_req, res) => clearUser(_req, res));
app.post("/getuserid", async (req, res) => getUserId(req, res));
app.post("/confirmmail", async (req, res) => confirmMail(req, res));
app.post("/confirmation/:code", async (req, res) => confirmation(req, res));
app.post("/getbackyouraccount", async (req, res) => {});

// Content Routes

app.post("/sendmessage", async (req, res) => sendMessage(req, res));

app.get("/", (_req, res) => {
  res.send(`Hello again `);
});

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () => console.log(`Hello from  ${PORT}`));
