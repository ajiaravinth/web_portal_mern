const bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  jwt_decode = require("jwt-decode"),
  CONFIG = require("../config/config");

const validPassword = (password, passworddb) => {
  return bcrypt.compareSync(password, passworddb);
  // return jwt.decode(passworddb)
};

const jwtSign = (payload) => {
  return jwt.sign(payload, CONFIG.SECRET_KEY, { expiresIn: "10h" });
};

module.exports = {
  validPassword,
  jwtSign,
};
