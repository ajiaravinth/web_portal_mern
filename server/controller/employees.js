const db = require("../model/mongodb");
module.exports = () => {
  let router = {};
  router.get_all = async (req, res) => {
    let allDoc = await db.GetDocs(
      "agencies",
      { status: 1 },
      { username: 1 },
      {}
    );
    if (allDoc.length === 0) {
      res.json({
        status: 0,
        response: "No data found!!",
      });
    }

    if (allDoc.length > 0) {
      res.json({
        status: 1,
        response: allDoc,
      });
    }
  };

  router.agency_details = async (req, res) => {
    let oneDoc = await db.GetOneDoc(
      "agencies",
      { username: req.body.username, status: 1 },
      { name: 1, email: 1, phone: 1, username: 1 },
      {}
    );
    if (oneDoc) {
      res.json({
        status: 1,
        response: oneDoc,
      });
    }
    if (!oneDoc) {
      res.json({
        status: 0,
        response: "No Data Found!!",
      });
    }
  };
  return router;
};
