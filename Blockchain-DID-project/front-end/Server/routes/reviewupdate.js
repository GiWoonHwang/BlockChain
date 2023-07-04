//리뷰작성 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var toiletnumber = req.body.toiletnumber;
    var useremail = req.body.useremail;
    var ratings = req.body.ratings;
    var review = req.body.review;
    var scannerNumber = req.body.scannerNumber

    mysql.query("INSERT INTO review(toiletnumber,useremail,ratings,userreview)VALUE(?,?,?,?);",
    [toiletnumber, useremail, ratings, review],
    function(error, result){
        //검색 실패
        if(!error){
            mysql.query("UPDATE scanner SET reviewstate = true WHERE no = ?;",
            [scannerNumber],
            function(error, result){
                //검색 실패
                if(!error){
                    res.json({ message: true}) //클라이언트로 전달
                }
                //검색 실패
                else{
                    res.json({ message: false}) //클라이언트로 전달
                    console.log("리뷰작성 서버오류")
                }
            });
        }
        //검색 실패
        else{
            res.json({ message: false}) //클라이언트로 전달
            console.log("리뷰작성 서버오류")
        }
    });
});

// 라우터를 모듈화
module.exports= router;