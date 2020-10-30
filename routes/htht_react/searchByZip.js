var express = require("express");
var router = express.Router();
var mssqldb = require("../../utils/mssqldb");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let param = req.query || req.params;
  let zip = param.zip;

  mssqldb.sql(
    `
  SELECT TOP 5 l.Common_name, l.Species_ID,  i.IMAGE,COUNT(*) as Record_num
  From [dbo].[WEED_LOCATION] as l INNER JOIN [dbo].[WEED_INFO] as i
  ON l.Species_ID=i.Species_ID
  WHERE Postcode=${zip} AND Verified=1
  GROUP BY l.Species_ID, l.Common_name, i.IMAGE
  ORDER BY Record_num DESC;

  `,
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      let response = {
        status: 200,
        message: "success",
        data: result.recordset,
      };
      return res.send(response);
      return next();
    }
  );
});

module.exports = router;

