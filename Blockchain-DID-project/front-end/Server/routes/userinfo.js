//사용자 정보 홈화면에전달하는 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var email = req.body.email;
    mysql.query('SELECT * FROM signup WHERE email=?',
    [email],
    function(error, result){
        //검색 실패
        if(!error){
            //이메일이 없으면
            if(result[0]== undefined){
              res.json({ message: false}) //클라이언트로 전달
            }
            //이메일이 있으면
            else if(result[0].email == email){
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