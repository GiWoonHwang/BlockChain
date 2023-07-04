//DB에 저장된 DID제공 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");


router.post('/',(req, res)=>{
    var arrylet = []
    var arrylong = []
    var arryname =[]
    var arryaddress=[]
    mysql.query('SELECT * FROM toilet',
    function(error, result){
        //정상검색
        if(!error){
            for(var i=0; i<result.length; i++){
                arrylet.push(result[i].latitude) //화장실 위도 
                arrylong.push(result[i].longitude) //화장실 경도 
                arryname.push(result[i].name) //화장실 이름
                arryaddress.push(result[i].address) //화장실 주소
            }
            res.json({let:arrylet, long:arrylong, name: arryname, address : arryaddress})
        }
        //검색실패
        else{
            console.log("화장실위치 제공 서버 오류")
        }
    });
});
// 라우터를 모듈화
module.exports= router;