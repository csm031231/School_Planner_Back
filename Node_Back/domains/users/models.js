const { DataTypes } = require('sequelize');
const sequelize = require('../../dependencies/pgConnect'); // pgConnect.js에서 Sequelize 인스턴스 가져오기

const UserModel = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true // 기본 키로 설정
    },
    pwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pwd_confirm: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'member', // 테이블 이름
});

module.exports = UserModel; // UserModel을 내보냄
