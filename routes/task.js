// routes/task.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const { validateTask, validateDateRange, validateStatusArray, validatePriorityArray } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');

// Basic CRUD routes
router.get('/', asyncWrapper(taskController.getAllTasks));
router.get('/:id', asyncWrapper(taskController.getTaskById));
router.post('/', validateTask, asyncWrapper(taskController.createTask));
router.put('/:id', validateTask, asyncWrapper(taskController.updateTask));
router.delete('/:id', asyncWrapper(taskController.deleteTask));

// User-specific routes
router.get('/user/:email', asyncWrapper(taskController.getTasksByUser));
router.get('/user/:email/stats', asyncWrapper(taskController.getUserTasksCount));

// Status and Priority routes
router.get('/status/:status', asyncWrapper(taskController.getTasksByStatus));
router.get('/priority/:priority', asyncWrapper(taskController.getTasksByPriority));
router.post('/status/multiple', validateStatusArray, asyncWrapper(taskController.getTasksByStatuses));
router.post('/priority/multiple', validatePriorityArray, asyncWrapper(taskController.getTasksByPriorities));

// Date-based routes
router.get('/due/:date', asyncWrapper(taskController.getTasksDueBy));
router.get('/date-range', validateDateRange, asyncWrapper(taskController.getTasksByDateRange));
router.get('/recent', asyncWrapper(taskController.getRecentTasks));
router.get('/overdue', asyncWrapper(taskController.getOverdueTasks));

// Statistics routes
router.get('/stats/status', asyncWrapper(taskController.getStatusStats));
router.get('/stats/priority', asyncWrapper(taskController.getPriorityStats));

// Search route
router.get('/search', asyncWrapper(taskController.searchTasks));

module.exports = router;