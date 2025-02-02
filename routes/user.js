const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { validateUser, validateUserId, validateEmail } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');

router.get('/', asyncWrapper(userController.getAllUsers));
router.post('/', validateUser, asyncWrapper(userController.createUser));

router.get('/:id', validateUserId, asyncWrapper(userController.getUserById));
router.put('/:id', validateUserId, validateUser, asyncWrapper(userController.updateUser));
router.delete('/:id', validateUserId, asyncWrapper(userController.deleteUser));

router.get('/email/:email', validateEmail, asyncWrapper(userController.getUserByEmail));

module.exports = router;