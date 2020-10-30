var express = require("express");
var router = express.Router();
var mssqldb = require("../../utils/mssqldb");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let param = req.query || req.params;
  let start = (param.page - 1) * 12;
  let end = param.page * 12;
  // var start = (param.page);
  mssqldb.sql("select * from WEEDS_INFO", function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    let response = {
      status: 200,
      message: "success",
      data: result.recordsets[0].slice(start, end),
      totalPage: Math.ceil(result.recordsets[0].length / 12),
      count: result.recordsets[0].length,
    };
    return res.send(response);
    return next();
  });
});

module.exports = router;
