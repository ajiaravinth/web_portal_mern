const {
  GetOneDoc,
  UpdateDoc,
  GetDocs,
  InsertDocs,
} = require("../model/mongodb");
const library = require("../model/library");
const { checkArray } = require("./events/common");

module.exports = () => {
  const router = {};

  router.admin_register = async (req, res) => {
    data = {};
    data.status = 0;
    req.checkBody("name", "Name is requires").notEmpty();
    req.checkBody("username", "Username Required").notEmpty();
    req.checkBody("email", "Email Required").notEmpty();
    req.checkBody("password", "Password Required").notEmpty();
    req.checkBody("phone", "Phone Number Required").notEmpty();
    const error = req.validationErrors();
    if (error) {
      data.response = error[0].msg;
      res.send(data);
    }
    const admin = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      status: 1,
    };

    if (req.body.password) {
      // user.password = bcrypt.hashSync(
      //   req.body.password,
      //   bcrypt.genSaltSync(8),
      //   null
      // );
      admin.password = library.jwtSign({
        password: admin.password,
      });
    }

    let check_email = await GetDocs(
      "administrators",
      { email: String(admin.email).trim() },
      { _id: 1 },
      {}
    );
    if (check_email && checkArray(check_email) && check_email.length > 0) {
      return res.json({ status: 0, response: "Email is already exisits!" });
    }
    let check_username = await GetDocs(
      "administrators",
      { username: String(admin.username).trim() },
      { _id: 1 },
      {}
    );
    if (
      check_username &&
      checkArray(check_username) &&
      check_username.length > 0
    ) {
      return res.json({ status: 0, response: "Username is already exisits!" });
    }

    let newDocs = InsertDocs("administrators", admin);
    if (newDocs) {
      return res.json({
        status: 1,
        response: "Registered successfully.",
      });
    } else {
      return res.json({
        status: 0,
        response: "Unable to Save Your Data Please try again",
      });
    }
  };

  router.admin_login = async (req, res) => {
    data = {};
    data.status = 0;
    req.checkBody("email", "Email Required").notEmpty();
    req.checkBody("password", "Password Required").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    const { email, password } = req.body;

    let docData = await GetOneDoc(
      "administrators",
      {
        $or: [
          { email: email, status: 1 },
          { username: email, status: 1 },
        ],
      },
      {},
      {}
    );

    if (!docData) {
      return res.json({
        status: 0,
        response: "Invalid Credentials",
      });
    } else {
      if (library.validPassword(password, docData.password)) {
        const updata = { activity: {} };
        updata.activity.last_login = Date();
        let updateDoc = await UpdateDoc(
          "administrators",
          { _id: docData._id },
          updata,
          {}
        );
        if (!updateDoc) {
          return res.json({
            status: 0,
            response: "Invalid Credentials",
          });
        }
      } else {
        const auth_token = library.jwtSign({
          username: docData.username,
          id: docData._id,
        });
        return res.json({
          status: 1,
          response: { auth_token: auth_token },
          message: "Login Success!!",
        });
      }
    }
  };

  router.admin_logout = async (req, res) => {
    const data = {};
    data.status = 0;
    req.checkBody("username", "Username Required").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      res.send(data);
      return;
    }
    let update = UpdateDoc(
      "administrators",
      { username: req.body.username },
      {},
      {}
    );
    if (update) {
      data.status = 1;
      data.response = "Logged Out!";
      return res.send(data);
    } else {
      data.response = "Error Occured";
      return res.send(data);
    }
  };

  router.admin_profile = async (req, res) => {
    let data = {};
    data.status = 0;

    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    let docData = await GetOneDoc(
      "administrators",
      { _id: req.body.id },
      {},
      {}
    );
    if (docData) {
      data.status = 1;
      data.response = { result: docData };
      return res.send(data);
    } else {
      data.response = "Unable to get your data, Please try again";
      return res.send(data);
    }
  };

  router.admin_profile_save = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("name", "Invalid Name").notEmpty();
    req.checkBody("email", "Invalid Email").notEmpty();
    req.checkBody("phone", "Invalid Phone Number").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const admin = {
      id: req.body.id,
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      status: req.body.status,
      phone: req.body.phone,
    };

    if (
      req.body.username &&
      String(req.body.username).length > 0 &&
      String(req.body.username) !== String(undefined) &&
      String(req.body.username).includes(" ")
    ) {
      return res.json({
        status: 0,
        response: "Username should not contain any space",
      });
    }
    if (req.body.password !== "") {
      req.checkBody("password", "Invalid Password").notEmpty();
    }
    if (req.body.password) {
      // user.password = bcrypt.hash(
      //   req.body.password,
      //   bcrypt.genSaltSync(8),
      //   null
      // );
      admin.password = library.jwtSign({
        password: admin.password,
      });
    }

    let check_email = await GetDocs(
      "administrators",
      { email: String(req.body.email).trim() },
      {},
      {}
    );
    if (check_email && checkArray(req.body.email) && check_email.length > 0) {
      return res.json({
        status: 0,
        response: "Email already exists",
      });
    }
    let updateUser = await UpdateDoc(
      "administrators",
      { _id: req.body.id },
      admin,
      { upsert: true }
    );
    if (!updateUser) {
      return res.json({
        status: 0,
        response: "Username/Email is already Exists",
      });
    } else {
      return res.json({
        status: 1,
        response: "Updated Successfully",
      });
    }
  };

  return router;
};
