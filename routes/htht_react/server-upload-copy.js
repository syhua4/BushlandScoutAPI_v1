var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var fs = require("fs");
var exec = require("child_process").exec;
var cryptoRandomString = require("crypto-random-string");
var mssqldb = require("../../utils/mssqldb");

router.use("/", function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.maxFieldsSize = 10 * 1024 * 1024 * 1024;
  form.maxFileSize = 10 * 1024 * 1024;
  form.encoding = "utf-8";
  console.log("about to parse 1.. 2.. 3..");
  form.parse(req, function (error, fields, files) {
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
    child.stdout.on("data", function (data) {
      scanResult = data.toString();
    });

    child.on("exit", function () {
      console.log(fields);
      console.log("---------------------");
      let weed = fields.weed.split("-");
      let verified = 0;
      console.log(scanResult.toLowerCase(), weed[1].toLowerCase());
      if (
        scanResult.toLowerCase().trim() == weed[1].toLowerCase().trim()
      ) {
        verified = 1;
      }
      console.log("scan R", scanResult);
      mssqldb.sql(
        `INSERT INTO WEED_LOCATION ([Species_Id], [Common_Name], [Latitude], [Longitude], [Datetime], [Suburb], [Postcode], [Verified], [Reporter])
          VALUES(${Number(weed[0])}, '${weed[1]}',
          ${Number(fields.latitude)},
          ${Number(fields.longitude)},
          ${Number(fields.date)},
          '${fields.suburb}',
          ${fields.postcode},
          ${Number(verified)},
          '${fields.name}')`,
        function (err, result) {
          let response;
          if (err) {
            response = {
              status: 400,
              message: err,
            };
          } else {
            response = {
              status: 200,
              message: "success",
            };
          }
          return res.send(response);
        }
      );
    });
  });
});

module.exports = router;
