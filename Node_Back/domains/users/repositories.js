const UserModel = require('./models');

class UserRepository {
    async createUser(userData) {
        const user = await UserModel.create(userData);
        return user;
    }
}

module.exports = new UserRepository();