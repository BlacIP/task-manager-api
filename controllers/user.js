// controllers/user.js
const User = require('../models/user');
const { AppError } = require('../helpers/errorTypes');

const userController = {
    async getAllUsers(req, res) {
        const users = await User.findAll();
        res.json(users);
    },

    async getUserById(req, res) {
        const user = await User.findById(req.params.id);
        res.json(user);
    },

    async getUserByEmail(req, res) {
        const user = await User.findByEmail(req.params.email);
        res.json(user);
    },

    async createUser(req, res) {
        const user = await User.create(req.body);
        res.status(201).json(user);
    },

    async updateUser(req, res) {
        const { id } = req.params;
        //console.log(`Update request for user ID: ${id}`);
        //console.log('Request body:', req.body);
        
        const user = await User.update(id, req.body);
        res.json({
            status: 'success',
            data: user
        });
    },
    async deleteUser(req, res) {
        await User.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    }
};

module.exports = userController;
