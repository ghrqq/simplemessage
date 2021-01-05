// require("dotenv").config();
const nodemailer = require("nodemailer");
const { htmlMailCreator } = require("./htmlMailCreator");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPass,
  },
});

const message = {
  from: "elonmusk@tesla.com", // Sender address
  to: "to@email.com", // List of recipients
  subject: "Design Your Model S | Tesla", // Subject line
  text: "Have the most fun you can in a car. Get your Tesla today!", // Plain text body
};

const htmlCompiler = () => {
  return "<html><a href='abc'>Click this fucking shit.</a></html>";
};

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
