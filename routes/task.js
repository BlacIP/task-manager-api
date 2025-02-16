const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const { validateTask, validateDateRange, validateStatusArray, validatePriorityArray } = require('../middleware/validation');
const asyncWrapper = require('../helpers/asyncWrapper');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/recent', asyncWrapper(taskController.getRecentTasks));
router.post('/date-range', ensureAuthenticated,validateDateRange, asyncWrapper(taskController.getTasksByDateRange));
router.get('/status/:status', asyncWrapper(taskController.getTasksByStatus));
router.get('/priority/:priority', asyncWrapper(taskController.getTasksByPriority));
router.get('/user/:email', asyncWrapper(taskController.getTasksByUser));
router.get('/overdue', asyncWrapper(taskController.getOverdueTasks));
router.get('/search', asyncWrapper(taskController.searchTasks));

router.get('/', asyncWrapper(taskController.getAllTasks));
router.get('/:id', asyncWrapper(taskController.getTaskById));
router.post('/', ensureAuthenticated,validateTask, asyncWrapper(taskController.createTask));
router.put('/:id', ensureAuthenticated, validateTask, asyncWrapper(taskController.updateTask));
router.delete('/:id', ensureAuthenticated, asyncWrapper(taskController.deleteTask));

router.get('/user/:email', asyncWrapper(taskController.getTasksByUser));
router.get('/user/:email/stats', asyncWrapper(taskController.getUserTasksCount));

router.post('/status/multiple', ensureAuthenticated, validateStatusArray, asyncWrapper(taskController.getTasksByStatuses));
router.post('/priority/multiple', ensureAuthenticated, validatePriorityArray, asyncWrapper(taskController.getTasksByPriorities));

router.get('/due/:date', asyncWrapper(taskController.getTasksDueBy));

router.get('/stats/status', asyncWrapper(taskController.getStatusStats));
router.get('/stats/priority', asyncWrapper(taskController.getPriorityStats));

module.exports = router;