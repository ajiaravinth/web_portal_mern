"use strict";

const jwt = require("jsonwebtoken"),
  CONFIG = require("../config/config"),
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
  const administrators = require("../controller/administrators")(app, io);
  try {
    app.post("/register", administrators.admin_register);
    app.post("/login", administrators.admin_login);
    app.post("/logout", ensureAuthorized, administrators.admin_logout);
    app.post(
      "/administrators/profile",
      ensureAuthorized,
      administrators.admin_profile
    );
    app.post(
      "/administrators/profile/save",
      ensureAuthorized,
      administrators.admin_profile_save
    );
  } catch (error) {
    console.log(error);
  }
};
