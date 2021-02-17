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
  const agencies = require("../controller/agencies")(app, io);
  try {
    app.post(
      "/register/agency",
      ensureAuthorized,
      middlewares
        .commonUpload(CONFIG.DIRECTORY_AGENY)
        .fields([{ name: "agency_logo", maxCount: 1 }]),
      agencies.agency_register
    );
    app.post("/agency/details", ensureAuthorized, agencies.agency_details);
    app.post(
      "/agency/details/save",
      ensureAuthorized,
      middlewares
        .commonUpload(CONFIG.DIRECTORY_AGENY)
        .fields([{ name: "agency_logo", maxCount: 1 }]),
      agencies.agency_details_save
    );
    app.post("/agency/list", ensureAuthorized, agencies.agency_list);

    app.post("/agency/delete", ensureAuthorized, agencies.delete_agency);
    app.post(
      "/agency/deleted/deleted_list",
      ensureAuthorized,
      agencies.deleted_agency_list
    );
    app.post("/agency/archive", ensureAuthorized, agencies.archive_agency);
    app.post(
      "/agency/archive/archive_list",
      ensureAuthorized,
      agencies.archive_agency_list
    );
    app.post("/agency/remove", ensureAuthorized, agencies.permenent_delete);
    // app.post(
    //   "/agency/remove/all",
    //   ensureAuthorized,
    //   agencies.permenent_delete_all
    // );
    app.post("/image/preview", ensureAuthorized, agencies.image_preview);
  } catch (error) {
    console.log(error);
  }
};
