var express = require("express");
var router = express.Router();
var mssqldb = require("../../utils/mssqldb");

/* GET users listing. */
router.get("/", function (req, res, next) {
  var arr = [];
  mssqldb.sql("select * from ANIMAL_INFO", function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    let response = {
      status: 200,
      message: "success",
      returnValue: result.returnValue,
      data: result.recordsets[0],
    };
    return res.send(response);
    return next();
  });
});

module.exports = router;
