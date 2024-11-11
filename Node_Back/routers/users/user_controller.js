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
        const isDuplicated = await UserService.checkDuplicateId(id);
        
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
        const { user, token } = await UserService.registerUser(memberDTO);

        return res.status(200).json({ result: "ok", user });
    } catch (error) {
        console.error('Error registering user:', error);
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

    if (pwd !== pwd_confirm) {
        return res.status(400).json({ result: "error", message: "비밀번호가 일치하지 않습니다." });
    }

    try {
        await UserService.updatePassword(userId, pwd);
        return res.status(200).json({ result: "ok", message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ result: "error", message: "Database error" });
    }
});

// 회원 탈퇴
router.post('/delete-account', auth, async (req, res) => {
    const userId = req.decoded.id; // 토큰에서 user ID 추출

    try {
        await UserService.deleteUser(userId);
        return res.status(200).json({ result: "ok", message: "회원 탈퇴가 완료되었습니다." });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ result: "error", message: "회원 탈퇴 중 오류가 발생했습니다." });
    }
});

// planner 엔드포인트에서 날짜 검증 및 저장
router.post('/planner', auth, async (req, res) => {
    const { content, date } = req.body;
    const userId = req.decoded.id; // auth 미들웨어에서 설정된 사용자 ID를 사용

    // 날짜 유효성 검사 (YYYY-MM-DD 형식)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(datePattern)) {
        return res.status(400).json({ result: "error", message: "잘못된 날짜 형식입니다. YYYY-MM-DD 형식으로 입력해주세요." });
    }

    try {
        await UserService.savePlanner(userId, content, date); // 날짜 저장
        res.status(201).json({
            result: "ok",
            message: 'Planner 내용이 성공적으로 저장되었습니다.',
            data: {
                user_id: userId,
                content: content,
                date: date
            }
        });
    } catch (error) {
        console.error('Planner 저장 중 오류 발생:', error.message);
        res.status(500).json({ result: "error", message: "Planner 저장 중 오류가 발생했습니다." });
    }
});

// // PUT 요청 처리하는 코드 예시
//     router.put('/planner/:plannerId', auth, async (req, res) => {
//         const { content, date } = req.body;  // 수정할 내용과 날짜를 받음
//         const userId = req.decoded.id;       // auth 미들웨어에서 설정된 사용자 ID를 사용
//         const plannerId = req.params.plannerId;  // URL 파라미터에서 plannerId 받기
    
//         // 날짜 유효성 검사 (YYYY-MM-DD 형식)
//         const datePattern = /^\d{4}-\d{2}-\d{2}$/;
//         if (!date.match(datePattern)) {
//             return res.status(400).json({ result: "error", message: "잘못된 날짜 형식입니다. YYYY-MM-DD 형식으로 입력해주세요." });
//         }
    
//         try {
//             // 해당 사용자의 플래너 항목 찾기 (userId와 plannerId 사용)
//             const planner = await UserService.findPlannerByUserIdAndId(userId, plannerId);
    
//             if (!planner) {
//                 return res.status(404).json({ result: "error", message: "수정할 플래너 항목을 찾을 수 없습니다." });
//             }
    
//             // 플래너 내용 수정
//             planner.content = content;
//             planner.date = date;
    
//             // 수정된 플래너 항목 저장
//             await planner.save();  // 저장
    
//             return res.status(200).json({
//                 result: "ok",
//                 message: 'Planner 내용이 성공적으로 수정되었습니다.',
//                 data: {
//                     user_id: userId,
//                     content: content,
//                     date: date
//                 }
//             });
    
//         } catch (error) {
//             console.error('Planner 수정 중 오류 발생:', error.message);
//             return res.status(500).json({ result: "error", message: "Planner 수정 중 오류가 발생했습니다." });
//         }
//     });


module.exports = router;
