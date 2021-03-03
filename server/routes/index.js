var path = require("path");

module.exports = (app, passport, io) => {
  try {
    require("./administrators")(app, io);
    require("./agencies")(app, io);
    require("./employees")(app, io);
    require("./documents")(app, io);
    require("./reminders")(app, io);

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });
  } catch (error) {
    console.log("Error in router", error);
  }
};
