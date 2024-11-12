const { UserRepository, PlannerRepository } = require('./repositories'); // repositories.js에서 필요한 리포지토리 가져오기
const jwt = require("jsonwebtoken");

class UserService {
    // 아이디 중복 체크 함수
    async checkDuplicateId(userId) {
        const existingUser = await UserRepository.findUserById(userId);
        return !!existingUser; // 중복이 있으면 true, 없으면 false 반환
    }

    // 회원가입 함수
    async registerUser(memberDTO) {
        // 중복 검사
        const isDuplicate = await this.checkDuplicateId(memberDTO.id);
        if (isDuplicate) {
            throw new Error('이미 존재하는 아이디입니다.');
        }

        // 회원 생성
        const user = await UserRepository.createUser({
            name: memberDTO.name,
            id: memberDTO.id,
            pwd: memberDTO.pwd
        });
        return { user };
    }

    // 로그인 함수 (로그인 시 토큰 발급)
    async loginUser(id, pwd) {
        const user = await UserRepository.findUserById(id);
        if (!user || user.pwd !== pwd) {
            throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
        }

        // 로그인 성공 시 토큰 발급
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: "30m"
        });

        // 로그인 성공 시 토큰과 사용자 정보 반환
        return { user, token };
    }

    // 비밀번호 업데이트 함수
    async updatePassword(userId, newPassword) {
        // UserRepository를 통해 비밀번호 업데이트 수행
        await UserRepository.updatePassword(userId, newPassword);
    }

    // 회원 탈퇴
    async deleteUser(userId) {
        await UserRepository.deleteUser(userId);
    }
}

class PlannerService {
    // Planner 저장 함수
    async savePlanner(userId, content, date) {
        try {
            return await PlannerRepository.createPlannerEntry(userId, content, date);
        } catch (error) {
            console.error('Planner 저장 중 오류 발생:', error.message);
            throw new Error(`Planner 데이터를 저장하는 동안 오류가 발생했습니다: ${error.message}`);
        }
    }

    // 플래너 수정
    async updatePlanner(plannerId, newContent, date) {
        // PlannerRepository를 통해 플래너 내용과 날짜를 업데이트 수행
        await PlannerRepository.updatePlanner(plannerId, newContent, date);
    }

    // 플래너 삭제
    async deletePlanner(plannerId) {
        await PlannerRepository.deletePlannerContent(plannerId);
    }
}

module.exports = { UserService: new UserService(), PlannerService: new PlannerService() };
