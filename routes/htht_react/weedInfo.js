var express = require("express");
var router = express.Router();
var mssqldb = require("../../utils/mssqldb");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let param = req.query || req.params;
  let id = param.id;
  mssqldb.sql(
    `SELECT *
    FROM [dbo].[WEED_INFO]
    WHERE Species_ID=${id};`,
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }

      let response = {
        status: 200,
        message: "success",
        data: result.recordset[0],
      };
      return res.send(response);
      return next();
    }
  );
});

module.exports = router;
