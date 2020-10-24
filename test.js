var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var fs = require("fs");
const exec = require("child_process").spawn;
let child = exec("unbuffer");
var cryptoRandomString = require("crypto-random-string");
var mssqldb = require("../../utils/mssqldb");

router.use("/", function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.maxFieldsSize = 5 * 1024 * 1024;
  form.parse(req, function (error, fields, files) {
    let imgName =
      cryptoRandomString({ length: 16 }) +
      "." +
      files.image.type.split("/")[1];
    fs.writeFileSync(
      `image/${imgName}`,
      fs.readFileSync(files.image.path)
    );
    // let child = exec(
    //   "python /Users/shirley/Desktop/BushlandScouts/bushlandScouts_node/BushlandScoutAPI_v1/routes/htht_react/test.py " +
    //     imgName
    // );
    let child = exec(
      "python /home/ec2-user/project/routes/htht_react/label_image.py " +
        imgName
    );
    let scanResult = "";
    child.stdout.on("data", function (output) {
      scanResult = String(output);
    });
    child.on("exit", function () {
      let weed = fields.weed.split("-");
      let verified = 0;
      if (scanResult.toLowerCase() == weed[1].toLowerCase()) {
        verified = 1;
      }
      mssqldb.sql(
        `INSERT INTO WEED_LOCATION ([Species_Id], [Common_Name], [Latitude], [Longitude], [Datetime], [Suburb], [Postcode], [Verified], [Reporter]) 
          VALUES(${Number(weed[0])}, '${weed[1]}', 
          ${Number(fields.latitude)}, 
          ${Number(fields.longitude)}, 
          ${Number(fields.date)}, 
          '${fields.suburb.toUpperCase()}', 
          ${Number(fields.postcode)}, 
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
