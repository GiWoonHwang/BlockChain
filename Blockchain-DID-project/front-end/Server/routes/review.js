//사용자 정보 홈화면에전달하는 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var toiletnumber = req.body.toiletnumber;
    var typeNum = req.body.typeNum;
    var ratings = req.body.ratings;
    //최신순
    if(typeNum ==1){
        var query = "SELECT * FROM review WHERE toiletnumber= ? ORDER BY DATE DESC"
    }
    //별점 높은순
    if(typeNum ==2){
        var query = "SELECT * FROM review WHERE toiletnumber=? ORDER BY ratings DESC"
    }
    //별점 낮은순
    if(typeNum ==3){
        var query = "SELECT * FROM review WHERE toiletnumber=? ORDER BY ratings "
    }
    if(ratings){
        var query = "SELECT COUNT(ratings) AS count FROM review WHERE toiletnumber= ? AND ratings= ?  " 
    }

    mysql.query(query,
    [toiletnumber, ratings],
    function(error, result){
        //검색 실패
        if(!error){
            //이메일이 없으면
            if(result[0]){
              res.json({ message: result}) //클라이언트로 전달
            }
            //이메일이 있으면
            else if(result[0]== undefined){
                res.json({ message: false}) //클라이언트로 전달
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