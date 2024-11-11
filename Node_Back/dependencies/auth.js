const express = require("express");
const jwt = require("jsonwebtoken"); // jwt 라이브러리
const dotenv = require("dotenv"); // env환경변수 라이브러리


const app = express();
dotenv.config(); // 환경변수 사용선언
app.use(express.json());

// POST login 요청이 들어오면 body에 id와 password를 실어서 요청으로 가정해서 jwt를 발급해준다.
app.post("/login", (req, res, next) => {
  const key = process.env.SECRET_KEY;
  const nickname = "JY";
  const profile = "images";
  let token = "";

  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  token = jwt.sign(
    {
      type: "JWT",
      nickname: nickname,
      profile: profile,
      user_id: "user123"
    },
    key,
    {
      expiresIn: "30m", // 30분후 만료
      issuer: "토큰발급자",
    }
  );

  // response
  return res.status(200).json({
    code: 200,
    message: "token is created",
    token: token,
  });
});

module.exports = app;
