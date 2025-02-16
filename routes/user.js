const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { validateUser, validateUserId, validateEmail } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', asyncWrapper(userController.getAllUsers));
router.post('/', ensureAuthenticated, validateUser, asyncWrapper(userController.createUser));

router.get('/:id', validateUserId, asyncWrapper(userController.getUserById));
router.put('/:id',ensureAuthenticated, validateUserId, validateUser, asyncWrapper(userController.updateUser));
router.delete('/:id', ensureAuthenticated, validateUserId, asyncWrapper(userController.deleteUser));

router.get('/email/:email', validateEmail, asyncWrapper(userController.getUserByEmail));

module.exports = router;