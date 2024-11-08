const UserRepository = require('./repositories');
const jwt = require("jsonwebtoken"); // jwt 라이브러리 추가

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

}

module.exports = new UserService();
