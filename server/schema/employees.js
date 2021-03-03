const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  mobile_number: String,
  worklocation: String,
  agencyid: String,
  adminId: String,
  employee_status: Number,
  status: Number,
});

const employees = mongoose.model("employees", employeeSchema, "employees");
module.exports = employees;
