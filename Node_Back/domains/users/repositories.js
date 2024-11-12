const { UserModel, PlannerModel } = require('./models');

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

class PlannerRepository {
    // 일정 생성
    async createPlannerEntry(userId, content, date) {
        const plannerEntry = await PlannerModel.create({
            userId: userId,
            content: content,
            date: date
        });
        return plannerEntry;
    }

    // 플래너 ID로 플래너 찾기
    async findPlannerById(plannerId) {
        return await PlannerModel.findOne({ where: { plannerId } });
    }

    // 플래너 내용 업데이트
    async updatePlanner(plannerId, content, date) {
        const planner = await this.findPlannerById(plannerId);
        if (!planner) {
            throw new Error('존재하지 않는 플래너 항목입니다.');
        }
        planner.content = content;
        planner.date = date;
        await planner.save();
        return planner;
    }

    // 플래너 내용 삭제
    async deletePlannerContent(plannerId) {
        const planner = await this.findPlannerById(plannerId);
        if (!planner) {
            throw new Error('존재하지 않는 플래너 항목입니다.');
        }
        await planner.destroy();
    }
}

module.exports = {
    UserRepository: new UserRepository(),
    PlannerRepository: new PlannerRepository(),
};
