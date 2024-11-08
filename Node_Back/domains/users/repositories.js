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

        // 비밀번호 업데이트
    async updatePassword(userId, newPassword) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error('존재하지 않는 사용자입니다.');
        }
        user.pwd = newPassword;
        user.pwd_confirm = newPassword;
        await user.save();
    }

        // 회원 삭제
    async deleteUser(userId) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error('존재하지 않는 사용자입니다.');
        }
        await user.destroy(); // 사용자 데이터 삭제
    }
}

module.exports = new UserRepository();