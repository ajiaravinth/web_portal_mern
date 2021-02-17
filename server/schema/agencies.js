var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const agencySchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      index: { unique: true },
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: { unique: true },
    },
    name: String,
    dateofbirth: String,
    gender: String,
    language: Array,
    actions: Array,
    agency_logo: String,
    agency_name: String,
    password: { type: String, required: true },
    status: Number,
    tempstatus: Number,
    phone: { code: String, number: String, dialcountry: String },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      zipcode: String,
      formated_address: String,
      lat: Number,
      lon: Number,
    },
    activity: {
      last_login: { type: Date, default: Date.now },
      last_logout: { type: Date, default: Date.now },
    },
  },
  { timestamps: true, versionKey: false }
);

const agencies = mongoose.model("agencies", agencySchema, "agencies");
module.exports = agencies;
