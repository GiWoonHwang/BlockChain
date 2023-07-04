//대전 화장실 정보 DB에 자동 입력시킴(한번만 실행하셈!!!)
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');
var qs = require('querystring');

//화장실 DB에정보저장
var dbinsert = async(type, name, address, phone, latitude, longitude)=>{

    try{    
    // var encodedStr = qs.escape(address);
    // var location = await axios.get("https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address="+encodedStr+"&refine=true&simple=false&format=json&type=road&key=D9FDF9BF-9380-3252-A752-AA7F82731DE3"); 
    // var latitude = await location.data.response.result.point.y;
    // var longitude =  await location.data.response.result.point.x;
    mysql.query('SELECT * FROM toilet WHERE name= ?',
    [name],
    async function(error, result){
        //저장된 값이 아니여야하며, 주소가 존재해야함
        if(result[0]==undefined&&address){
            mysql.query('INSERT INTO toilet(type,name,address,phone,latitude,longitude) VALUES(?,?,?,?,?,?)',
            [type, name, address, phone, latitude, longitude],
            function(error, result){
                //DB등록 완료
                if(!error){
                    console.log("위치 저장 성공")
                }
                //DB등록 실패
                else{
                    console.log("위치 저장 실패")
                }
            });
            
        }
    })
    }catch{
        console.log("좌표값이없음")
    }
}

router.get('/',(req, res)=>{
        (async()=>{ //async 함수의 실행을 일시 중지하고 화장실 정보 API를 가져오길 기다린 다음 async 함수의 실행을 다시 시작하고 완료후 값을 반환
            var page=0;
            while(1){
                console.log("page: "+page)
                try{
                    var data= await axios.get("http://api.data.go.kr/openapi/tn_pubr_public_toilet_api?ServiceKey=OlDGkmbp8C%2Bztten1nGiHbPFDPNcnYLYqAHJonB%2BQjdwhfJaaE2Mj8TsA9R%2BDgz5D8bYR9VOR%2BRaZtf0iZPkhg%3D%3D&pageNo="+page+"&numOfRows=100&type=json&instt_code=6300000"); 
                    var data2=await axios.get("http://api.data.go.kr/openapi/tn_pubr_public_toilet_api?ServiceKey=OlDGkmbp8C%2Bztten1nGiHbPFDPNcnYLYqAHJonB%2BQjdwhfJaaE2Mj8TsA9R%2BDgz5D8bYR9VOR%2BRaZtf0iZPkhg%3D%3D&pageNo="+page+"&numOfRows=100&type=json&instt_code=3680000");
                    var item =await data.data.response.body.items //페이지당 여러 화장실의 정보 
                    var item2=await data2.data.response.body.items //
                    page=page+1;
                }catch{
                    console.log("검색종료")
                    break;
                }
                if(data.data.response.body==undefined && data2.data.response.body== undefined){
                    console.log("검색종료")
                    break;
                }else if(data.data.response.body){
                    //모든 화장실의 정보만큼 반복
                    (async()=>{    

                        for(var i=0; i<item.length; i++){
                        var type = await item[i].toiletType     //화장실 타입
                        var address =await item[i].rdnmadr      //화장실주소
                        var phone =await item[i].phoneNumber    //화장실주소
                        var name =await item[i].toiletNm        //화장실이름
                        var latitude = item[i].latitude
                        var longitude = item[i].longitude
                        //화장실 DB에정보저장
                        await dbinsert(type, name, address, phone, latitude, longitude)
                        }

                        for(var i=0; i<item2.length; i++){
                            var _type = await item2[i].toiletType     //화장실 타입
                            var _address =await item2[i].rdnmadr      //화장실주소
                            var _phone =await item2[i].phoneNumber    //화장실주소
                            var _name =await item2[i].toiletNm        //화장실이름
                            var _latitude = item2[i].latitude
                            var _longitude = item2[i].longitude
                            //화장실 DB에정보저장
                            await dbinsert(_type, _name, _address, _phone, _latitude, _longitude)
                            }

                    })()

                }
            }
            
        })();
});

module.exports= router;