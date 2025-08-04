const maintanenceStatus = (req, res, next) => {
    const isMaintanence = true;
    if(isMaintanence){
        return res.status(503).json({ message: 'Service is currently down for maintenance' });
    }
    next();
}

module.exports = maintanenceStatus;
