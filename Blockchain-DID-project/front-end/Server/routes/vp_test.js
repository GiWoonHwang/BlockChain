//VP발급 요청 처음에 만든거
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios')
var jwt = require('jsonwebtoken');

var arry=[]
//블록체인서버로 회원정보 보내기
const Post = async(id, did)=> {
    await axios.post("http://52.78.25.173:5000/VP", {
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        id :id,
        did:did,
    }).then((res) => {
        if(res.data.message){
            mysql.query('INSERT INTO vp(useremail,vp)VALUE(?,?)',
            [id, res.data.message],
            async function(error, result){
                //검색 실패
                if(!error){
                    mysql.query('SELECT * FROM vp WHERE no=?',
                    [result.insertId],
                    async function(error, result){
                        if(!error){
                            if(result[0]){
                                arry[0]=result[0].no
                                arry[1]=result[0].DATE
                                arry[2]=result[0].useremail
                                console.log(id + ": vp발급 성공")
                            }
                        }else if(error){
                            console.log(id + ": vp검색 실패")
                        }
                    });
                }
                //검색 실패
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
            //검색 실패
            if(!error){
                if(result[0].did == did){
                    await Post(id, did)
                    // console.log(Math.floor(Date.now() / 1000) + (60 * 10))
                    setTimeout(() => {
                        let token = jwt.sign({ 
                            no: arry[0],
                            DATE: arry[1],
                            useremail : arry[2],
                            exp: Math.floor(Date.now() / 1000) + (60 * 1) //jwt 토큰 1분기한 
                        }, did);
                        res.json({ message: token}) //클라이언트로 전달 
                    }, 200)

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