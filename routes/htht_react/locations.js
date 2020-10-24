var express = require("express");
var router = express.Router();
var mssqldb = require("../../utils/mssqldb");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let param = req.query || req.params;
  console.log(param);
  let lat = param.lat;
  let lon = param.lon;
  mssqldb.sql(
    `SELECT TOP 20 l.*,(  
    6371 * acos (  
      cos ( radians(${Number(lat)}) )  
      * cos( radians( l.Latitude) )  
      * cos( radians( l.Longitude) - radians(${Number(lon)}) )  
      + sin ( radians(${Number(lat)}) )  
      * sin( radians( l.Latitude ) )
　　　　 )
　　 ) AS Distance,i.[IMAGE]
      FROM [dbo].[WEED_LOCATION] as l INNER JOIN [dbo].[WEED_INFO] as i
      ON l.Species_ID=i.Species_ID
    ORDER BY Distance`,
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
