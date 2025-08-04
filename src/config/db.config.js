// Load environment variables
require('dotenv').config();

const {Sequelize} = require('sequelize')

// Check if we're in production (Railway) or development
const isProduction = process.env.MYSQLDATABASE && process.env.MYSQLUSER && process.env.MYSQLPASSWORD;

let dbSequelize;

if (isProduction) {
  // Production: Use MySQL with Railway environment variables
  dbSequelize = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWORD,
    {
      dialect: 'mysql',
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT || 3306,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    }
  );
} else {
  // Development: Use SQLite
  dbSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

dbSequelize
.authenticate()
.then(() => console.log('Connected Successfully!'))
.catch((error) => console.log('Error to connecte!', error.message))

module.exports = dbSequelize
