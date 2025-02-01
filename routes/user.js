// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { validateUser, validateUserId, validateEmail } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');

// User routes with validation and error handling
router.get('/', asyncWrapper(userController.getAllUsers));
router.get('/:id', validateUserId, asyncWrapper(userController.getUserById));
router.get('/email/:email', validateEmail, asyncWrapper(userController.getUserByEmail));
router.post('/', validateUser, asyncWrapper(userController.createUser));
router.put('/:id', validateUserId, validateUser, asyncWrapper(userController.updateUser));
router.delete('/:id', validateUserId, asyncWrapper(userController.deleteUser));

module.exports = router;
