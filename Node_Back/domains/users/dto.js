class MemberDTO {
    constructor(name, id, pwd, pwd_confirm) {
        this.name = name;
        this.id = id;
        this.pwd = pwd;
        this.pwd_confirm = pwd_confirm;
    }
}

module.exports = MemberDTO;