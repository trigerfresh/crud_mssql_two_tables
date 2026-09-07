const sql = require('mssql')
require('dotenv').config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE,
  },
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to MSSQL Database')
    return pool
  })
  .catch((err) => {
    console.error('Database Connection Failed! Bad Config: ', err)
    throw err
  })

module.exports = {
  sql,
  poolPromise,
}

