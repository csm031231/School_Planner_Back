const { DataTypes } = require('sequelize');
const sequelize = require('../../dependencies/pgConnect'); // pgConnect.js에서 Sequelize 인스턴스 가져오기

// UserModel 정의
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
    }
}, {
    tableName: 'member', // 테이블 이름
    timestamps: true, // createdAt 및 updatedAt 자동 관리
});

// PlannerModel 정의
const PlannerModel = sequelize.define('Planner', {
    userId: {  // 코드에서는 userId로 사용
        type: DataTypes.STRING,
        field: 'user_id',  // 실제 DB에서는 user_id로 저장
        allowNull: false,
        references: {
            model: UserModel, // 외래 키로 UserModel 참조
            key: 'id'
        }
    },
    plannerId: {  // 코드에서는 plannerId로 사용
        type: DataTypes.INTEGER,
        field: 'planner_id',  // 실제 DB에서는 planner_id로 저장
        primaryKey: true, // 기본 키로 설정
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'planner',  // 테이블명은 그대로
    timestamps: false // planner 테이블에 createdAt, updatedAt 컬럼이 없는 경우
});

// User와 Planner 간의 관계 설정 (1:N 관계)
UserModel.hasMany(PlannerModel, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});
PlannerModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

module.exports = { UserModel, PlannerModel }; // 두 모델을 함께 내보냄
