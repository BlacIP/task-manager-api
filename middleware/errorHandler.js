// middleware/errorHandler.js
const { AppError } = require('../helpers/errorTypes');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    let value;
    try {
        value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    } catch {
        value = Object.values(err.keyValue)[0];
    }
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors || {}).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } 
    // Programming or other unknown error: don't leak error details
    else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

const errorHandler = (err, req, res, next) => {
    // Ensure error object has basic properties
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        // Create a new error object with all properties
        let error = Object.create(Object.getPrototypeOf(err));
        Object.assign(error, err);
        
        // Preserve the message
        error.message = err.message;

        // Handle specific error types
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        
        // Handle MongoDB specific errors
        if (error.kind === 'ObjectId') {
            error = new AppError('Invalid ID format', 400);
        }

        // Handle unexpected errors
        if (!error.isOperational) {
            error = new AppError('Something went wrong!', 500);
        }

        sendErrorProd(error, res);
    }
};

module.exports = errorHandler;
