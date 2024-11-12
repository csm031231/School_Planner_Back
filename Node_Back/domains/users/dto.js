class MemberDTO {
    constructor(id, name, pwd) {
        this.id = id;
        this.name = name;
        this.pwd = pwd;
    }

    // 비밀번호 확인을 위한 별도의 메서드 추가
    static validatePassword(pwd, pwd_confirm) {
        return pwd === pwd_confirm;
    }
}

module.exports = MemberDTO;
