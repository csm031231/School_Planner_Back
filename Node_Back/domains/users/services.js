const UserRepository = require('./repositories');

class UserService {
    async registerUser(memberDTO) {
        return await UserRepository.createUser({
            name: memberDTO.name,
            id: memberDTO.id,
            pwd: memberDTO.pwd,
            pwd_confirm: memberDTO.pwd_confirm
        });
    }
}

module.exports = new UserService();