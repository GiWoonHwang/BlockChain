//사용자 정보 홈화면에전달하는 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var nodemailer = require('nodemailer');   
var crypto = require("crypto");

//사용자에게 이메일 전송
const sendEmail= async(email,password)=>{

    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) // Must be 256 bits (32 characters)
    const IV_LENGTH = 16 // For AES, this is always 16
        function decrypt(password) {
        const passwordParts = password.split(':')
        const iv = Buffer.from(passwordParts.shift(), 'hex')
        const encryptedpassword = Buffer.from(passwordParts.join(':'), 'hex')
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(ENCRYPTION_KEY),
            iv,
            )
            const decrypted = decipher.update(encryptedpassword)
            
            return Buffer.concat([decrypted, decipher.final()]).toString()
        }
        const decryptResult = decrypt(password) //password 복호화

    var transporter = nodemailer.createTransport({
        service: 'gmail'              //사용하고자 하는 서비스
        , prot: 587
        , host: 'smtp.gmlail.com'
        , secure: false
        , requireTLS: true
        , auth: {
            user: 'jongbuem1918@gmail.com'           
            , pass: 'whdqja122036'                
        }
    });
    
    var info = await transporter.sendMail({   
        from: 'jongbuem1918@gmail.com',                           
        to: email,            
        subject: '[ ArTo ] 비밀번호입니다.',                  
        text: "비밀번호: "+decryptResult,                      
    });
}



router.post('/',(req, res)=>{
    var email = req.body.email;
    mysql.query('SELECT * FROM signup WHERE email=?',
    [email],
    function(error, result){
        //검색 실패
        if(!error){
            //이메일이 없으면
            if(result[0]== undefined){
              res.json({ message: false}) //클라이언트로 전달
            }
            //이메일이 있으면
            else if(result[0].email == email){
                sendEmail(email,result[0].PASSWORD)
                res.json({ message: true}) //클라이언트로 전달
            }
        }
        //검색 실패
        else{
            res.json({ message: false}) //클라이언트로 전달
            console.log("유저정보 서버오류")
        }
    });

});

// 라우터를 모듈화
module.exports= router;