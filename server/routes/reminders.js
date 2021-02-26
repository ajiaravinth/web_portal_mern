"use strict";

const jwt = require("jsonwebtoken"),
  CONFIG = require("../config/config"),
  middlewares = require("../model/middlewares"),
  db = require("../model/mongodb");

let ensureAuthorized = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    jwt.verify(token, CONFIG.SECRET_KEY, async (err, decode) => {
      if (err || !decode) {
        res.json({
          status: "00",
          response: "Unauthorized Access",
        });
      } else {
        let auth_check = await db.GetOneDoc(
          "administrators",
          { username: decode.username, status: 1 },
          {},
          {}
        );
        if (!auth_check) {
          res.json({
            status: "00",
            response: "Unauthorized Access",
          });
        }
        if (auth_check) {
          req.params.loginId = auth_check._id;
          req.params.loginData = auth_check;
          next();
        }
      }
    });
  } else {
    res.json({
      response: "Unauthorized Access",
    });
  }
};

module.exports = (app, io) => {
  const reminders = require("../controller/reminders")(app, io);
  try {
    app.post("/reminder/set", ensureAuthorized, reminders.set_reminder);
  } catch (error) {
    console.log(error);
  }
};
