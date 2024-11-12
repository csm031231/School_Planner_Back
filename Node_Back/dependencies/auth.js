const express = require("express");
const jwt = require("jsonwebtoken"); // jwt 라이브러리
const dotenv = require("dotenv"); // env 환경변수 라이브러리

const app = express();
dotenv.config(); // 환경변수 사용 선언
app.use(express.json());

app.post("/login", async (req, res, next) => {
  try {
    const { id, password } = req.body;
    const key = process.env.SECRET_KEY;
    const expiresIn = process.env.TOKEN_EXPIRATION || "30m"; // 기본 만료 시간 30분
    const issuer = process.env.TOKEN_ISSUER || "default_issuer"; // 기본 발급자

    // 예시 사용자 데이터베이스 검증 (실제 애플리케이션에서는 DB 조회 필요)
    const dummyUser = { id: "user123", password: "pass123", nickname: "JY", profile: "images" };
    if (id !== dummyUser.id || password !== dummyUser.password) {
      return res.status(400).json({ result: "error", message: "잘못된 사용자 정보입니다." });
    }

    // 토큰 생성
    const token = jwt.sign(
      {
        type: "JWT",
        nickname: dummyUser.nickname,
        profile: dummyUser.profile,
        user_id: dummyUser.id,
      },
      key,
      {
        expiresIn,
        issuer,
      }
    );

    // 성공 응답
    return res.status(200).json({
      result: "ok",
      message: "token is created",
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    // 에러 처리
    return res.status(500).json({
      result: "error",
      message: "로그인 중 오류가 발생했습니다.",
    });
  }
});

module.exports = app;
