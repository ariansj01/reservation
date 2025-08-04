const sanitizHTML = require('sanitize-html');

const sanitize = (req, res, next) => {
    const objValue = (obj) => {
        for(let key in obj){
            const value = obj[key];
            if(typeof value === 'string'){
                obj[key] = sanitize(value , {
                    allowedTags: [],
                    allowedAttributes: {},
                });
            }
            if(typeof value === 'object' && value !== null){
                objValue(value);
            }
        }
        objValue(req.body || req.query || req.params);
        next();
    }
}

module.exports = sanitize;
