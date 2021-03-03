const http = require("http");
const async = require("async");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const CONFIG = require("../config/config");

function randomString(length, chars) {
  let mask = "";
  if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
  if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (chars.indexOf("#") > -1) mask += "0123456789";
  if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  let result = "";
  for (let i = length; i > 0; --i)
    result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}

function base64Upload(data, callback) {
  fs.writeFile(data.file, data.base64, { encoding: "base64" }, function (err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { status: 1, image: data.file });
    }
  });
}

function timeDifference(a, b) {
  let timediff = {};
  const jobTime = "";
  if (a.diff(b, "years") != 0) {
    timediff = { type: "years", value: a.diff(b, "years") };
  } else if (a.diff(b, "months") != 0) {
    timediff = { type: "months", value: a.diff(b, "months") };
  } else if (a.diff(b, "days") != 0) {
    timediff = { type: "days", value: a.diff(b, "days") };
  } else if (a.diff(b, "minutes") != 0) {
    timediff = { type: "minutes", value: a.diff(b, "minutes") };
  } else {
    timediff = { type: "seconds", value: a.diff(b, "seconds") };
  }
  let timeWord;
  if (timediff.value > 0) {
    timeWord = timediff.value + " " + timediff.type + " later";
  } else {
    timeWord = Math.abs(timediff.value) + " " + timediff.type + " ago";
  }
  return timeWord;
}

function inArray(search, array) {
  const length = array.length;
  for (let i = 0; i < length; i++) {
    if (array[i] == search) return true;
  }
  return false;
}

function exchangeRates(from, to, callback) {
  async.parallel(
    {
      google: function (callback) {
        http.get(
          {
            protocol: "http:",
            host: "www.google.com",
            path: "/finance/converter?a=1&from=" + from + "&to=" + to,
          },
          function (response) {
            let body = "";
            response.on("data", function (d) {
              body += d;
            });
            response
              .on("end", function () {
                const conversion = body.match(/<span class=bld>(.*)<\/span>/);
                const rate = conversion[1].replace(/[^0-9.]/g, "");
                callback(null, rate);
              })
              .on("error", function (error) {
                callback(error, null);
              });
          }
        );
      },
      yahoo: function (callback) {
        http.get(
          {
            protocol: "http:",
            host: "download.finance.yahoo.com",
            path: "/d/quotes.csv?s=" + from + to + "=X&f=l1",
          },
          function (response) {
            let body = "";
            response.on("data", function (d) {
              body += d;
            });
            response
              .on("end", function () {
                const rate = body.replace(/[^0-9.]/g, "");
                callback(null, rate);
              })
              .on("error", function (error) {
                callback(error, null);
              });
          }
        );
      },
    },
    function (err, result) {
      callback(err, result);
    }
  );
}

String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function jwtSign(payload) {
  return jwt.sign(payload, CONFIG.SECRET_KEY, { expiresIn: 60 });
}
function ActjwtSign(payload) {
  return jwt.sign(payload, CONFIG.SECRET_KEY, { expiresIn: 40 });
}

function validPassword(password, passwordb) {
  return bcrypt.compareSync(password, passwordb);
}

module.exports = {
  randomString: randomString,
  base64Upload: base64Upload,
  timeDifference: timeDifference,
  inArray: inArray,
  exchangeRates: exchangeRates,
  jwtSign: jwtSign,
  ActjwtSign: ActjwtSign,
  validPassword: validPassword,
};
