const xssChecker = (req, res, next) => {
    const objValue = (obj) => {
        for(let key in obj){
            const value = obj[key];
            if(typeof value === 'string' && /<script.*?>.*?<\/script>/gi.test(value)){
                return true
            }
            if(typeof value === 'object' && value !== null){
                if(objValue(value)){
                    return true
                }
            }
            if(Array.isArray(value)){
                if(value.some(item => objValue(item))){
                    return true
                }
            }
            if(objValue(req.body || req.query || req.params)){
                return res.status(400).json({ message: 'XSS attack detected'})
            }
            next()
        }
    }
    
}

module.exports = xssChecker;
