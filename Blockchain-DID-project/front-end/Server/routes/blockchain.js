//사용자에게 did 제공
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios')

router.post('/',(req, res)=>{
    var name =req.body.name
    var email =req.body.email
    var gender =req.body.gender
    var phone =req.body.phone 
    var password =req.body.password
    var id =req.body.id 
    var did =req.body.did
    var qr =req.body.qr
    //VP 발급
    if(id && did){
        setTimeout(() => {
            res.json({ message:"abcdefghijklmnop"}) //클라이언트로 전달
        }, 4000)
    }
});

module.exports= router;