// Custom error class that extends the built-in Error class
class ExpressError extends Error {
     /**
     * Construct a new ExpressError instance.
     * message - The error message.
     * statusCode - The HTTP status code associated with the error.
     */
    constructor(message, statusCode) {
        super();
        this.message = message; 
        this.statusCode = statusCode; 
    }
}

module.exports = ExpressError;