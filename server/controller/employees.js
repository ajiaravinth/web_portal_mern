const db = require("../model/mongodb");
const { checkArray } = require("./events/common");

module.exports = () => {
  let router = {};

  router.get_all = async (req, res) => {
    let allDoc = await db.GetDocs(
      "agencies",
      { status: 1 },
      { username: 1 },
      {}
    );
    if (allDoc.length === 0) {
      res.json({
        status: 0,
        response: "No data found!!",
      });
    }

    if (allDoc.length > 0) {
      res.json({
        status: 1,
        response: allDoc,
      });
    }
  };

  router.agency_details = async (req, res) => {
    let oneDoc = await db.GetOneDoc(
      "agencies",
      { username: req.body.username, status: 1 },
      { name: 1, email: 1, phone: 1, username: 1 },
      {}
    );
    if (oneDoc) {
      res.json({
        status: 1,
        response: oneDoc,
      });
    }
    if (!oneDoc) {
      res.json({
        status: 0,
        response: "No Data Found!!",
      });
    }
  };

  router.add_employee = async (req, res) => {
    req.checkBody("first_name", "First name is required").notEmpty();
    req.checkBody("last_name", "Last name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("worklocation", "Work Location is required").notEmpty();
    req.checkBody("phone", "Phone Number is required").notEmpty();
    req.checkBody("job_role", "Job Role is required").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
      res.json({ status: 0, response: errors[0].msg });
    }
    let details = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      username: req.body.username,
      phone: req.body.phone,
      worklocation: req.body.worklocation,
      agencyid: req.body.agencyid,
      adminid: req.headers.adminid,
      employee_status: req.body.employee_status,
      job_role: req.body.job_role,
      status: 1,
    };

    let check_username = await db.GetDocs(
      "employees",
      {
        $and: [
          { username: req.body.username },
          { agencyid: req.body.agencyid },
        ],
      },
      {},
      {}
    );
    if (
      check_username &&
      checkArray(check_username) &&
      check_username.length > 0
    ) {
      res.json({ status: 0, response: "Name already exsist!!" });
    } else {
      let insertDoc = await db.InsertDocs("employees", details);
      if (!insertDoc) res.json({ status: 0, response: "No Employee Added!!" });
      if (insertDoc)
        res.json({ status: 1, response: "Employee added successful!!" });
    }
  };

  router.employees_list = async (req, res) => {
    req.checkBody("id", "Invalid Id").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
      res.json({ status: 0, response: errors[0].msg });
    }
    let docData = await db.GetDocs(
      "employees",
      { agencyid: req.body.id },
      {
        name: 1,
        email: 1,
        phone: 1,
        worklocation: 1,
        username: 1,
        employee_status: 1,
        job_role: 1,
      },
      {}
    );
    if (docData.length === 0) res.json({ status: 0, response: "No Data!!" });
    if (docData.length > 0) res.json({ status: 1, response: docData });
  };
  return router;
};
