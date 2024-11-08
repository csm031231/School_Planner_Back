import express from "express";
// jwt 라이브러리
import jwt from "jsonwebtoken";
// env환경변수 라이브러리
import dotenv from "dotenv";
// 토큰검증 미들웨어
import { auth } from "./authMiddleware";

const app = express();
// 환경변수 사용선언
dotenv.config();
app.use(express.json());
const port = 5432;

//  POST login요청이 들어오면 body에 id와 password를 실어서 요청으로 가정해서 jwt를발급해준다.
app.post("/login", (req, res, next) => {
  const key = process.env.SECRET_KEY;
  // 받은 요청에서 db의 데이터를 가져온다 (로그인정보)
  const nickname = "JY";
  const profile = "images";
  let token = "";
  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  token = jwt.sign(
    {
      type: "JWT",
      nickname: nickname,
      profile: profile,
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