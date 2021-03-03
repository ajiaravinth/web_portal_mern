module.exports = (io) => {
  const moment = require("moment"),
    db = require("../model/mongodb.js"),
    CronJob = require("cron").CronJob,
    event = require("../controller/events/common"),
    each = require("sync-each"),
    mongoose = require("mongoose");
  const _ = require("lodash");

  const reminder = new CronJob({
    cronTime: "*/1 * * * *",
    onTick: async () => {
      try {
        const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        // const endTime = moment(new Date()).format("YYYY-MM-DD");
        let getDoc = await db.GetDocs(
          "reminders",
          {
            $or: [{ reminder_status: 1, start: { $gte: time } }],
          },
          {},
          {}
        );
        if (getDoc && Array.isArray(getDoc) && getDoc.length > 0) {
          each(getDoc, async (item, cb) => {
            if (item && item._id) {
              let compareDate = moment(new Date(item.start)).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              if (String(compareDate) === String(time)) {
                let updata = {
                  status: 1,
                  reminder_status: 6,
                  snooze_status: item.snooze_status,
                  start: item.start,
                  reminder: item.start,
                  description: item.description,
                };
                let updateData = await db.UpdateDoc(
                  "reminders",
                  { _id: item._id },
                  updata,
                  {
                    upsert: true,
                  }
                );
                if (updateData && updateData.nModified === 1) {
                  let docData = await db.GetOneDoc(
                    "reminders",
                    { _id: item._id },
                    {},
                    {}
                  );
                  console.log(docData, "asasdasd");
                  if (docData) {
                    io.emit("reminder", {
                      docData,
                    });
                  }
                }
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

  const reminder_pospand = new CronJob({
    cronTime: "*/1 * * * *",
    onTick: async () => {
      try {
        const startTime = moment(new Date()).format("YYYY-MM-DD 00:00:00");
        const endTime = moment(new Date()).format("YYYY-MM-DD 23:59:59");
        let getDoc = await db.GetDocs(
          "reminders",
          {
            $or: [
              { snooze_status: 4, start: { $gte: startTime, $lte: endTime } },
            ],
          },
          {},
          {}
        );
        if (getDoc && Array.isArray(getDoc) && getDoc.length > 0) {
          console.log(getDoc, "getDoc");
          each(getDoc, async (item, cb) => {
            if (item && item._id) {
              let compareDate = moment(new Date(item.start)).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              let updata = {
                status: 1,
                reminder_status: 1,
                snooze_status: 7,
                start: item.start,
                reminder: item.start,
                description: item.description,
              };
              let updateData = await db.UpdateDoc(
                "reminders",
                { _id: item._id },
                updata,
                {
                  upsert: true,
                }
              );
              if (updateData && updateData.nModified === 1) {
                let docData = await db.GetOneDoc(
                  "reminders",
                  { _id: item._id },
                  {},
                  {}
                );

                if (docData) {
                  io.emit("reminder", {
                    docData,
                  });
                }
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
  reminder_pospand.start();
};
