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
  try {
    const employees = require("../controller/employees")(app, io);
    app.get("/employees/name_list", ensureAuthorized, employees.get_all);
    app.post("/agency/detail", ensureAuthorized, employees.agency_details);
    app.post("/employee/add", ensureAuthorized, employees.add_employee);
    app.post("/employees/list", ensureAuthorized, employees.employees_list);
  } catch (error) {
    console.log("Error in employees" + error);
  }
};
