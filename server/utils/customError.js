class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indicates if this error is operational (non-programming error):like invalid input, resource not found, etc.
        Error.captureStackTrace(this, this.constructor); // file location error file
    }
}

module.exports = CustomError;