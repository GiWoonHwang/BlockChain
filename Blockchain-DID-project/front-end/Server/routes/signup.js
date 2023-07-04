//회원가입 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');
var crypto = require("crypto");



//블록체인서버로 회원정보 보내기
const Post = async (name, email, gender, phone, password)=> {
    await axios.post("http://52.78.25.173:5000/VC", {
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        name: name,
        id: email,
        gender: gender,
        phone: phone,
    }).then((res) => {
        //블록체인서버에서 DID발급해주면
        // console.log(res.data)
        if(res.data.did){
            // console.log(res.data)
            // console.log(res.data.did)
            var did = res.data.did;
            console.log("name: " + name + " email: " + email + " gender: " + gender + " phone: " + phone + " passwd: " + password + " did: " + did)
            mysql.query('INSERT INTO signup(name,email,gender,phone,PASSWORD, did) VALUES(?,?,?,?,?,?)',
            [name, email, gender, phone, password, did],
            function(error, result){
                //DB등록 완료
                if(!error){
                    console.log("DID저장 성공")
                }
                //DB등록 실패
                else{
                    console.log("DID저장 실패")
                }
            });
        }
    })
    .catch((error)=> {
        console.log(error)
        console.log("블록체인 서버 오류")
    })
}

router.post('/', (req, res) =>{
    var name = req.body.name
    var email =req.body.email
    var gender =req.body.gender
    var phone =req.body.phone 
    var password =req.body.password


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
    const encryptResult = encrypt(password) //password 암호화

    

    //입력한 이메일이 존재하는지 확인
    mysql.query('SELECT * FROM signup WHERE email= ? ',
    [email],
    async function(error, result){
        //정상검색
        if(!error){
            //동일한 이메일이 없는경우
            if(result[0] ==undefined){
                //회원가입정보를 DB에 등록
                await Post(name, email, gender, phone, encryptResult); //블록체인서버로 회원정보 보내기
                //블록체인서버에서 VC or vp 값을 받아오면 검색
                mysql.query('SELECT * FROM signup WHERE email=?',
                [email],
                function(error, result){
                    if(!error){
                        if(result[0]){
                            res.json({message:true})
                        }
                    }else if(error){
                        res.json({ message: false}) 
                    }
                });
            } 
            //동일한 이메일이 있는경우
            else if(result[0].email == email){
                res.json({ message: false}) //클라이언트로 전달
            }
        }
        //검색실패
        else{
            console.log("회원가입 서버오류")
            res.json({ message: false}) //클라이언트로 전달
        }
    });

});
// 라우터를 모듈화
module.exports= router;