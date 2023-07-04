//사용자 정보 수정
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var crypto = require("crypto");


router.post('/',(req, res)=>{
    var email = req.body.email;
    var name = req.body.name;
    var phone = req.body.phone;
    var password = req.body.password;
    
    //패스워드 값이 들어온 경우 
    if(password){
    // //password 암호-복호화
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) // Must be 256 bits (32 characters)
    const IV_LENGTH = 16 // For AES, this is always 16
    function encrypt(password) {
        const iv = crypto.randomBytes(IV_LENGTH)
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(ENCRYPTION_KEY),
            iv,
        )
        const encrypted = cipher.update(password)
        return (
            iv.toString('hex') +
            ':' +
            Buffer.concat([encrypted, cipher.final()]).toString('hex')
        )
        }
        password = encrypt(password) //password 암호화
    }


    //회원이 아닌경우
    if(!email){ 
        res.json({message:false})
    }
    //회원인 경우
    else if(email){
        mysql.query('SELECT * FROM signup WHERE email= ? ',
            [email],
            function(error, result){
                //검색 실패
                if(!error){
                    //이메일이 검색 안될경우
                    if(result[0]== undefined){
                        res.json({ message: false}) 
                    }
                    //이메일이 있으면
                    else if(result[0].email == email){
                        if(!name){
                            name = result[0].name
                        }
                        if(!phone){
                            phone = result[0].phone
                        }
                        if(!password){
                            password = result[0].PASSWORD
                        }
                        mysql.query('UPDATE signup SET NAME = ?, phone= ?, PASSWORD= ? WHERE email = ?',
                        [name, phone, password, email],
                        function(error, result){
                            //검색 실패
                            if(!error){
                                res.json({message: true})
                            }
                            //검색 실패
                            else{
                                res.json({ message: false}) 
                            }
                        });
                    }
                }
                //검색 실패
                else{
                    res.json({ message: false}) //클라이언트로 전달
                    console.log("유저정보 서버오류")
                }
            });
    }
});

// 라우터를 모듈화
module.exports= router;