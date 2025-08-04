const { v4: uuidv4 } = require('uuid');

const requestId = (req, res, next) => {
    const requestId = uuidv4();
    
    // Add request ID to request object
    req.requestId = requestId;
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    
    next();
};

module.exports = requestId; 