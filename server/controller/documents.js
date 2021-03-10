const attachment = require("../model/attachments"),
  db = require("../model/mongodb"),
  fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

module.exports = () => {
  const router = {};

  router.upload_document = async (req, res) => {
    let data = {};
    data.status = 0;
    let document = {};
    if (req.files.avatar.length > 0) {
      document.avatar_url = attachment.get_attachment(
        req.files.avatar[0].destination,
        req.files.avatar[0].filename
      );
    }
    if (document.avatar !== "") {
      res.json({
        status: 1,
        response: document,
      });
    }
  };

  router.save_uploads = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("avatar", "Please Select File!").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    let document = {
      agency_id: req.body.agencyId,
      avatar: req.body.avatar,
    };
    await db.DeleteDocs("documents", {
      agency_id: req.body.agencyId,
    });
    let docData = await db.InsertDocs("documents", document);
    if (!docData) {
      res.json({
        status: 0,
        response: "Nothing To Upload",
      });
    }
    if (docData) {
      res.json({
        status: 1,
        response: docData,
      });
    }
  };

  router.get_all_doc = async (req, res) => {
    let data = {};
    data.status = 0;
    req.checkBody("id", "Invalid Id!").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      data.response = errors[0].msg;
      return res.send(data);
    }
    let docData = await db.GetDocs(
      "documents",
      { agency_id: req.body.id },
      {},
      {}
    );
    if (docData.length === 0) {
      res.json({
        status: 0,
        response: "No Document Found",
      });
    }
    if (docData.length > 0) {
      res.json({
        status: 1,
        response: docData,
      });
    }
  };

  router.document_delete = async (req, res) => {
    let get_doc = await db.GetOneDoc(
      "documents",
      { agency_id: req.body.id },
      {},
      {}
    );
    if (get_doc && get_doc.avatar.length > 0) {
      let delete_document = get_doc.avatar.filter((item) => {
        if (String(item._id) === String(req.body.doc_id)) return item;
      });
      let update = await db.UpdateDoc(
        "documents",
        { agency_id: req.body.id },
        { $pull: { avatar: { _id: req.body.doc_id } } },
        {}
      );
      if (!update) {
        res.json({
          status: 0,
          response: "Unable to delete your file",
        });
      }
      if (update) {
        if (delete_document && delete_document.length > 0) {
          unlinkAsync(delete_document[0].avatar_url);
        } else {
          res.json({ status: 0, response: "Unable to delete your file" });
        }
        res.json({
          status: 1,
          response: "File Deleted",
        });
      }
    } else {
      res.json({
        status: 0,
        response: "Unable to delete your file",
      });
    }
  };

  return router;
};
