const helmet = require('helmet');
const hstsHeader = (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    next();
}

module.exports = hstsHeader;

// helmet.hsts({
//     maxAge: 31536000,
//     includeSubDomains: true,
//     preload: true
// })
