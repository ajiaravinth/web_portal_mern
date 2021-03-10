const db = require("../model/mongodb");
const library = require("../model/library");
const { checkArray } = require("./events/common");
const moment = require("moment");
const attachment = require("../model/attachments");

module.exports = () => {
  const router = {};

  router.agency_register = async (req, res) => {
    const data = {};
    data.status = 0;
    req.checkBody("username", "Username is Required!").notEmpty();
    req.checkBody("agency_name", "Agency Name is Required!").notEmpty();
    req.checkBody("email", "Invalid Email!").notEmpty().isEmail();
    req.checkBody("name", "Name is Required!").notEmpty();
    req.checkBody("gender", "Select Gender!").notEmpty();
    req.checkBody("language", "Select Language!").notEmpty();
    req.checkBody("dateofbirth", "DOB is Required!").notEmpty();
    if (!req.body._id) {
      req.checkBody("password", "Invalid Password").notEmpty();
      req
        .checkBody("confirm_password", "Password not match")
        .equals(req.body.password);
    }
    req.checkBody("phone.code", "Invalid Number").notEmpty();
    req.checkBody("phone.number", "Invalid Number").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    const agency = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      gender: req.body.gender,
      language: JSON.parse(req.body.language),
      phone: req.body.phone,
      agency_name: req.body.agency_name,
      login_date: moment().format("YYYY/MM/DD"),
      address: req.body.address,
      dateofbirth: req.body.dateofbirth,
      status: 1,
      tempstatus: req.body.tempstatus,
    };

    if (req.body.password && req.body.confirm_password) {
      agency.password = library.jwtSign({
        password: agency.password,
      });
    }

    if (req.files && typeof req.files.agency_logo !== "undefined") {
      if (req.files.agency_logo.length > 0) {
        agency.agency_logo = attachment.get_attachment(
          req.files.agency_logo[0].destination,
          req.files.agency_logo[0].filename
        );
      }
    }

    let check_email = await db.GetDocs(
      "agencies",
      { email: String(req.body.email).trim() },
      {},
      {}
    );
    if (check_email && checkArray(check_email) && check_email.length > 0) {
      return res.json({
        status: 0,
        response: "Email already exsist!",
      });
    }

    let check_username = await db.GetDocs(
      "agencies",
      { username: String(req.body.username).trim() },
      {},
      {}
    );
    if (
      check_username &&
      checkArray(check_username) &&
      check_username.length > 0
    ) {
      return res.json({
        status: 0,
        response: "Username already exsist!",
      });
    }

    let agecyRegister = await db.InsertDocs("agencies", agency);
    if (!agecyRegister) {
      data.response = "Username/Email is already Exists";
      res.send(data);
    } else {
      const message = "New Agency Registered!";
      const options = {
        agency_id: agecyRegister._id,
        username: agecyRegister.username,
      };
      return res.json({
        status: 1,
        response: agecyRegister,
        message: message,
        options: options,
      });
    }
  };

  router.agency_details = async (req, res) => {
    let data = {};
    data.status = 0;
    const options = {};
    options.populate = "agency";
    let result = await db.GetOneDoc(
      "agencies",
      { _id: req.body._id },
      {},
      options
    );
    if (!result) {
      return res.json({
        status: 0,
        response: "Invalid Credentials!",
      });
    } else {
      return res.json({
        status: 1,
        response: result,
      });
    }
  };

  router.agency_details_save = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("username", "Invalid Username").notEmpty();
    req.checkBody("email", "Invalid Email").notEmpty();
    req.checkBody("name", "Invalid Name").notEmpty();
    if (!req.body.id || req.body.password != "") {
      req.checkBody("password", "Invalid Password").notEmpty();
      req
        .checkBody("confirm_password", "Passwords do not match.")
        .equals(req.body.password);
    }
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    req.checkBody("phone.code", "Invalid Number").notEmpty();
    req.checkBody("phone.number", "Invalid Number").notEmpty();
    if (req.body.username && String(req.body.username).includes(" ")) {
      return res.json({
        status: 0,
        response: "Username should not contain any space",
      });
    }
    const agency = {
      id: req.body.id,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      gender: req.body.gender,
      language: JSON.parse(req.body.language),
      phone: req.body.phone,
      agency_name: req.body.agency_name,
      agency_logo: req.body.agency_logo,
      login_date: moment().format("YYYY/MM/DD"),
      address: req.body.address,
      dateofbirth: req.body.dateofbirth,
      status: 1,
      tempstatus: req.body.tempstatus,
      actions: [
        {
          name: "view",
          icon: "AiFillEye",
          tooltip: "view",
        },
        {
          name: "edit",
          icon: "AiFillEye",
          tooltip: "edit",
        },
        {
          name: "delete",
          icon: "AiFillEye",
          tooltip: "delete",
        },
        {
          name: "archive",
          icon: "AiFillEye",
          tooltip: "archive",
        },
      ],
    };
    if (req.body.password && req.body.confirm_password) {
      agency.password = library.jwtSign({ password: req.body.password });
    }

    if (req.files && typeof req.files.agency_logo !== "undefined") {
      if (req.files.agency_logo.length > 0) {
        agency.agency_logo = attachment.get_attachment(
          req.files.agency_logo[0].destination,
          req.files.agency_logo[0].filename
        );
      }
    }

    let check_email = await db.GetDocs(
      "agencies",
      { email: String(req.body.email).trim() },
      {},
      {}
    );
    if (check_email && checkArray(check_email) && check_email.length > 1) {
      return res.json({ status: 0, response: "Email Already exists" });
    }

    let check_username = await db.GetDocs(
      "agencies",
      { username: String(req.body.username).trim() },
      {},
      {}
    );
    if (
      check_username &&
      checkArray(check_username) &&
      check_username.length > 1
    ) {
      return res.json({ status: 0, response: "Username Already exists" });
    }
    let result = await db.UpdateDoc("agencies", { _id: req.body.id }, agency, {
      upsert: true,
    });
    if (!result) {
      return res.json({
        status: 0,
        response: "Invalid Details!",
      });
    } else {
      return res.json({
        status: 1,
        response: "Update Success",
      });
    }
  };

  router.agency_list = async (req, res) => {
    let data = {};
    data.status = 0;
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const userQuery = [];

    userQuery.push({
      $match: { tempstatus: { $eq: 1 } },
    });

    if (req.body.from_date && req.body.to_date) {
      userQuery.push({
        $match: {
          dateofbirth: {
            $gte: req.body.from_date,
            $lte: req.body.to_date,
          },
        },
      });
    }

    if (req.body.search) {
      const searchs = req.body.search;
      if (req.body.filter === "all") {
        userQuery.push({
          $match: {
            $or: [
              { name: { $regex: searchs + ".*", $options: "si" } },
              { username: { $regex: searchs + ".*", $options: "si" } },
              { email: { $regex: searchs + ".*", $options: "si" } },
              { agency_name: { $regex: searchs + ".*", $options: "si" } },
              { phone: { $regex: searchs + ".*", $options: "si" } },
              { "phone.code": { $regex: searchs + ".*", $options: "si" } },
              { "phone.number": { $regex: searchs + ".*", $options: "si" } },
              { "address.state": { $regex: searchs + ".*", $options: "si" } },
              { "address.country": { $regex: searchs + ".*", $options: "si" } },
            ],
          },
        });
      } else {
        const searching = {};
        searching[req.body.filter] = { $regex: searchs + ".*", $options: "si" };
        userQuery.push({ $match: searching });
      }
    }

    const withoutlimit = Object.assign([], userQuery);
    withoutlimit.push({ $count: "count" });

    if (req.body.skip >= 0) {
      userQuery.push({ $skip: parseInt(req.body.skip) });
    }

    if (req.body.limit >= 0) {
      userQuery.push({ $limit: parseInt(req.body.limit) });
    }

    if (req.body.field && req.body.order) {
      const sorting = {};
      sorting[req.body.field] = parseInt(req.body.order);

      userQuery.push({ $sort: sorting });
    } else {
      userQuery.push({ $sort: { createdAt: -1 } });
    }

    const finalQuery = [
      {
        $facet: {
          overall: withoutlimit,
          result: userQuery,
        },
      },
    ];

    let docData = await db.GetAggregationDoc("agencies", finalQuery);
    data.status = 1;
    let fullcount;
    if (docData[0].overall[0] && docData[0].overall[0].count) {
      fullcount = docData[0].overall[0].count;
    } else {
      fullcount = docData[0].result.length;
    }
    data.response = {
      finalQuery: finalQuery,
      result: docData[0].result,
      length: docData[0].result.length,
      fullcount: fullcount,
    };
    return res.send(data);
  };

  router.delete_agency = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("id", "Invalid ID").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const docData = await db.GetOneDoc(
      "agencies",
      { _id: req.body.id },
      {},
      {}
    );
    const agency = {
      id: docData._id,
      username: docData.username,
      email: docData.email,
      password: docData.password,
      name: docData.name,
      gender: docData.gender,
      language: docData.language,
      phone: docData.phone,
      agency_name: docData.agency_name,
      agency_logo: docData.agency_logo,
      login_date: moment().format("YYYY/MM/DD"),
      address: docData.address,
      dateofbirth: docData.dateofbirth,
      tempstatus: 5,
      status: 1,
      actions: docData.actions,
    };

    const updateDoc = await db.UpdateDoc(
      "agencies",
      { _id: req.body.id },
      agency,
      {
        upsert: true,
      }
    );

    if (!updateDoc) {
      return res.json({
        status: 0,
        response: "Agency not added to deleted list!",
      });
    }
    if (updateDoc) {
      return res.json({
        status: 1,
        response: "Agency moved to Trash!!",
      });
    }
  };

  router.deleted_agency_list = async (req, res) => {
    let data = {};
    data.status = 0;
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const userQuery = [];

    userQuery.push({ $match: { tempstatus: { $eq: 5 } } });

    if (req.body.search) {
      const searchs = req.body.search;
      if (req.body.filter === "all") {
        userQuery.push({
          $match: {
            $or: [
              { name: { $regex: searchs + ".*", $options: "si" } },
              { username: { $regex: searchs + ".*", $options: "si" } },
              { email: { $regex: searchs + ".*", $options: "si" } },
              { agency_name: { $regex: searchs + ".*", $options: "si" } },
              { phone: { $regex: searchs + ".*", $options: "si" } },
              { "phone.code": { $regex: searchs + ".*", $options: "si" } },
              { "phone.number": { $regex: searchs + ".*", $options: "si" } },
              { "address.state": { $regex: searchs + ".*", $options: "si" } },
              { "address.country": { $regex: searchs + ".*", $options: "si" } },
            ],
          },
        });
      } else {
        const searching = {};
        searching[req.body.filter] = { $regex: searchs + ".*", $options: "si" };
        userQuery.push({ $match: searching });
      }
    }

    const withoutlimit = Object.assign([], userQuery);
    withoutlimit.push({ $count: "count" });

    if (req.body.skip >= 0) {
      userQuery.push({ $skip: parseInt(req.body.skip) });
    }

    if (req.body.limit >= 0) {
      userQuery.push({ $limit: parseInt(req.body.limit) });
    }

    if (req.body.field && req.body.order) {
      const sorting = {};
      sorting[req.body.field] = parseInt(req.body.order);
      userQuery.push({ $sort: sorting });
    } else {
      userQuery.push({ $sort: { createdAt: -1 } });
    }

    const finalQuery = [
      {
        $facet: {
          overall: withoutlimit,
          result: userQuery,
        },
      },
    ];

    let docData = await db.GetAggregationDoc("agencies", finalQuery);
    data.status = 1;
    let fullcount;
    if (docData[0].overall[0] && docData[0].overall[0].count) {
      fullcount = docData[0].overall[0].count;
    } else {
      fullcount = docData[0].result.length;
    }
    data.response = {
      finalQuery: finalQuery,
      result: docData[0].result,
      length: docData[0].result.length,
      fullcount: fullcount,
    };
    return res.send(data);
  };

  router.archive_agency = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("id", "Invalid ID").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const docData = await db.GetOneDoc(
      "agencies",
      { _id: req.body.id },
      {},
      {}
    );
    const agency = {
      id: docData._id,
      username: docData.username,
      email: docData.email,
      password: docData.password,
      name: docData.name,
      gender: docData.gender,
      language: docData.language,
      phone: docData.phone,
      agency_name: docData.agency_name,
      agency_logo: docData.agency_logo,
      address: docData.address,
      dateofbirth: docData.dateofbirth,
      tempstatus: 3,
      status: 1,
      actions: docData.actions,
    };

    const updateDoc = await db.UpdateDoc(
      "agencies",
      { _id: req.body.id },
      agency,
      {
        upsert: true,
      }
    );
    if (!updateDoc) {
      return res.json({
        status: 0,
        response: "Agency not added to Archive list!",
      });
    }
    if (updateDoc) {
      return res.json({
        status: 1,
        response: "Agency Archived!!",
      });
    }
  };

  router.archive_agency_list = async (req, res) => {
    let data = {};
    data.status = 0;
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const userQuery = [];

    userQuery.push({ $match: { tempstatus: { $eq: 3 } } });

    if (req.body.search) {
      const searchs = req.body.search;
      if (req.body.filter === "all") {
        userQuery.push({
          $match: {
            $or: [
              { name: { $regex: searchs + ".*", $options: "si" } },
              { username: { $regex: searchs + ".*", $options: "si" } },
              { email: { $regex: searchs + ".*", $options: "si" } },
              { agency_name: { $regex: searchs + ".*", $options: "si" } },
              { phone: { $regex: searchs + ".*", $options: "si" } },
              { "phone.code": { $regex: searchs + ".*", $options: "si" } },
              { "phone.number": { $regex: searchs + ".*", $options: "si" } },
              { "address.state": { $regex: searchs + ".*", $options: "si" } },
              { "address.country": { $regex: searchs + ".*", $options: "si" } },
            ],
          },
        });
      } else {
        const searching = {};
        searching[req.body.filter] = { $regex: searchs + ".*", $options: "si" };
        userQuery.push({ $match: searching });
      }
    }

    const withoutlimit = Object.assign([], userQuery);
    withoutlimit.push({ $count: "count" });

    if (req.body.skip >= 0) {
      userQuery.push({ $skip: parseInt(req.body.skip) });
    }

    if (req.body.limit >= 0) {
      userQuery.push({ $limit: parseInt(req.body.limit) });
    }

    if (req.body.field && req.body.order) {
      const sorting = {};
      sorting[req.body.field] = parseInt(req.body.order);
      userQuery.push({ $sort: sorting });
    } else {
      userQuery.push({ $sort: { createdAt: -1 } });
    }

    const finalQuery = [
      {
        $facet: {
          overall: withoutlimit,
          result: userQuery,
        },
      },
    ];

    let docData = await db.GetAggregationDoc("agencies", finalQuery);
    data.status = 1;
    let fullcount;
    if (docData[0].overall[0] && docData[0].overall[0].count) {
      fullcount = docData[0].overall[0].count;
    } else {
      fullcount = docData[0].result.length;
    }
    data.response = {
      finalQuery: finalQuery,
      result: docData[0].result,
      length: docData[0].result.length,
      fullcount: fullcount,
    };
    return res.send(data);
  };

  router.permenent_delete = async (req, res) => {
    const data = {};
    data.status = 0;
    req.checkBody("id", "Invalid ID").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const docData = await db.DeleteDocs("agencies", { _id: req.body.id });
    if (!docData) {
      res.json({
        status: 0,
        response: "Can't Delete this agency",
      });
    } else {
      res.json({
        status: 1,
        response: "agency deleted!!",
      });
    }
  };

  router.agency_restore = async (req, res) => {
    const data = {};
    data.status = 0;
    req.checkBody("id", "Invalid ID").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    let docData = await db.findOneandUpdateDoc(
      "agencies",
      { _id: req.body.id },
      { tempstatus: 1 },
      {}
    );
    docData
      ? res.json({ status: 1, response: "Agency Restored!!" })
      : res.json({ status: 0, response: "Some Error Occure!!" });
  };

  router.image_preview = async (req, res) => {
    const data = {};
    data.status = 0;
    req.checkBody("id", "Invalid ID").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    const docData = await db.GetOneDoc(
      "agencies",
      { _id: req.body.id },
      { agency_logo: 1 },
      {}
    );
    if (!docData) {
      res.json({
        status: 0,
        response: "Image Not Found!!",
      });
    }
    if (docData) {
      res.json({
        status: 1,
        response: docData,
      });
    }
  };

  return router;
};
