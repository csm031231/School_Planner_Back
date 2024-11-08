const express = require('express');
const UserService = require('../../domains/users/services'); // UserService 가져오기
const MemberDTO = require('../../domains/users/dto'); // DTO 클래스 가져오기
const { auth } = require("../../dependencies/authMiddleware.js");
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

// 비밀번호 변경 요청을 받아 처리
router.post('/update-password', auth, async (req, res) => {
    const { pwd, pwd_confirm } = req.body;
    const userId = req.decoded.id; // 토큰에서 user ID 추출

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (pwd !== pwd_confirm) {
        return res.status(400).json({ result: "error", message: "비밀번호가 일치하지 않습니다." });
    }

    try {
        // 비밀번호 업데이트 수행
        await UserService.updatePassword(userId, pwd);
        return res.status(200).json({ result: "ok", message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ result: "error", message: "Database error" });
    }
});

// 회원 탈퇴
router.post('/delete-account', auth, async (req, res) => { // DELETE 대신 POST 사용
    const userId = req.decoded.id; // 토큰에서 user ID 추출

    try {
        await UserService.deleteUser(userId);
        return res.status(200).json({ result: "ok", message: "회원 탈퇴가 완료되었습니다." });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ result: "error", message: "회원 탈퇴 중 오류가 발생했습니다." });
    }
});

module.exports = router;
