// require("dotenv").config();
const nodemailer = require("nodemailer");
const { htmlMailCreator } = require("./htmlMailCreator");

const transport = nodemailer.createTransport({
  host: process.env.mailHost,
  port: process.env.mailPort,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPass,
  },
});

const confirmationMailBody = (code, name, mail, route, type) => {
  return {
    from: "no-reply-confirm-mail@simplemsg.com", // Sender address
    to: mail, // List of recipients
    subject: "Mail confirmation", // Subject line
    text: `Click the link below to comfirm your mail. ${code}`,
    html: htmlMailCreator(code, name, mail, route, type),
    // html: "<html><a href='abc'>Click this fucking shit.</a></html>",
  };
};

module.exports = {
  transport,
  message,
  confirmationMailBody,
};
