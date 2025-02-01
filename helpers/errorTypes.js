// helpers/errorTypes.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

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

module.exports = {
    AppError,
    UserNotFoundError,
    DuplicateEmailError,
    ValidationError
};
