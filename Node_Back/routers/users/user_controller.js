const express = require('express');
const { UserService, PlannerService } = require('../../domains/users/services'); // UserService와 PlannerService 가져오기
const MemberDTO = require('../../domains/users/dto'); // DTO 클래스 가져오기
const { auth } = require("../../dependencies/authMiddleware.js");
const router = express.Router();



// 아이디 중복 체크
router.post('/check-id', async (req, res) => {
    const { id } = req.body;

    try {
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

    if (pwd !== pwd_confirm) {
        return res.status(400).json({ result: "error", message: "비밀번호가 일치하지 않습니다." });
    }

    const memberDTO = new MemberDTO(name, id, pwd);

    try {
        const { user } = await UserService.registerUser(memberDTO);

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
    const userId = req.decoded.id;

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
    const userId = req.decoded.id;

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
    const userId = req.decoded.id;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(datePattern)) {
        return res.status(400).json({ result: "error", message: "잘못된 날짜 형식입니다. YYYY-MM-DD 형식으로 입력해주세요." });
    }

    try {
        await PlannerService.savePlanner(userId, content, date);
        res.status(201).json({ result: "ok", message: "Planner 내용이 성공적으로 저장되었습니다." });
    } catch (error) {
        console.error('Planner 저장 중 오류 발생:', error.message);
        res.status(500).json({ result: "error", message: "Planner 저장 중 오류가 발생했습니다." });
    }
});

// 월별 일정 조회 엔드포인트
router.get('/planner', auth, async (req, res) => {
    const userId = req.decoded.id;
    const { year, month } = req.query;

    // 년도와 월 검증
    if (!year || !month) {
        return res.status(400).json({ 
            result: "error", 
            message: "년도와 월을 지정해주세요." 
        });
    }

    // 숫자 형식 검증
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum)) {
        return res.status(400).json({
            result: "error",
            message: "년도와 월은 숫자여야 합니다."
        });
    }

    // 월 범위 검증 (1-12)
    if (monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
            result: "error",
            message: "월은 1에서 12 사이의 값이어야 합니다."
        });
    }

    try {
        // 해당 월의 시작일과 종료일 계산
        const startDate = `${year}-${month.padStart(2, '0')}-01`;
        const lastDay = new Date(yearNum, monthNum, 0).getDate();
        const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}`;

        // 서비스 계층에서 데이터 조회
        const tasks = await PlannerService.getPlannersByMonth(
            userId, 
            startDate, 
            endDate
        );

        res.status(200).json({
            result: "ok",
            tasks: tasks.map(task => ({
                id: task.id,
                content: task.content,
                date: task.date,
                completed: task.completed
            }))
        });
    } catch (error) {
        console.error('Planner 조회 중 오류 발생:', error.message);
        res.status(500).json({
            result: "error",
            message: "Planner 조회 중 오류가 발생했습니다."
        });
    }
});

// 플래너 내용 수정 요청을 받아 처리 (PUT으로 변경)
router.put('/planner/:plannerId', auth, async (req, res) => {
    const { plannerId } = req.params;
    const { content, date } = req.body;

    // 디버깅용 로그
    console.log("Received content:", content);
    console.log("Received date:", date);

    if (!content || !date) {
        return res.status(400).json({ result: "error", message: "내용과 날짜를 입력해주세요." });
    }

    try {
        await PlannerService.updatePlanner(plannerId, content, date);
        return res.status(200).json({ result: "ok", message: "플래너 내용이 성공적으로 변경되었습니다." });
    } catch (error) {
        console.error('Error updating planner content:', error);
        return res.status(500).json({ result: "error", message: "Database error" });
    }
});



// 플래너 내용 삭제 요청을 받아 처리 (DELETE로 변경)
router.delete('/planner/:plannerId', auth, async (req, res) => {
    const { plannerId } = req.params;

    try {
        await PlannerService.deletePlanner(plannerId);
        return res.status(200).json({ result: "ok", message: "플래너 내용이 성공적으로 삭제되었습니다." });
    } catch (error) {
        console.error('Error deleting planner content:', error);
        return res.status(500).json({ result: "error", message: "플래너 내용 삭제 중 오류가 발생했습니다." });
    }
});

module.exports = router;
