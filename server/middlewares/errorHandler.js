const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
    let customError = err;

    if (err instanceof CustomError) {
        customError.message = err.message || 'Something went wrong';
        customError.statusCode = err.statusCode || 500;
    } else {
        // Uncaught errors, programming mistakes, or unexpected errors
        customError = new CustomError('Internal Server Error', 500);
        console.error('Unexpected Error:', err);
    }

    res.status(customError.statusCode).json({
        success: false,
        message: customError.message,
        // stack: process.env.NODE_ENV === 'production' ? null : customError.stack
    });
};

module.exports = errorHandler;
