"use strict";

const jwt = require("jsonwebtoken"),
  CONFIG = require("../config/config"),
  db = require("../model/mongodb"),
  middlewares = require("../model/middlewares");

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
  const documents = require("../controller/documents")(app, io);
  try {
    app.post(
      "/document/upload",
      ensureAuthorized,
      middlewares
        .commonUpload(CONFIG.DIRECTORY_DOCUMENTS)
        .fields([{ name: "avatar", maxCount: 1 }]),
      documents.upload_document
    );
    app.post("/document/upload/save", ensureAuthorized, documents.save_uploads);
    app.post("/document/all", ensureAuthorized, documents.get_all_doc);
    app.post("/document/delete", ensureAuthorized, documents.document_delete);
  } catch (error) {
    console.log(error);
  }
};
