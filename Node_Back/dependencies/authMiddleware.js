const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
  const key = process.env.SECRET_KEY;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: 401,
      message: "토큰이 제공되지 않았습니다.",
    });
  }

  const token = authHeader.split(" ")[1]; // "Bearer"와 토큰을 분리하여 토큰만 추출

  try {
    req.decoded = jwt.verify(token, key); // 추출한 토큰을 검증
    req.user = req.decoded; // req.decoded를 req.user로 설정
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }
  }
};
module.exports = { auth };
