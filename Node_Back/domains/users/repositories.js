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

    // 일정 생성
    async createPlannerEntry(userId, content, date) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error('존재하지 않는 사용자입니다.');
        }

        // planner 테이블에 내용과 날짜를 저장
        const plannerEntry = await PlannerModel.create({
            user_id: userId,
            content: content,
            date: date
        });
        return plannerEntry;
    }

    // // 일정 조회
    // async getPlannerEntriesByUserId(userId) {
    //     const user = await this.findUserById(userId);
    //     if (!user) {
    //         throw new Error('존재하지 않는 사용자입니다.');
    //     }

    //     // 특정 사용자의 모든 일정 조회
    //     const plannerEntries = await PlannerModel.findAll({
    //         where: { user_id: userId }
    //     });
    //     return plannerEntries;
    // }

    //  // 일정 수정
    //  async updatePlannerEntry(userId, plannerId, content, date) {
    //     // 사용자가 존재하는지 확인
    //     const user = await this.findUserById(userId);
    //     if (!user) {
    //         throw new Error('존재하지 않는 사용자입니다.');
    //     }

    //     // user_id와 plannerId로 플래너 항목 찾기
    //     const plannerEntry = await PlannerModel.findOne({
    //         where: {
    //             user_id: userId,
    //             id: plannerId // 수정할 플래너 항목 찾기
    //         }
    //     });

    //     if (!plannerEntry) {
    //         throw new Error('수정할 플래너 항목을 찾을 수 없습니다.');
    //     }

    //     // 플래너 항목 내용과 날짜 수정
    //     plannerEntry.content = content;
    //     plannerEntry.date = date;

    //     // 수정된 플래너 항목 저장
    //     await plannerEntry.save();

    //     return plannerEntry;  // 수정된 플래너 항목 반환
    // }

} 

module.exports = new UserRepository();
