const db = require("../model/mongodb");
module.exports = () => {
  const router = {};

  router.set_reminder = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("start", "Start Date is Required!").notEmpty();
    req.checkBody("description", "Description is Required!").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    const reminder = {
      status: 1,
      start: req.body.start,
      reminder: req.body.start,
      description: req.body.description,
    };

    let docData = await db.InsertDocs("reminders", reminder);
    if (!docData) {
      res.json({
        status: 0,
        response: "Task Not Added!!",
      });
    }

    if (docData) {
      res.json({
        status: 1,
        response: "Task Added!!",
      });
    }
  };

  return router;
};
