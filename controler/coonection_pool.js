const util = require('util')

const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'coachticketbookingdb'
})

pool.getConnection((err, connection) => {
    if (err) {
        console.log('Something went wrong connecting to the databse :', err)
    }
    if (connection) connection.release();
    return;
})

pool.query = util.promisify(pool.query).bind(pool)

module.exports = pool