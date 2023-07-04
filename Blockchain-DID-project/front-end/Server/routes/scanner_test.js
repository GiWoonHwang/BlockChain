//로그인 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');
var jwt = require('jsonwebtoken');
require('date-utils');

//블록체인서버로 회원정보 보내기
const Post = async (vp, num, gender)=> {
    await axios.post("http://52.78.25.173:5000/verify1", { 
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        vp: vp,
        gender: gender,
    }).then((res) => {
        //블록체인서버에서 vp값이 맞다고 해줄경우
        if(res.data.message==true){
            mysql.query('UPDATE scanner SET state = "인증 성공" WHERE NO = ? ',
            [num],
            function(error, result){
                if(!error){
                    console.log("인증 성공")
                }
                else{
                    console.log("vp인증 DB저장 오류")
                }
            });
        }
        //블록체인서버에서 vp값이 맞지 않을경우
        else if(res.data.message==false){
            mysql.query('UPDATE scanner SET state = "인증 실패" WHERE NO = ? ',
            [num],
            function(error, result){
                if(!error){
                    console.log("인증 실패")
                }
                else{
                    console.log("vp인증 DB저장 오류")
                }
            });
        }
    })
    .catch((error)=> {
        console.log(error)
        console.log("블록체인 서버 오류")
    })
}

router.post('/',(req, res)=>{
    var qr =req.body.qr                 //QR데이터 
    var useremail = req.body.useremail  //사용자 이메일
    var location = req.body.location     //스캐너 위치
    
    mysql.query('SELECT * FROM signup WHERE email= ? ',
    [useremail],
    async function(error, result){
        //회원정보 정상검색
        if(!error){
            //회원정보가 있을경우
            if(result[0]){
                try {
                    // #1 jtw 열기
                    var did = result[0].did //회원 DID
                    var vpkey = jwt.verify(qr, did); //qr의 jwt를 열어서
                    var number = vpkey.no //jwt안에 No 값
                    var gender = result[0].gender

                    // #2 vp 값 가져오기
                    mysql.query('SELECT * FROM vp WHERE NO = ? AND useremail = ?',
                    [number, useremail],
                    async function(error, result){
                        if(!error){
                            if(result[0]){

                                // #3 블록체인 서버와 통신
                                mysql.query('INSERT INTO scanner(location,useremail,state,reviewstate) VALUES(?,?,?,?);',
                                [location, useremail, "인증실패",false],
                                async function(error, result){
                                    //DB등록 완료
                                    if(!error){
                                        try{
                                            await Post(result[0].did, result.insertId, gender) //블록체인서버로 VP 전송
                                            //Post함수에서 변경된 DB내용을 검색하여 화장실 "OPen"
                                            mysql.query('SELECT * FROM scanner WHERE NO= ? AND state="인증 성공"',
                                            [result.insertId],
                                            function(error, result){
                                                if(!error){
                                                    if(result[0])
                                                        res.json({message:true}) //인증성공으로 클라이언트에전달
                                                    else if(result[0]==undefined){
                                                        res.json({message:false}) //인증실패로 클라이언트에전달
                                                    }
                                                }
                                            });
                                        } 
                                        catch{
                                            res.json({message:false}) //인증실패로 클라이언트에전달
                                        } 
                                    
                                    }
                                    //DB등록 실패
                                    else{
                                        console.log("스캔정보 DB저장 실패")
                                        res.json({message:false});
                                    }
                                });
                            }
                            else if(result[0]==undefined){
                                res.json({message:false}) //인증실패로 클라이언트에전달
                            }
                        }
                        else if(error){
                            res.json({message:false}) //인증실패로 클라이언트에전달
                        }
                    });
                } catch{
                    res.json({message:false}) //인증실패로 클라이언트에전달
                }
            } 
            //회원정보가 없을 경우
            else if(result[0] ==undefined){
                mysql.query('INSERT INTO scanner(location, useremail, state) VALUES(?,?,?);',
                [location, "비회원", "인증 실패" ],
                function(error, result){
                    console.log("ArTo회원이 아닙니다. 스캔 실패")
                    res.json({message:false});
                });
            }
        }
        ////회원정보 검색 실패
        else{
            console.log("스캐너서버 에러")
            res.json({message:false});
        }
    });

    // mysql.query('SELECT * FROM signup WHERE email= ? ',
    // [useremail],
    // function(error, result){
    //     //정상검색
    //     if(!error){
    //         if(result[0]){
    //             mysql.query('INSERT INTO scanner(location,useremail,state,reviewstate) VALUES(?,?,?,?);',
    //             [location, useremail, "인증실패",false],
    //             async function(error, result){
    //                 //DB등록 완료
    //                 if(!error){
    //                     await Post(qr,result.insertId) //블록체인서버로 QR코드 정보 보냄
    //                     //Post함수에서 변경된 DB내용을 검색하여 화장실 "OPen"
    //                     mysql.query('SELECT * FROM scanner WHERE NO= ? AND state="인증 성공"',
    //                     [result.insertId],
    //                     function(error, result){
    //                         if(!error){
    //                             if(result[0])
    //                                 res.json({message:true}) //인증성공으로 클라이언트에전달
    //                             else if(result[0]==undefined){
    //                                 res.json({message:false}) //인증실패로 클라이언트에전달
    //                             }
    //                         }
    //                     });
    //                 }
    //                 //DB등록 실패
    //                 else{
    //                     console.log("스캔정보 DB저장 실패")
    //                     res.json({message:false});
    //                 }
    //             });
    //         } 
    //         //우리 회원의 Email이 아닌경우
    //         else if(result[0] ==undefined){
    //             mysql.query('INSERT INTO scanner(location, useremail, state) VALUES(?,?,?);',
    //             [location, "비회원", "인증 실패" ],
    //             function(error, result){
    //                 console.log("ArTo회원이 아닙니다. 스캔 실패")
    //                 res.json({message:false});
    //             });
    //         }
    //     }
    //     //검색실패
    //     else{
    //         console.log("스캐너서버 에러")
    //         res.json({message:false});
    //     }
    // });
});
// 라우터를 모듈화
module.exports= router;