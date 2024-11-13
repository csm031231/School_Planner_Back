require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const userController = require('./routers/users/user_controller'); // 사용자 라우터 가져오기
const cors = require('cors'); // CORS 패키지 추가

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

// 개발 환경에서만 SECRET_KEY 출력
if (process.env.NODE_ENV !== 'production') {
    console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);
}

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CORS 설정 추가
app.use(cors({
    origin: 'http://localhost:3000', // 허용할 클라이언트 주소 (React 앱 주소)
    credentials: true
  }));

// 미들웨어 설정
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 처리

// 사용자 관련 라우트 설정
app.use('/api', userController); // 사용자 라우트를 /api로 설정

// 글로벌 에러 처리 미들웨어 (선택 사항)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ result: "error", message: "서버 오류가 발생했습니다." });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log(`Express server is listening on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
