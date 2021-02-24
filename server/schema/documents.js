var mongoose = require("mongoose");
var documentSchema = mongoose.Schema(
  {
    agency_id: String,
    avatar: [
      {
        avatar_url: String,
      },
    ],
  },
  {
    timestamps: true,
    versionkey: false,
  }
);

const documents = mongoose.model("documents", documentSchema, "documents");
module.exports = documents;
