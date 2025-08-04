const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 10,
    message: 'شما بیش از حد درخواست ارسال کرده‌اید. لطفاً بعداً دوباره تلاش کنید.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiter;