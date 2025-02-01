const express = require("express");
const router = express.Router();
const taskRoutes = require('./task');
const userRoutes = require('./user');

// Base route for API health check
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

// Use user routes      
router.use('/users', userRoutes);

// Use task routes
router.use('/tasks', taskRoutes);

module.exports = router;

