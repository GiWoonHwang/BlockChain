//휴대폰인증 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var phone =req.body.phone;
    //입력한 이메일이 존재하는지 확인
    mysql.query('SELECT * FROM signup WHERE phone= ?',
    [phone],
    function(error, result){
        //정상검색
        if(!error){
            if(result[0] ==undefined){
                res.json({ message: true}) //클라이언트로 전달
            }
            // 입력한 이름의 정보가 존재하는 경우
            else if(result[0].phone == phone){
                res.json({ message: false}) //클라이언트로 전달
            }
        }
        //검색실패
        else{
            res.json({ message: false}) //클라이언트로 전달
            console.log("휴대폰인증 서버오류")
        }
    });
});
// 라우터를 모듈화
module.exports= router;