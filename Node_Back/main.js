const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const userController = require('./routers/users/user_controller'); // 사용자 라우터 가져오기

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 사용자 관련 라우트 설정
app.use('/api', userController); // 사용자 라우트를 /api로 설정

app.listen(5000, function() {
    console.log("Express server is listening on port 5000");
});
