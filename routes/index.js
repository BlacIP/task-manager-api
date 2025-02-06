// const express = require("express");
// const router = express.Router();
// const taskRoutes = require('./task');
// const userRoutes = require('./user');
// const swaggerRoutes = require('./swagger');

// router.get('/', (req, res) => {
//     res.json({ message: 'Welcome to the Task Management API' });
// });
      
// router.use('/users', userRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/api-docs', swaggerRoutes);

// module.exports = router;

const express = require("express");
const router = express.Router();
const taskRoutes = require('./task');
const userRoutes = require('./user');
const swaggerRoutes = require('./swagger');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

router.use('/users', ensureAuthenticated, userRoutes);
router.use('/tasks', ensureAuthenticated, taskRoutes);
router.use('/api-docs', swaggerRoutes);

module.exports = router;