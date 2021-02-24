const multer = require("multer"),
  fs = require("fs");

const commonUpload = (destinationPath) => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, destinationPath);
    },
    filename: (req, file, callback) => {
      const uploadName = file.originalname.split(".");
      const extension = "." + uploadName[uploadName.length - 1];
      const fileName = Date.now().toString();
      fs.readFile(destinationPath + file.originalname, (err, res) => {
        if (!err) {
          callback(null, fileName + extension);
        } else {
          callback(null, fileName + extension);
        }
      });
    },
  });

  //   filename: function (req, file, callback) {
  //     var uploadName = file.originalname.split('.');
  //     var extension = '.' + uploadName[uploadName.length - 1];
  //     var mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //     var result = '';
  //     for (var i = 5; i > 0; --i) result = `${result}${mask[Math.floor(Math.random() * mask.length)]}`;
  //     var fileName = `${result}${Date.now().toString()}`;
  //     fs.readFile(destinationPath + file.originalname, function (err, res) {
  //         if (!err) {
  //             callback(null, fileName + extension);
  //         } else {
  //             callback(null, fileName + extension);
  //         }
  //     });
  // }
  const uploaded = multer({
    storage: storage,
  }); /** ----{limits : {fieldNameSize : 100}}---*/
  return uploaded;
};

module.exports = {
  commonUpload: commonUpload,
};
