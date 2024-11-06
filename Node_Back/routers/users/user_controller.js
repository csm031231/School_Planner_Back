const express = require('express');
const UserService = require('../../domains/users/services'); // UserService 가져오기
const MemberDTO = require('../../domains/users/dto'); // DTO 클래스 가져오기

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, id, pwd, pwd_confirm } = req.body;

    const memberDTO = new MemberDTO(name, id, pwd, pwd_confirm);

    try {
        const user = await UserService.registerUser(memberDTO);
        return res.status(200).json({ result: "ok", user });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ result: "error", message: "Database error" });
    }
});

module.exports = router;
