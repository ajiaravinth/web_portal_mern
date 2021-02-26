module.exports = (io) => {
  const moment = require("moment"),
    db = require("../model/mongodb.js"),
    CronJob = require("cron").CronJob,
    event = require("../controller/events/common"),
    each = require("sync-each"),
    mongoose = require("mongoose");
  const _ = require("lodash");

  const reminder = new CronJob({
    cronTime: "*/15 * * * *",
    onTick: async () => {
      try {
        const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let getDoc = await db.GetDocs(
          "reminders",
          {
            $or: [{ status: 1, start: { $gte: time } }],
          },
          {},
          {}
        );
        // console.log(getDoc, "getDoc");
        if (getDoc && Array.isArray(getDoc) && getDoc.length > 0) {
          each(getDoc, async (item, cb) => {
            if (item && item._id) {
              let compareDate = moment(new Date(item.start)).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              if (String(compareDate) === String(time)) {
                let updata = {
                  status: 6,
                  start: item.start,
                  reminder: item.start,
                  description: item.description,
                };
                await db.UpdateDoc("reminders", { _id: item._id }, updata, {
                  upsert: true,
                });
              } else {
                process.nextTick(cb);
              }
            } else {
              process.nextTick(cb);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    start: false,
  });
  reminder.start();
};
