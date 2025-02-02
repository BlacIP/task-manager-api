// models/task.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');
const { 
    TaskNotFoundError,
    TaskValidationError,
    InvalidTaskStatusError,
    InvalidTaskPriorityError,
    InvalidDateError,
    AppError
} = require('../helpers/errorTypes');

const getTaskCollection = () => {
    const db = getDb();
    return db.collection('task');
};

class Task {
    static async findAll() {
        try {
            const collection = getTaskCollection();
            return await collection.find({}).toArray();
        } catch (error) {
            throw new AppError('Error fetching tasks', 500);
        }
    }

    static async findById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new TaskValidationError('Invalid task ID format');
            }

            const collection = getTaskCollection();
            const task = await collection.findOne({ _id: new ObjectId(id) });
            
            if (!task) {
                throw new TaskNotFoundError(`No task found with id: ${id}`);
            }

            return task;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching task', 500);
        }
    }

    static async findByAssignedUser(email) {
        try {
            if (!email || typeof email !== 'string') {
                throw new TaskValidationError('Invalid email format');
            }

            const collection = getTaskCollection();
            const tasks = await collection.find({ assignedUser: email }).toArray();
            return tasks;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching user tasks', 500);
        }
    }

    static async create(taskData) {
        try {
            // Validate required fields
            const requiredFields = ['title', 'description', 'dueDate', 'assignedUser'];
            for (const field of requiredFields) {
                if (!taskData[field]) {
                    throw new TaskValidationError(`${field} is required`);
                }
            }

            // Validate date
            const dueDate = new Date(taskData.dueDate);
            if (isNaN(dueDate.getTime())) {
                throw new InvalidDateError('Invalid due date format');
            }

            // Validate priority
            const validPriorities = ['low', 'medium', 'high'];
            if (taskData.priority && !validPriorities.includes(taskData.priority)) {
                throw new InvalidTaskPriorityError('Priority must be low, medium, or high');
            }

            // Validate status
            const validStatuses = ['pending', 'in-progress', 'not-started', 'completed'];
            if (taskData.status && !validStatuses.includes(taskData.status)) {
                throw new InvalidTaskStatusError('Status must be pending, in-progress, not-started, or completed');
            }

            const collection = getTaskCollection();
            const task = {
                ...taskData,
                dueDate,
                priority: taskData.priority || 'medium',
                status: taskData.status || 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await collection.insertOne(task);
            return { _id: result.insertedId, ...task };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error creating task', 500);
        }
    }

    static async update(id, updateData) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new TaskValidationError('Invalid task ID format');
            }
    
            const objectId = new ObjectId(id);
            const collection = getTaskCollection();
    
            // Verify task exists first
            const existingTask = await collection.findOne({ _id: objectId });
            //console.log('Existing task:', existingTask);
            
            if (!existingTask) {
                throw new TaskNotFoundError(`No task found with id: ${id}`);
            }
    
            // Perform validation
            if (updateData.dueDate) {
                const dueDate = new Date(updateData.dueDate);
                if (isNaN(dueDate.getTime())) {
                    throw new InvalidDateError('Invalid due date format');
                }
                updateData.dueDate = dueDate;
            }
    
            // Update document
            const updateResult = await collection.updateOne(
                { _id: objectId },
                { 
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                }
            );
    
            //console.log('Update result:', updateResult);
    
            if (updateResult.matchedCount === 0) {
                throw new TaskNotFoundError(`No task found with id: ${id}`);
            }
    
            // Fetch and return updated document
            const updatedTask = await collection.findOne({ _id: objectId });
            return updatedTask;
    
        } catch (error) {
            //console.error(`Error updating task with ID: ${id}`, error);
            if (error instanceof AppError) throw error;
            throw new AppError('Error updating task', 500);
        }
    }

    static async delete(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new TaskValidationError('Invalid task ID format');
            }

            const collection = getTaskCollection();
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                throw new TaskNotFoundError(`No task found with id: ${id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error deleting task', 500);
        }
    }

    static async getTasksByStatus(status) {
        try {
            const validStatuses = ['pending', 'in-progress', 'not-started', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new InvalidTaskStatusError('Invalid status value');
            }

            const collection = getTaskCollection();
            return await collection.find({ status }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by status', 500);
        }
    }

    static async getTasksByPriority(priority) {
        try {
            const validPriorities = ['low', 'medium', 'high'];
            if (!validPriorities.includes(priority)) {
                throw new InvalidTaskPriorityError('Invalid priority value');
            }

            const collection = getTaskCollection();
            return await collection.find({ priority }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by priority', 500);
        }
    }

    static async getTasksDueBy(date) {
        try {
            const dueDate = new Date(date);
            if (isNaN(dueDate.getTime())) {
                throw new InvalidDateError('Invalid date format');
            }

            const collection = getTaskCollection();
            return await collection.find({
                dueDate: { $lte: dueDate }
            }).sort({ dueDate: 1 }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by due date', 500);
        }
    }

    static async getTasksByDateRange(startDate, endDate, dateField) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new InvalidDateError('Invalid date format. Use YYYY-MM-DD');
            }

            if (start > end) {
                throw new InvalidDateError('Start date must be before end date');
            }

            const validDateFields = ['createdDate', 'dueDate'];
            if (!validDateFields.includes(dateField)) {
                throw new TaskValidationError('Invalid date field. Use "createdDate" or "dueDate"');
            }

            const collection = getTaskCollection();
            const query = {};
            query[dateField] = {
                $gte: start,
                $lte: end
            };

            return await collection
                .find(query)
                .sort({ [dateField]: 1 })
                .toArray();

        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by date range', 500);
        }
    }
    static async getOverdueTasks() {
        try {
            const collection = getTaskCollection();
            const now = new Date();
            return await collection
                .find({
                    dueDate: { $lt: now },
                    status: { $ne: 'completed' }
                })
                .sort({ dueDate: 1 })
                .toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching overdue tasks', 500);
        }
    }

    static async getStatusStats() {
        try {
            const collection = getTaskCollection();
            return await collection.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();
        } catch (error) {
            throw new AppError('Error fetching status statistics', 500);
        }
    }

    static async getPriorityStats() {
        try {
            const collection = getTaskCollection();
            return await collection.aggregate([
                {
                    $group: {
                        _id: "$priority",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();
        } catch (error) {
            throw new AppError('Error fetching priority statistics', 500);
        }
    }

    static async searchTasks(searchTerm) {
        try {
            if (!searchTerm || typeof searchTerm !== 'string') {
                throw new TaskValidationError('Invalid search term');
            }

            const collection = getTaskCollection();
            return await collection.find({
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error searching tasks', 500);
        }
    }
    static async getUserTasksCount(email) {
        try {
            if (!email || typeof email !== 'string') {
                throw new TaskValidationError('Invalid email format');
            }

            const collection = getTaskCollection();
            return await collection.aggregate([
                { 
                    $match: { 
                        assignedUser: email 
                    } 
                },
                { 
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        status: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ]).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching user task statistics', 500);
        }
    }
    
    static async getTasksByStatuses(statuses) {
        try {
            if (!Array.isArray(statuses)) {
                throw new TaskValidationError('Statuses must be an array');
            }

            const validStatuses = ['pending', 'in-progress', 'not-started', 'completed'];
            statuses.forEach(status => {
                if (!validStatuses.includes(status)) {
                    throw new InvalidTaskStatusError(`Invalid status: ${status}`);
                }
            });

            const collection = getTaskCollection();
            return await collection.find({
                status: { $in: statuses }
            }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by statuses', 500);
        }
    }
    
    static async getTasksByPriorities(priorities) {
        try {
            if (!Array.isArray(priorities)) {
                throw new TaskValidationError('Priorities must be an array');
            }

            const validPriorities = ['low', 'medium', 'high'];
            priorities.forEach(priority => {
                if (!validPriorities.includes(priority)) {
                    throw new InvalidTaskPriorityError(`Invalid priority: ${priority}`);
                }
            });

            const collection = getTaskCollection();
            return await collection.find({
                priority: { $in: priorities }
            }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by priorities', 500);
        }
    }

    static async getRecentTasks() {
        try {
            const collection = getTaskCollection();
            return await collection
                .find({})
                .sort({ createdDate: -1 })
                .limit(10)
                .toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching recent tasks', 500);
        }
    }
}

module.exports = Task;
