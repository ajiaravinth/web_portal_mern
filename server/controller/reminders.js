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
      reminder_status: 1,
      snooze_status: 1,
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

  router.reminder_notify = async (req, res) => {
    let getAllDoc = await db.GetDocs(
      "reminders",
      { $or: [{ reminder_status: 6 }, { snooze_status: 7 }] },
      {},
      {}
    );
    if (getAllDoc.length === 0) {
      res.json({
        status: 0,
        response: "No data found!!",
      });
    }
    if (getAllDoc.length > 0) {
      res.json({
        status: 1,
        response: "Reminder !!",
      });
    }
  };

  router.reminder_close = async (req, res) => {
    let data = {};
    req.checkBody("id", "Invalid Id").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    let docData = await db.findOneandUpdateDoc(
      "reminders",
      { _id: req.body.id },
      { reminder_status: 1, snooze_status: 1 },
      { new: true }
    );

    if (!docData) {
      res.json({
        status: 0,
        response: "No data Found!!!",
      });
    }
    if (docData) {
      res.json({
        status: 1,
        response: "Reminder Closed",
      });
    }
  };

  router.reminder_snooze = async (req, res) => {
    let data = {};
    req.checkBody("id", "Invalid Id").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }

    let docData = await db.findOneandUpdateDoc(
      "reminders",
      { _id: req.body.id },
      { snooze_status: 4, reminder_status: 1 },
      { new: true }
    );

    if (!docData) {
      res.json({
        status: 0,
        response: "No data Found!!!",
      });
    }
    if (docData) {
      res.json({
        status: 1,
        response: "Reminder Snoozed!!",
      });
    }
  };

  return router;
};
