const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  phone: { code: String, number: String },
  worklocation: String,
  agencyid: String,
  adminid: String,
  employee_status: Boolean,
  job_role: String,
  status: Number,
});

const employees = mongoose.model("employees", employeeSchema, "employees");
module.exports = employees;
