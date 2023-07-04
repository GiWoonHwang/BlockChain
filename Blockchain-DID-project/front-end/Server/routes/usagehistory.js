//사용자 이용내역 조회
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var email = req.body.email;
    mysql.query('SELECT scanner.no as scannerNumber, state, reviewstate, toilet.no, useremail,DATE, name, address FROM scanner INNER JOIN toilet On scanner.location = toilet.no WHERE useremail = ? ORDER BY DATE desc;',
    [email],
    function(error, result){
        //검색 실패
        if(!error){
            //이용내역이 존재 하지 않을경우
            if(result[0]==undefined){
                 res.json({ message: false}) //클라이언트로 전달
            }
            //이용내역이 존재 하는경우
            else if(result){
                res.json({ message: result}) //클라이언트로 전달
            }
        }
        //검색 실패
        else{
            res.json({ message: false}) //클라이언트로 전달
            console.log("사용자이용내역 서버오류")
        }
    });
});

// 라우터를 모듈화
module.exports= router;