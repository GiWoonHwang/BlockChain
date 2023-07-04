//DB에 저장된 DID제공 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var address = req.body.address
    mysql.query('SELECT * FROM toilet WHERE address= ? ',
    [address],
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
            console.log("화장실위치 제공 서버 오류")
        }
    });
});
// 라우터를 모듈화
module.exports= router;