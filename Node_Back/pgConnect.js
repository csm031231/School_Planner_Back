var {Client} = require('pg');

const client = new Client({
    user:"postgres",
    host: "localhost",
    database: "CP",
    password: "9668",
    post: 5432,
});

client.connect(err => {
    if (err) {
        console.error('첫 번째 사용자 연결 실패', err.stack);
    } else {
        console.log('첫 번째 사용자 연결 성공');
    }
});