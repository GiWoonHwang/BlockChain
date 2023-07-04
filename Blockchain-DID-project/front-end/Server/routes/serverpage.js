var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');

//화장실 DB에정보저장
var dbinsert = async(type, name, address, phone, latitude, longitude)=>{
    try{    
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
                        console.log("저장 성공")
                    }
                    //DB등록 실패
                    else{
                        console.log("저장 실패")
                    }
                });
                
            }
        })
        }catch{
            console.log("좌표값이없음")
        }
}


// 홈페이지
router.get('/',(req, res)=>{
    var query = req.query.list; //쿼리 (http://127.0.0.1:8080/serverpage?list=toilet)
    // var search = req.query.search
    // console.log(query,search)
    try{
        if(query=="user"){
            mysql.query("SELECT * FROM signup WHERE NAME<>'비회원' ORDER BY DATE DESC",
            function(error, result){
                if(!error){
                        res.render("user", { data: result });
                }
            });
        }
        if(query=="scanner"){
            mysql.query("SELECT scanner.NO, useremail, scanner.DATE, address, state  from scanner INNER JOIN toilet ON scanner.location = toilet.NO INNER JOIN signup ON scanner.useremail = signup.email ORDER BY scanner.NO DESC",
            function(error, result){
                if(!error){
                        res.render("scanner", { data: result });
                }
            });
        }
        if(query=="toilet"){
            mysql.query("SELECT * from toilet",
            function(error, result){
                if(!error){
                        res.render("toilet", { data: result });
                }
            });
        }
    }
    catch(err){
        res.render("error",{
            title : "메인 홈페이지 오류 ",
            info : err,
        })
    }
});


router.post('/',(req, res)=>{
    var toilet = req.body.toilet
    var search = req.body.search
    var list = req.body.list
    var date_1 = req.body.date_1
    var date_2 = req.body.date_2
    var signupDate_1 = req.body.signupDate_1
    var signupDate_2 = req.body.signupDate_2

    if(search && list){
        if(list=="scannerEmail"){
            var query = "SELECT scanner.NO, useremail, scanner.DATE, address, state  from scanner INNER JOIN toilet ON scanner.location = toilet.NO INNER JOIN signup ON scanner.useremail = signup.email WHERE useremail =? ORDER BY scanner.NO DESC"
            var page = "scanner"
        }
        else if(list=="scannerAddress"){
            var query = "SELECT scanner.NO, useremail, scanner.DATE, address, state  from scanner INNER JOIN toilet ON scanner.location = toilet.NO INNER JOIN signup ON scanner.useremail = signup.email WHERE address =? ORDER BY scanner.NO DESC"
            var page = "scanner"
        }
        else if(list=="scannerState"){
            var query = "SELECT scanner.NO, useremail, scanner.DATE, address, state  from scanner INNER JOIN toilet ON scanner.location = toilet.NO INNER JOIN signup ON scanner.useremail = signup.email WHERE state =? ORDER BY scanner.NO DESC"
            var page = "scanner"
        }
        else if(list=="userName"){
            var query = "SELECT * FROM signup WHERE NAME = ? ORDER BY DATE DESC"
            var page = "user"
        }
        else if(list=="userEmail"){
            var query = "SELECT * FROM signup WHERE email = ?"
            var page = "user"
        }
        else if(list=="toilettype"){
            var query = "SELECT * FROM toilet WHERE type = ?"
            var page = "toilet"
        }
        else if(list=="toiletName"){
            var query = "SELECT * FROM toilet WHERE name = ?"
            var page = "toilet"
        }
        else if(list=="toiletAdrres"){
            var query = "SELECT * FROM toilet WHERE address = ?"
            var page = "toilet"
        }
        mysql.query(query,
        [search],
        function(error, result){
            if(!error){
                    res.render(page, { data: result });
            }
        });
    }

    if(date_1&&date_2){
        mysql.query("SELECT scanner.NO, useremail, scanner.DATE, address, state from scanner INNER JOIN toilet ON scanner.location = toilet.NO INNER JOIN signup ON scanner.useremail = signup.email WHERE DATE(scanner.DATE) BETWEEN ? AND ? ORDER BY scanner.NO DESC;",
        [date_1,date_2],    
        function(error, result){
                if(!error){
                    res.render("scanner", { data: result });
                }
        });
    }

    if(signupDate_1&&signupDate_2){
        mysql.query("SELECT * FROM signup WHERE DATE(DATE) BETWEEN ? AND ? ORDER BY DATE DESC;",
        [signupDate_1,signupDate_2],    
        function(error, result){
                if(!error){
                    res.render("user", { data: result });
                }
        });
    }


    if(toilet){
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
                //페이지 리로드
                mysql.query("SELECT * from toilet",
                function(error, result){
                    if(!error){
                            res.render("toilet", { data: result });
                    }
                });
                break;
            }
            if(data.data.response.body==undefined && data2.data.response.body== undefined){
                //페이지 리로드
                mysql.query("SELECT * from toilet",
                function(error, result){
                    if(!error){
                            res.render("toilet", { data: result });
                    }
                });
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
    }
});

// 라우터를 모듈화
module.exports= router;