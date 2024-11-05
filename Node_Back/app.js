var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./pgConnect');
var swaggerUi = require('swagger-ui-express');
var swaggerJsdoc = require('swagger-jsdoc');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/JS', express.static(__dirname + "/JS"));
app.use(express.static(__dirname + "/css"));
app.use('/image', express.static(__dirname + "/image"));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js API 문서',
            version: '1.0.0',
            description: 'Node.js API를 위한 Swagger 문서'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: '로컬 서버'
            }
        ]
    },
    apis: ['./app.js'] // 주석으로 정의된 경로를 포함할 파일
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user_table';

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ result: "error", message: "Database error" });
        }
        res.status(200).json(result.rows);
    });
});

app.post('/register', (req, res, next) => {
    const user_table = [
        req.body.id,
        req.body.pwd,
        req.body.name
    ];

    const sql = 'INSERT INTO user_table(id, pwd, name) VALUES($1, $2, $3)';

    db.query(sql, user_table, (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ result: "error", message: "Database error" });
        }
    });

    return res.status(200).json({ result: "ok" });
});

app.listen(5000, function () {
    console.log("Express server is listening on port 5000");
});