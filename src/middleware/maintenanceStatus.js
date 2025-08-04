const maintenanceStatus = (req, res, next) => {
    // You can store this in environment variables or database
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    
    // List of paths that should be accessible during maintenance
    const allowedPaths = [
        '/api/health',
        '/api/maintenance-status',
        '/api/auth/login',
        '/api/auth/register'
    ];

    // Check if the current path is in the allowed paths
    const isAllowedPath = allowedPaths.some(path => req.path.startsWith(path));

    if (isMaintenanceMode && !isAllowedPath) {
        return res.status(503).json({
            status: 'error',
            message: 'System is currently under maintenance. Please try again later.',
            maintenanceEndTime: process.env.MAINTENANCE_END_TIME || 'Unknown'
        });
    }

    next();
};

module.exports = maintenanceStatus; 