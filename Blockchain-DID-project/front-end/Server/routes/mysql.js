var mysql= require("mysql");
// DB 설정정보
var connection = mysql.createConnection({
    user: 'root',
    // host: '52.78.25.173',
    host: 'localhost',
    password : '1234',
    database : 'arto',
    port: "3306",
});

module.exports= connection;