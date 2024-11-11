const UserRepository = require('./repositories');
const jwt = require("jsonwebtoken"); // jwt 라이브러리 추가
const sequelize = require('../../dependencies/pgConnect');

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
        pwd: memberDTO.pwd,
        pwd_confirm: memberDTO.pwd_confirm
    });
    return { user}; 
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

   // Planner 저장 함수
   async savePlanner(userId, content, date) {
        try {
            // 트랜잭션 시작
            const result = await sequelize.transaction(async (t) => {
                // planner 테이블에 데이터 삽입
                const plannerEntry = await sequelize.query(
                    'INSERT INTO planner (user_id, content, date) VALUES (?, ?, ?)',
                    {
                        replacements: [userId, content, date],
                        transaction: t,
                    }
                );
                return plannerEntry;
            });
            return result;
        } catch (error) {
            console.error('Planner 저장 중 오류 발생:', error.message);
            throw new Error(`Planner 데이터를 저장하는 동안 오류가 발생했습니다: ${error.message}`);
        }
    }

//    // UserService에 findPlannerByUserId 추가
//    async findPlannerByUserIdAndId(userId, plannerId) {
//         try {
//             // user_id와 planner_id로 플래너 항목 찾기
//             const planner = await PlannerModel.findOne({
//                 where: {
//                     user_id: userId,  // 해당 user_id에 속하는 플래너 항목
//                     planner_id: plannerId // 해당 plannerId를 가진 플래너 항목 찾기
//                 }
//             });
//             return planner;
//         } catch (error) {
//             throw new Error('플래너 항목을 찾는 데 오류가 발생했습니다.');
//         }
//     }


    
//     // 일정 수정 (user_id와 plannerId 사용)
//     async updatePlannerEntry(userId, plannerId, content, date) {
//         const user = await this.findUserById(userId);
//         if (!user) {
//             throw new Error('존재하지 않는 사용자입니다.');
//         }
    
//         // user_id와 planner_id로 플래너 항목 찾기
//         const plannerEntry = await PlannerModel.findOne({
//             where: {
//                 user_id: userId,
//                 planner_id: planner_id  // 수정할 특정 플래너 항목의 planner_id
//             }
//         });
    
//         if (!plannerEntry) {
//             throw new Error('수정할 플래너 항목을 찾을 수 없습니다.');
//         }
    
//         // 플래너 항목 수정
//         plannerEntry.content = content;
//         plannerEntry.date = date;
    
//         // 수정된 플래너 항목 저장
//         await plannerEntry.save();
    
//         return plannerEntry;  // 수정된 플래너 항목 반환
//     }
    

}

    




module.exports = new UserService();
