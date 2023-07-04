// 이메일찾기
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var phone = req.body.phone;
    mysql.query('SELECT * FROM signup WHERE phone=?',
    [phone],
    function(error, result){
        //검색 실패
        if(!error){
            //검색결과가 없으면
            if(result[0]== undefined){
              res.json({ message: false}) //클라이언트로 전달
            }
            //이메일이 있으면
            else if(result[0].phone == phone){
                res.json({ message: result[0]}) //클라이언트로 전달
            }
        }
        //검색 실패
        else{
            res.json({ message: false}) //클라이언트로 전달
            console.log("유저정보 서버오류")
        }
    });
});

// 라우터를 모듈화
module.exports= router;