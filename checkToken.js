const { verify } = require("jsonwebtoken");

const checkToken = (req) => {
  if (!req) throw new Error("No token was found");

  const { ip, id } = verify(req, process.env.tokenSecret);

  return { ip, id };
};

module.exports = {
  checkToken,
};
