// controllers/task.js
const Task = require('../models/task');
const AppError = require('../helpers/errorTypes');

const taskController = {
    // Basic CRUD operations
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

    // User-specific tasks
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

    // Status and Priority based queries
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
            const { statuses } = req.body; // Expect array of statuses
            const tasks = await Task.getTasksByStatuses(statuses);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByPriorities(req, res) {
        try {
            const { priorities } = req.body; // Expect array of priorities
            const tasks = await Task.getTasksByPriorities(priorities);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Date-based queries
    async getTasksDueBy(req, res) {
        try {
            const tasks = await Task.getTasksDueBy(req.params.date);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getTasksByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const tasks = await Task.getTasksByDateRange(startDate, endDate);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getRecentTasks(req, res) {
        try {
            const days = parseInt(req.query.days) || 7;
            const tasks = await Task.getRecentTasks(days);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getOverdueTasks(req, res) {
        try {
            const tasks = await Task.getOverdueTasks();
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Statistics
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

    // Search
    async searchTasks(req, res) {
        try {
            const { searchTerm } = req.query;
            if (!searchTerm) {
                return res.status(400).json({ message: 'Search term is required' });
            }
            const tasks = await Task.searchTasks(searchTerm);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = taskController;
