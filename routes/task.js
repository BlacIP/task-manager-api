const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const { validateTask, validateDateRange, validateStatusArray, validatePriorityArray } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');

// Specific routes first
router.get('/recent', asyncWrapper(taskController.getRecentTasks));
router.post('/date-range', validateDateRange, asyncWrapper(taskController.getTasksByDateRange));
router.get('/status/:status', asyncWrapper(taskController.getTasksByStatus));
router.get('/priority/:priority', asyncWrapper(taskController.getTasksByPriority));
router.get('/user/:email', asyncWrapper(taskController.getTasksByUser));
router.get('/overdue', asyncWrapper(taskController.getOverdueTasks));
router.get('/search', asyncWrapper(taskController.searchTasks));

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
router.post('/status/multiple', validateStatusArray, asyncWrapper(taskController.getTasksByStatuses));
router.post('/priority/multiple', validatePriorityArray, asyncWrapper(taskController.getTasksByPriorities));

// Date-based routes
router.get('/due/:date', asyncWrapper(taskController.getTasksDueBy));

// Statistics routes
router.get('/stats/status', asyncWrapper(taskController.getStatusStats));
router.get('/stats/priority', asyncWrapper(taskController.getPriorityStats));

module.exports = router;