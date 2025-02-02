const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { validateUser, validateUserId, validateEmail } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');

// Specific routes first
router.get('/email/:email', validateEmail, asyncWrapper(userController.getUserByEmail));

// ID routes after
router.get('/:id', validateUserId, asyncWrapper(userController.getUserById));
router.put('/:id', validateUserId, validateUser, asyncWrapper(userController.updateUser));
router.delete('/:id', validateUserId, asyncWrapper(userController.deleteUser));

// General routes last
router.get('/', asyncWrapper(userController.getAllUsers));
router.post('/', validateUser, asyncWrapper(userController.createUser));

module.exports = router;