// const cors = require('cors');

// const corsOptions = {
//     origin: function (origin, callback) {
//         const allowedOrigins = [
//             'http://localhost:5173',
//             'http://localhost:5174',
//             'http://127.0.0.1:5173',
//             'http://127.0.0.1:5174',
//             'http://localhost:8080',
//             'http://127.0.0.1:8080',
//             'http://127.0.0.1:8080/api/v1',
//             'https://booking.ariansj.ir',
//             'http://booking.ariansj.ir',
//             '*'
//         ];
        
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: [
//         'Content-Type',
//         'Authorization',
//         'X-Requested-With',
//         'Accept',
//         'Origin',
//         'Access-Control-Allow-Origin',
//         'Access-Control-Allow-Headers',
//         'Access-Control-Allow-Methods',
//         'Access-Control-Allow-Credentials'
//     ],
//     exposedHeaders: [
//         'Content-Type',
//         'Authorization',
//         'Access-Control-Allow-Origin',
//         'Access-Control-Allow-Headers',
//         'Access-Control-Allow-Methods',
//         'Access-Control-Allow-Credentials'
//     ],
//     credentials: true,
//     maxAge: 86400, // 24 hours
//     optionsSuccessStatus: 200 // For legacy browser support
// };

// module.exports = cors(corsOptions);

const cors = require('cors');
const allowedOrigins = ['https://reservation-flame-xi.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true); // برای تست با Postman و غیره
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
