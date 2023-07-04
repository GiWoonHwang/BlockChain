var express = require("express");
var router = express.Router(); 

// 홈페이지
router.get('/',(req, res)=>{
    try{
        res.render('home') 
    }
    catch(err){
        res.render("error",{
            title : "메인 홈페이지 오류 ",
            info : err,
        })
    }
});


// 라우터를 모듈화
module.exports= router;