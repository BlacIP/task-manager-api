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

            // Validate date if provided
            if (updateData.dueDate) {
                const dueDate = new Date(updateData.dueDate);
                if (isNaN(dueDate.getTime())) {
                    throw new InvalidDateError('Invalid due date format');
                }
                updateData.dueDate = dueDate;
            }

            // Validate priority if provided
            if (updateData.priority) {
                const validPriorities = ['low', 'medium', 'high'];
                if (!validPriorities.includes(updateData.priority)) {
                    throw new InvalidTaskPriorityError('Priority must be low, medium, or high');
                }
            }

            // Validate status if provided
            if (updateData.status) {
                const validStatuses = ['pending', 'in-progress', 'not-started', 'completed'];
                if (!validStatuses.includes(updateData.status)) {
                    throw new InvalidTaskStatusError('Status must be pending, in-progress, not-started, or completed');
                }
            }

            const collection = getTaskCollection();
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { 
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                },
                { returnDocument: 'after' }
            );

            if (!result.value) {
                throw new TaskNotFoundError(`No task found with id: ${id}`);
            }

            return result.value;
        } catch (error) {
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

    static async getTasksByDateRange(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new InvalidDateError('Invalid date format');
            }

            if (start > end) {
                throw new TaskValidationError('Start date must be before end date');
            }

            const collection = getTaskCollection();
            return await collection.find({
                dueDate: { 
                    $gte: start,
                    $lte: end
                }
            }).sort({ dueDate: 1 }).toArray();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching tasks by date range', 500);
        }
    }

    static async getOverdueTasks() {
        try {
            const collection = getTaskCollection();
            return await collection.find({
                dueDate: { $lt: new Date() },
                status: { $ne: 'completed' }
            }).sort({ dueDate: 1 }).toArray();
        } catch (error) {
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
}

module.exports = Task;
