require('dotenv').config();

console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY); // 환경 변수 확인용 로그

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const userController = require('./routers/users/user_controller'); // 사용자 라우터 가져오기


const app = express();
const swaggerDocument = YAML.load('./swagger.yaml'); // 상대 경로로 변경

// Swagger UI 경로 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 미들웨어 설정
app.use(express.json()); // JSON 요청 처리
app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 데이터 처리

// 사용자 관련 라우트 설정
app.use('/api', userController); // 사용자 라우트를 /api로 설정

// 서버 시작
app.listen(5000, function() {
    console.log("Express server is listening on port 5000");
    console.log('Swagger docs available at http://localhost:5000/api-docs');
});
