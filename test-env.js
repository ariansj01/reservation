require('dotenv').config();

// Debug: Log environment variables to verify they're working
console.log('Environment Variables Check:');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || 'Not set (using default)');
console.log('MYSQLUSER:', process.env.MYSQLUSER || 'Not set (using default)');
console.log('MYSQLHOST:', process.env.MYSQLHOST || 'Not set (using default)');
console.log('MYSQLPORT:', process.env.MYSQLPORT || 'Not set (using default)');
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? 'Set (hidden for security)' : 'Not set (using default)');