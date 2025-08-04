const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        await jwt.verify(token, 'tfygy^&%^$tfgu786ug^&55ui' , (err , decode) => {
            if(err){
                return res.status(401).json({ message: 'Invalid token' , error : err});
            }
            req.user = decode;
            next();
        });
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' , error : error});
    }
};

module.exports = checkAuth;
