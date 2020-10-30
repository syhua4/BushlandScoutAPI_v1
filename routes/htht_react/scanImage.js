var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var fs = require("fs");
const exec = require("child_process").exec;
var cryptoRandomString = require("crypto-random-string");

router.use("/", function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.maxFieldsSize = 10 * 1024 * 1024 * 1024;
  form.maxFileSize = 10 * 1024 * 1024;
  form.encoding = "utf-8";
  form.parse(req, function (error, fields, files) {
    console.log(files);
    let imgName =
      cryptoRandomString({ length: 16 }) +
      "." +
      files.image.type.split("/")[1];
    fs.writeFileSync(
      `/home/ec2-user/project/image/${imgName}`,
      fs.readFileSync(files.image.path)
    );
    let child = exec(
      "python3 /home/ec2-user/project/routes/htht_react/label_image.py " +
        imgName
    );
    let scanResult = "";
    child.stdout.on("data", function (output) {
          scanResult = output.toString();

	});
    child.on("exit", function () {
      let response = {
        status: 200,
        message: scanResult,
      };
      return res.send(response);
    });
  });
});

module.exports = router;
