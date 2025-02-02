class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        this.name = this.constructor.name;


        Error.captureStackTrace(this, this.constructor);
    }
}

class UserNotFoundError extends AppError {
    constructor(message = 'User not found') {
        super(message, 404);
    }
}

class DuplicateEmailError extends AppError {
    constructor(message = 'Email already exists') {
        super(message, 409);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class TaskNotFoundError extends AppError {
    constructor(message = 'Task not found') {
        super(message, 404);
    }
}

class TaskValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class DuplicateTaskError extends AppError {
    constructor(message = 'Task with similar details already exists') {
        super(message, 409);
    }
}

class InvalidTaskStatusError extends AppError {
    constructor(message = 'Invalid task status') {
        super(message, 400);
    }
}

class InvalidTaskPriorityError extends AppError {
    constructor(message = 'Invalid task priority') {
        super(message, 400);
    }
}

class InvalidDateError extends AppError {
    constructor(message = 'Invalid date format') {
        super(message, 400);
    }
}

module.exports = {
    AppError,
    UserNotFoundError,
    DuplicateEmailError,
    ValidationError,
    TaskNotFoundError,
    TaskValidationError,
    DuplicateTaskError,
    InvalidTaskStatusError,
    InvalidTaskPriorityError,
    InvalidDateError
};
