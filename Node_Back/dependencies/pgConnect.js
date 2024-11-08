const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CP', 'postgres', '0879', { // 데이터베이스 이름, 사용자 이름, 비밀번호
    host: 'localhost',
    dialect: 'postgres',
    port: 5432, 
});

sequelize.authenticate()
    .then(() => {
        console.log('DB 연결 성공');
    })
    .catch(err => {
        console.error('DB 연결 오류', err);
    });

module.exports = sequelize; // Sequelize 인스턴스를 내보냄
