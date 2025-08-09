const express = require('express')
const models = require('./src/models/index')
// const authRouter = require('./src/routes/auth.route')
// const paymentRouter = require('./src/routes/payment.route')
// const emailRouter = require('./src/routes/email.route')
// const smsRouter = require('./src/routes/sms.route')
const env = require('dotenv')
// const corsPolicy = require('./src/middleware/corsPolicy')
// const session = require('express-session')
// const passport = require('./src/services/auth.service')
const router = require('./src/routes/route.route')
const cors = require('cors');
env.config()

app.use(cors({
  origin: '*'
}));

const app = express()
app.use(express.json());
// app.use(corsPolicy);

// Session Configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api/v1', router);
// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/payment', paymentRouter);
// app.use('/api/v1/email', emailRouter);
// app.use('/api/v1/sms', smsRouter);

let PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));













