const multer = require("multer");

function fileUploader(req, res, next) {
  var imageName;

  var uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/Employee");
    },
    filename: function (req, file, cb) {
      imageName =
        file.originalname.split(".")[0].replace(" ", "") +
        Date.now() +
        "." +
        file.originalname.split(".")[1];

      cb(null, imageName);
    },
  });

  var upload = multer({ storage: uploadStorage });

  var uploadFile = upload.single("photo");

  uploadFile(req, res, function (err) {
    req.imageName = imageName;
    req.uploadError = err;
    console.log(err, "ERROR IN FILE UPLOAD");
    next();
  });
}

module.exports = fileUploader;
