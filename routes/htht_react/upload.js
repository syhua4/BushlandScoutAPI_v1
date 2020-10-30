var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var mssqldb = require("../../utils/mssqldb");

router.use("/", function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.maxFieldsSize = 10 * 1024 * 1024 * 1024;
  form.maxFileSize = 10 * 1024 * 1024;
  form.parse(req, function (error, fields, files) {
  let weed = fields.weed.split("-");
  let pat = "Paterson''s curse";  
  mssqldb.sql(
      `INSERT INTO WEED_LOCATION ([Species_Id], [Common_Name], [Latitude], [Longitude], [Datetime], [Suburb], [Postcode], [Verified], [Reporter]) 
          VALUES(${Number(weed[0])},
	  '${weed[0] == 25 ? pat : weed[1]}',           
	  ${Number(fields.latitude)}, 
          ${Number(fields.longitude)}, 
          ${Number(fields.date)}, 
          '${fields.suburb.toUpperCase()}', 
          ${Number(fields.postcode)}, 
          ${Number(fields.verified)},
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

module.exports = router;

