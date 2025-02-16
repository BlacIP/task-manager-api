const express = require("express");
const router = express.Router();
const taskRoutes = require('./task');
const userRoutes = require('./user');
const swaggerRoutes = require('./swagger');
const { ensureAuthenticated } = require('../middleware/auth');



router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/api-docs', swaggerRoutes);

module.exports = router;