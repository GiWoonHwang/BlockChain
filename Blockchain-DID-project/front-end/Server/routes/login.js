//로그인 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var crypto = require("crypto");

var decrypt= (password)=> {
    // //password 암호-복호화
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) // Must be 256 bits (32 characters)
  const IV_LENGTH = 16 // For AES, this is always 16
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


router.post('/', (req,res)=>{
  var email = req.body.email;
  var password = req.body.password;
  mysql.query('SELECT * FROM signup WHERE email=?',
  [email],
  function(error, result){
      //DB등록 완료
      if(!error){
        if(result[0]){
          if(decrypt(result[0].PASSWORD)==password){
                res.json({ message: true}) //클라이언트로 전달
          }else if(decrypt(result[0].PASSWORD)!=password){
            res.json({ message: false}) //클라이언트로 전달
          }
        }
        else if(result[0]==undefined){
          res.json({ message: false}) //클라이언트로 전달
        } 
      }
      //DB등록 실패
      else{
        res.json({ message: false}) //클라이언트로 전달
        console.log("로그인 서버오류")
      }
  });
});
module.exports= router;