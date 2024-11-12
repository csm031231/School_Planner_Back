const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT || 5432,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB 연결 성공');
    } catch (error) {
        console.error('DB 연결 오류:', error.message);
        // 전체 오류 로그를 출력하려면 다음을 사용합니다.
        console.error(error);
    }
};

connectDB();

module.exports = sequelize;
