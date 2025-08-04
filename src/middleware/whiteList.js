// const geoip = require('geoip-lite');

// const blockAfghanistan = (req, res, next) => {
//     const ip = req.ip || req.connection.remoteAddress;
//     const geo = geoip.lookup(ip);
//     if (geo && geo.country === 'AF') {
//       return res.status(403).send('دسترسی از افغانستان مجاز نیست.');
//     }
    
//     next();
//   };

// module.exports = blockAfghanistan;


let whiteList = [
    '127.0.0.1',
    '::1',
    '::ffff:127.0.0.1',
    '::ffff:::1',    
]
const blickIP = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if(ipRangeCheck(ip, whiteList)){
    return res.status(403).send('دسترسی از افغانستان مجاز نیست.');
  }
  next();
}

module.exports = blickIP;