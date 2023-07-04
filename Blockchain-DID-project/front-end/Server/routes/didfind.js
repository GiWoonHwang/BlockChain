//DB에 저장된 DID제공 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var email =req.body.email;
    //입력한 이메일이 존재하는지 확인
    mysql.query('SELECT * FROM signup WHERE email = ? ',
    [email],
    function(error, result){
        //정상검색
        if(!error){
            //검색결과가 없는경우
            if(result[0] ==undefined){
                res.json({ message: false}) //클라이언트로 전달
            }
            //검색결과가 있는경우
            else if(result[0].email == email){
                res.json({ message: result[0].did}) //클라이언트로 전달
            }
        }
        //검색실패
        else{
            res.json({ message: false}) //클라이언트로 전달
            console.log("DID 제공 서버오류")
        }
    });
});
// 라우터를 모듈화
module.exports= router;