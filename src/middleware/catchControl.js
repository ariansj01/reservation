const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        requestId: req.requestId,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Default error status and message
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'An error occurred' 
        : err.message;

    res.status(status).json({
        error: {
            message,
            requestId: req.requestId,
            timestamp: new Date().toISOString()
        }
    });
};

module.exports = errorHandler; 