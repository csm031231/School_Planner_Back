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

// 모델에서 컬럼명을 매핑하기
const PlannerModel = sequelize.define('Planner', {
    userId: {  // 코드에서는 userId로 사용
        type: DataTypes.STRING,
        field: 'user_id',  // 실제 DB에서는 user_id로 저장
    },
    plannerId: {  // 코드에서는 plannerId로 사용
        type: DataTypes.INTEGER,
        field: 'planner_id',  // 실제 DB에서는 planner_id로 저장
    },
    content: DataTypes.TEXT,
    date: DataTypes.DATE
}, {
    tableName: 'planner'  // 테이블명은 그대로
});


module.exports = UserModel; // UserModel을 내보냄
