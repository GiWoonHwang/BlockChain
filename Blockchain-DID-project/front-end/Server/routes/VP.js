//VP발급 요청
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');
var jwt = require('jsonwebtoken');

//블록체인서버로 회원정보 보내기
//http://52.78.25.173:5000/VP
// 가상의 블록체인 서버 http://127.0.0.1:8080/api/blockchain
const Post = async(id, did, num, gender)=> {
    if(gender=="male"){
        var url = "http://52.78.25.173:5000/VP1"
    }else if(gender=="female"){
        var url = "http://52.78.25.173:5000/VP2"
    }
    await axios.post(url, {
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        id :id,
        did:did,
    }).then((res) => {
        if(res.data.message){
            mysql.query('UPDATE vp SET vp = ? WHERE NO = ? ',
            [res.data.message, num],
            function(error, result){
                if(!error){
                    console.log(id + ": vp발급 성공")
                }
                else{
                    console.log(id + ": vp발급 실패")
                }
            });
        }
    })
    .catch((error)=> {
        console.log(error)
        console.log("블록체인 VP서버 오류")
    })
}

router.post('/',(req, res)=>{
    var id =req.body.id //회원 이메일
    var did =req.body.did //회원 DID값
    if(id && did){
        mysql.query('SELECT * FROM signup WHERE email = ?',
        [id],
        async function(error, result){
            //검색 성공
            if(!error){
                if(result[0].did == did && result[0].gender == "male"){
                    mysql.query('INSERT INTO vp(useremail,vp)VALUE(?,?)',
                    [id, "vp정보가 없습니다"],
                    async function(error, result){
                        //DB등록 완료
                        if(!error){
                            try{
                                await Post(id, did, result.insertId, "male") //블록체인서버로 VP 전송
                            }
                            catch{
                                res.json({message:false})
                            }
                            mysql.query('SELECT * FROM vp WHERE NO= ? AND vp<>"vp정보가 없습니다"',
                            [result.insertId],
                            async function(error, result){
                                if(!error){
                                    if(result[0]){
                                        var token = jwt.sign({ 
                                            no: result[0].no,
                                            DATE: result[0].DATE,
                                            useremail : result[0].useremail,
                                            exp: Math.floor(Date.now() / 1000) + (60 * 1) //jwt 토큰 1분기한 
                                        }, did);
                                        res.json({ message: token}) //클라이언트로 전달 
                                    }
                                    else if(result[0]==undefined){
                                        res.json({message:false}) 
                                    }
                                }
                            });
                        }
                        //DB등록 실패
                        else{
                            console.log("스캔정보 DB저장 실패")
                            res.json({message:false});
                        }
                    });
                }else if(result[0].did == did && result[0].gender == "female"){
                    mysql.query('INSERT INTO vp(useremail,vp)VALUE(?,?)',
                    [id, "vp정보가 없습니다"],
                    async function(error, result){
                        //DB등록 완료
                        if(!error){
                            try{
                                await Post(id, did, result.insertId, "female") //블록체인서버로 VP 전송
                            }
                            catch{
                                res.json({message:false})
                            }
                            mysql.query('SELECT * FROM vp WHERE NO= ? AND vp<>"vp정보가 없습니다"',
                            [result.insertId],
                            async function(error, result){
                                if(!error){
                                    if(result[0]){
                                        var token = jwt.sign({ 
                                            no: result[0].no,
                                            DATE: result[0].DATE,
                                            useremail : result[0].useremail,
                                            exp: Math.floor(Date.now() / 1000) + (60 * 1) //jwt 토큰 1분기한 
                                        }, did);
                                        res.json({ message: token}) //클라이언트로 전달 
                                    }
                                    else if(result[0]==undefined){
                                        res.json({message:false}) 
                                    }
                                }
                            });
                        }
                        //DB등록 실패
                        else{
                            console.log("스캔정보 DB저장 실패")
                            res.json({message:false});
                        }
                    });
                }
            }
            //검색 실패
            else{
                res.json({message: false})
            }
        });
    }

});

module.exports= router;