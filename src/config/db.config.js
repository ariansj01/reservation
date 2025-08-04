// dev
const {Sequelize} = require('sequelize')

const dbSequelize = new Sequelize('salon_app' , 'root' , '' , {
  dialect : 'mysql',
  host : 'localhost',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
})

dbSequelize
.authenticate()
.then(() => console.log('Connected Successfully!'))
.catch(() => console.log('Error to connecte!'))

module.exports = dbSequelize

// pro
// const {Sequelize} = require('sequelize')

// const dbSequelize = new Sequelize('ariansji_consertDB' , 'ariansji_conserDB' , 'Dx9V);eV^ZLm', {
//   dialect : 'mysql',
//   host : 'localhost',
//   charset: 'utf8mb4',
//   collate: 'utf8mb4_unicode_ci',
//   define: {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_unicode_ci'
//   }
// })

// dbSequelize
// .authenticate()
// .then(() => console.log('Connected Successfully!'))
// .catch(() => console.log('Error to connecte!'))

// module.exports = dbSequelize