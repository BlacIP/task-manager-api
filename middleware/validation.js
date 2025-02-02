const { ValidationError } = require('../helpers/errorTypes');
const validateTask = (req, res, next) => {
    const { title, description, dueDate, priority, status, assignedUser } = req.body;

    if (!title || !description || !dueDate || !assignedUser) {
        return res.status(400).json({
            message: 'Missing required fields',
            required: ['title', 'description', 'dueDate', 'assignedUser']
        });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
            message: 'Invalid priority value',
            allowedValues: ['low', 'medium', 'high']
        });
    }

    if (status && !['pending', 'in-progress', 'not-started', 'completed'].includes(status)) {
        return res.status(400).json({
            message: 'Invalid status value',
            allowedValues: ['pending', 'in-progress', 'not-started', 'completed']
        });
    }

    const dateObj = new Date(dueDate);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
            message: 'Invalid date format'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(assignedUser)) {
        return res.status(400).json({
            message: 'Invalid email format for assignedUser'
        });
    }

    next();
};

const validateDateRange = (req, res, next) => {
    const { startDate, endDate, dateField } = req.body;
    
    if (!startDate || !endDate || !dateField) {
        return res.status(400).json({
            status: 'fail',
            message: 'Start date, end date, and date field are required'
        });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid date format. Use YYYY-MM-DD'
        });
    }

    if (start > end) {
        return res.status(400).json({
            status: 'fail',
            message: 'Start date must be before end date'
        });
    }

    const validDateFields = ['createdDate', 'dueDate'];
    if (!validDateFields.includes(dateField)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid date field. Use "createdDate" or "dueDate"'
        });
    }

    next();
};

const validateStatusArray = (req, res, next) => {
    const { statuses } = req.body;

    if (!Array.isArray(statuses) || statuses.length === 0) {
        return res.status(400).json({
            message: 'statuses must be a non-empty array'
        });
    }

    const validStatuses = ['pending', 'in-progress', 'not-started', 'completed'];
    const invalidStatus = statuses.find(status => !validStatuses.includes(status));

    if (invalidStatus) {
        return res.status(400).json({
            message: `Invalid status: ${invalidStatus}`,
            allowedValues: validStatuses
        });
    }

    next();
};

const validatePriorityArray = (req, res, next) => {
    const { priorities } = req.body;

    if (!Array.isArray(priorities) || priorities.length === 0) {
        return res.status(400).json({
            message: 'priorities must be a non-empty array'
        });
    }

    const validPriorities = ['low', 'medium', 'high'];
    const invalidPriority = priorities.find(priority => !validPriorities.includes(priority));

    if (invalidPriority) {
        return res.status(400).json({
            message: `Invalid priority: ${invalidPriority}`,
            allowedValues: validPriorities
        });
    }

    next();
};;

const validateUser = (req, res, next) => {
    const { email, name } = req.body;

    if (!email || !name) {
        throw new ValidationError('Email and name are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
        throw new ValidationError('Name must be at least 2 characters long');
    }

    next();
};

const validateUserId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError('Invalid user ID format');
    }

    next();
};

const validateEmail = (req, res, next) => {
    const { email } = req.params;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
    }

    next();
};

module.exports = { 
    validateTask,
    validateDateRange,
    validateStatusArray,
    validatePriorityArray, 
    validateUser,validateUserId,
    validateEmail };
