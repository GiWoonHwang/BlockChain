// 화장실 위치정보 가져오기
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var location = req.body.location
    mysql.query('SELECT * FROM toilet WHERE NO = ?;',
    [location],
    function(error, result){
        //정상검색
        if(!error){
            if(result[0]){
                res.json({ message: result}) //클라이언트로 전달
            }else if(result[0]==undefined){
                res.json({ message: false}) //클라이언트로 전달
            }
        }
        //검색실패
        else{
            console.log("화장실위치 오류")
        }
    });
});
// 라우터를 모듈화
module.exports= router;
