let mongoose = require("mongoose");
let reminderSchema = mongoose.Schema(
  {
    status: Number,
    reminder_status: Number,
    snooze_status: Number,
    start: Date,
    // end: Date,
    reminder: Date,
    description: String,
  },
  { timestamps: true, versionKey: false }
);
let reminders = mongoose.model("reminders", reminderSchema, "reminders");
module.exports = reminders;
