const UserModel = require('./models');

class UserRepository {
    // 사용자 생성
    async createUser(userData) {
        const user = await UserModel.create(userData);
        return user;
    }

    // 아이디로 사용자 찾기 (중복 체크, 로그인)
    async findUserById(userId) {
        return await UserModel.findOne({ where: { id: userId } });
    }
}

module.exports = new UserRepository();