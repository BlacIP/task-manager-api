const Task = require('../models/task');
const AppError = require('../helpers/errorTypes');

const taskController = {
    async getAllTasks(req, res) {
        const tasks = await Task.findAll();
        res.json(tasks);
    },

    async getTaskById(req, res) {
        const task = await Task.findById(req.params.id);
        if (!task) {
            throw new AppError('Task not found', 404);
        }
        res.json(task);
    },

    async createTask(req, res) {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    },

    async updateTask(req, res) {
        //console.log(`Request to update task with ID: ${req.params.id}`);
        //console.log(`Request body: ${JSON.stringify(req.body)}`);
        
        const task = await Task.update(req.params.id, req.body);
        if (!task) {
            throw new AppError('Task not found', 404);
        }
        res.json(task);
    },

    async deleteTask(req, res) {
        const result = await Task.delete(req.params.id);
        if (result.deletedCount === 0) {
            throw new AppError('Task not found', 404);
        }
        res.json({ message: 'Task deleted successfully' });
    },

    async getTasksByUser(req, res) {
        try {
            const tasks = await Task.findByAssignedUser(req.params.email);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getUserTasksCount(req, res) {
        try {
            const stats = await Task.getUserTasksCount(req.params.email);
            res.json(stats);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByStatus(req, res) {
        try {
            const tasks = await Task.getTasksByStatus(req.params.status);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByPriority(req, res) {
        try {
            const tasks = await Task.getTasksByPriority(req.params.priority);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByStatuses(req, res) {
        try {
            const { statuses } = req.body;
            const tasks = await Task.getTasksByStatuses(statuses);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByPriorities(req, res) {
        try {
            const { priorities } = req.body;
            const tasks = await Task.getTasksByPriorities(priorities);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    async getTasksDueBy(req, res) {
        try {
            const tasks = await Task.getTasksDueBy(req.params.date);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByDateRange(req, res) {
        const { startDate, endDate, dateField } = req.body;
        if (!startDate || !endDate || !dateField) {
            throw new AppError('Start date, end date, and date field are required', 400);
        }
        const tasks = await Task.getTasksByDateRange(startDate, endDate, dateField);
        res.json({
            status: 'success',
            data: tasks
        });
    },

    async getRecentTasks(req, res) {
        const tasks = await Task.getRecentTasks();
        res.json({
            status: 'success',
            data: tasks
        });
    },

    async getOverdueTasks(req, res) {
        const tasks = await Task.getOverdueTasks();
        res.json({
            status: 'success',
            data: tasks
        });
    },

    async getStatusStats(req, res) {
        try {
            const stats = await Task.getStatusStats();
            res.json(stats);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getPriorityStats(req, res) {
        try {
            const stats = await Task.getPriorityStats();
            res.json(stats);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    async searchTasks(req, res) {
        const { searchTerm } = req.query;
        if (!searchTerm) {
            throw new AppError('Search term is required', 400);
        }
        const tasks = await Task.searchTasks(searchTerm);
        res.json({
            status: 'success',
            data: tasks
        });
    }
};

module.exports = taskController;
