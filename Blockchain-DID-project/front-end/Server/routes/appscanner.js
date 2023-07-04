//로그인 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');
var jwt = require('jsonwebtoken');
require('date-utils');


router.post('/',(req, res)=>{
    var qr =req.body.data               //QR데이터 
    var useremail = req.body.email      //사용자 이메일

    mysql.query('SELECT * FROM toilet WHERE NO= ?',
    [qr],
    function(error, result){
        if(!error){
            if(result[0])
                res.json({message:true,toiletinfo:result[0]}) //인증성공으로 클라이언트에전달
            else if(result[0]==undefined){
                res.json({message:false}) //인증실패로 클라이언트에전달
            }
        }
    });
});
// 라우터를 모듈화
module.exports= router;