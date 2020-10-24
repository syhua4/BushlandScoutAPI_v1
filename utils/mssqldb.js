/* 链接sql数据库 */
var mssql = require("mssql");
var mssqldb = {};
var config = {
  user: "mp27",
  password: "Zz2!Xx2!",
  server: "bushland-scouts.database.windows.net",
  port: 1433,
  driver: "msnodesql",
  database: "bushland-scouts",
  options: {
    encrypt: true,
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 3000,
  },
};
// 数据库封装
mssqldb.sql = function (sql, callBack) {
  var connection = new mssql.ConnectionPool(config, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    var ps = new mssql.PreparedStatement(connection);
    ps.prepare(sql, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      ps.execute("", function (err, result) {
        if (err) {
          console.log(err);
          return;
        }

        ps.unprepare(function (err) {
          if (err) {
            console.log(err);
            callback(err, null);
            return;
          }
          callBack(err, result);
        });
      });
    });
  });
};

module.exports = mssqldb;
