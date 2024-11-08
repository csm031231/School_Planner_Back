const express = require('express');
const UserService = require('../../domains/users/services'); // UserService 가져오기
const MemberDTO = require('../../domains/users/dto'); // DTO 클래스 가져오기

const router = express.Router();

// 아이디 중복 체크
router.post('/check-id', async (req, res) => {
    const { id } = req.body;

    try {
        // 아이디 중복 여부 확인
        const isDuplicated = await UserService.isIdDuplicated(id);
        
        if (isDuplicated) {
            return res.status(400).json({ result: "error", message: "이미 존재하는 아이디입니다." });
        }

        return res.status(200).json({ result: "ok", message: "아이디 사용 가능" });
    } catch (error) {
        console.error('Error checking id duplication:', error);
        return res.status(500).json({ result: "error", message: "Database error" });
    }
});

// 회원가입 요청을 받을 때 데이터를 객체로 생성하고, 회원가입 처리
router.post('/register', async (req, res) => {
    const { name, id, pwd, pwd_confirm } = req.body;

    const memberDTO = new MemberDTO(name, id, pwd, pwd_confirm);

    try {
        const {user,token} = await UserService.registerUser(memberDTO);

        return res.status(200).json({ result: "ok", user });
    } catch (error) {
        console.error('Error registering user:', error);
        // 에러 메시지가 "이미 존재하는 아이디입니다."를 포함할 경우 해당 메시지 반환
        if (error.message.includes("이미 존재하는 아이디입니다.")) {
            return res.status(400).json({ result: "error", message: "이미 존재하는 아이디입니다." });
        }
        return res.status(500).json({ result: "error", message: "Database error" });
    }
});

// 로그인 요청을 받아 로그인 처리
router.post('/login', async (req, res) => {
    const { id, pwd } = req.body;

    try {
        // 로그인 처리 후 토큰과 사용자 정보 반환
        const { user, token } = await UserService.loginUser(id, pwd);

        return res.status(200).json({ result: "ok", user, token });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(400).json({ result: "error", message: error.message });
    }
});

module.exports = router;
