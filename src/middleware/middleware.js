const express = require('express');
const app = express();
const limiter = require('./reteLimiter');
const blickIP = require('./whiteList');
const hstsHeader = require('./hstsHeader');
const xssChecker = require('./xssChecker');
const sanitize = require('./sanitizHTML');
const responseTime = require('./responseTime');
const timeoutMiddleware = require('./connection-Timeout');
const maintenanceStatus = require('./maintenanceStatus');
const corsPolicy = require('./corsPolicy');


// app.use(corsPolicy(corsOptions));
app.use(hstsHeader);
app.use(blickIP);
app.use(limiter);
app.use(xssChecker);
app.use(sanitize);
app.use(responseTime);
app.use(timeoutMiddleware);
app.use(maintenanceStatus);
